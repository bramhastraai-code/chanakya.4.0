import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { AuthService } from 'src/auth/auth.service';
import { Types } from 'mongoose';
import { Status } from 'src/common/enum/status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private auth: AuthService,
  ) {}

  async findAll(
    pageSize: string,
    pageNumber: string,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    searchQuery?: string, // Optional search query parameter
    role?: Types.ObjectId | 'all', // Optional role filter
    status?: Status,
  ): Promise<{
    users: User[];
    totalPages: number;
    totalUsers: number;
    pageSize: number;
    pageNumber: number;
  }> {
    try {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;

      // Build the search filter
      const searchFilter: any = {};

      // If a search query is provided, add a regex filter for name and email
      if (searchQuery) {
        searchFilter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      // If a role filter is provided, add it to the search filter
      console.log('role', role);

      if (role !== 'all') {
        searchFilter.role = role;
      }
      if (status !== 'all') {
        searchFilter.status = status;
      }

      // Get the total number of users (without pagination)
      const totalUsers = await this.userModel
        .countDocuments(searchFilter)
        .exec();

      // Fetch paginated user data
      const users = await this.userModel
        .find(searchFilter) // Apply search filter
        .skip(skip)
        .limit(limit)
        .populate('role') // Populate the role field
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }) // Sort by the specified field and order
        .exec();

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);

      // Return paginated data along with pagination metadata
      return {
        users,
        totalPages,
        totalUsers,
        pageSize: limit,
        pageNumber: parseInt(pageNumber),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      const populatedUserQuery = this.userModel.findById(id);
      if (user.role) {
        populatedUserQuery.populate('role');
      }

      const populatedUser = await populatedUserQuery.exec();

      return populatedUser;
    } catch (error) {
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
      createUserDto.password = await argon.hash(createUserDto.password);
      const createdUser = new this.userModel(createUserDto);
      const response = await createdUser.save();
      console.log('user cr4ate', createUserDto);

      const { refreshToken } = await this.auth.generateTokens(
        createdUser._id,
        createdUser.email,
      );

      await this.auth.updateRefreshToken(createdUser._id, refreshToken);
      return response;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .populate('role')
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return updatedUser;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel
        .findByIdAndDelete(id)
        .populate('role')
        .exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return deletedUser;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      throw error;
    }
  }
}
