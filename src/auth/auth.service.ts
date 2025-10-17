import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: UpdateAuthDto, res: Response) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .populate('role');
    if (!user) {
      throw new ForbiddenException('Unauthorized User');
    }
    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credential incorrect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id,
      user.email,
    );
    await this.updateRefreshToken(user._id, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('_id', JSON.stringify(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return {
      email: user.email,
      _id: user._id,
      accessToken,
      refreshToken,
      user,
    };
  }

  // async register(dto: CreateUserDto, res: Response) {
  //   const hash = await argon.hash(dto.password);
  //   const oldUser = await this.userModel.findOne({ email: dto.email });
  //   if (oldUser) {
  //     throw new ForbiddenException('Email is already in use');
  //   }
  //   dto.password = hash;
  //   const user = await new this.userModel(dto).save();

  //   const { accessToken, refreshToken } = await this.generateTokens(
  //     user._id,
  //     user.email,
  //   );
  //   await this.updateRefreshToken(user.id, refreshToken);

  //   res.cookie('accessToken', accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });
  //   res.cookie('refreshToken', refreshToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });
  //   res.cookie('_id', JSON.stringify(user._id), {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict',
  //   });

  //   return {
  //     email: user.email,
  //     _id: user._id,
  //     user,
  //   };
  // }

  async resetPassword(id: string, password: string) {
    console.log('updatedUser', id, password);
    try {
      const hash = await argon.hash(password);

      const updatedUser = await this.userModel
        .findByIdAndUpdate({ _id: id }, { password: hash }, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async generateTokens(userId: Types.ObjectId, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') || 'abc',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('JWT_REFRESH_SECRET') || 'abc',
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    console.log(userId, refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response) {
    const user = await this.userModel.findById({ _id }).populate('role');
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    // console.log(
    //   'refreshTokenlast',
    //   refreshTokenMatches,
    //   user,
    //   _id,
    //   refreshToken,
    // );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, newRefreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    console.log(newRefreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('_id', JSON.stringify(user._id), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken, refreshToken: newRefreshToken, user };
  }
}
