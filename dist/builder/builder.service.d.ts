import { Model } from 'mongoose';
import { Builder } from './entities/builder.entity';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { Project } from 'src/project/entities/project.entity';
import { Status } from 'src/common/enum/status.enum';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class BuilderService {
    private readonly builderModel;
    private readonly projectModel;
    private jwt;
    private config;
    private readonly clientId;
    private readonly clientSecret;
    private readonly otpApiUrl;
    private readonly otpExpiry;
    private readonly otpLength;
    private readonly verifyUrl;
    constructor(builderModel: Model<Builder>, projectModel: Model<Project>, jwt: JwtService, config: ConfigService);
    sendOtp_less(phoneNumber: string): Promise<any>;
    verifyOtp_less(phoneNumber: string, requestId: string, otp: string): Promise<any>;
    generateTokens(userId: Types.ObjectId, phoneNumber: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: Types.ObjectId, refreshToken: string): Promise<void>;
    refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, Builder, {}, {}> & Builder & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    create(createBuilderDto: CreateBuilderDto): Promise<Builder>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<{
        builders: Builder[];
        totalPages: number;
        totalBuilders: number;
        pageSize: number;
        pageNumber: number;
    }>;
    findOne(id: string): Promise<Builder>;
    findByPhone(phone: string): Promise<Builder | null>;
    findByOwnerId(ownerId: string): Promise<Builder[]>;
    update(id: string, updateBuilderDto: UpdateBuilderDto): Promise<Builder>;
    remove(id: string): Promise<boolean>;
    BuilderList(): Promise<{
        value: unknown;
        label: string;
    }[]>;
    getBuildersWithProjectCount(): Promise<(import("mongoose").Document<unknown, {}, Builder, {}, {}> & Builder & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
