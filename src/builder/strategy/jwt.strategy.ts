import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Builder } from '../entities/builder.entity';

@Injectable()
export class adminJwtStrategy extends PassportStrategy(
  Strategy,
  'builder-jwt',
) {
  constructor(
    config: ConfigService,
    @InjectModel(Builder.name) private builderModel: Model<Builder>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.builderModel.findById({
      _id: payload.sub,
    });
    console.log('jwtStrategy builder validate payload', payload, user);
    // delete user.password;
    return user;
  }
}
