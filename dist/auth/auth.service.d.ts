import { UpdateAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
export declare class AuthService {
    private userModel;
    private jwt;
    private config;
    constructor(userModel: Model<User>, jwt: JwtService, config: ConfigService);
    login(dto: UpdateAuthDto, res: Response): Promise<{
        email: any;
        _id: any;
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    resetPassword(id: string, password: string): Promise<any>;
    generateTokens(userId: Types.ObjectId, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: Types.ObjectId, refreshToken: string): Promise<void>;
    refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
}
