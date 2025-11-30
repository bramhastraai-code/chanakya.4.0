/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
        user: import("mongoose").Document<unknown, {}, Builder> & Builder & {
            _id: Types.ObjectId;
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
        value: any;
        label: string;
    }[]>;
    getBuildersWithProjectCount(): Promise<(import("mongoose").Document<unknown, {}, Builder> & Builder & {
        _id: Types.ObjectId;
    })[]>;
}
