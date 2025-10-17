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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { Response as Resp } from 'express';
import { Status } from 'src/common/enum/status.enum';
import { Response } from 'src/common/interceptor/response.interface';
import { RefreshTokenDto } from 'src/customer-auth/dto/refresh-token.dto';
import { ProjectService } from 'src/project/project.service';
import { BuilderService } from './builder.service';
import { CreateBuilderDto } from './dto/create-builder.dto';
import { UpdateBuilderDto } from './dto/update-builder.dto';
import { Builder } from './entities/builder.entity';
export declare class BuilderController {
    private readonly builderService;
    private projectService;
    constructor(builderService: BuilderService, projectService: ProjectService);
    sendOtp_less(phoneNumber: string): Promise<{
        data: any;
        message: string;
    }>;
    verifyOtp_less(phoneNumber: string, requestId: string, otp: string): Promise<{
        data: any;
        message: string;
    }>;
    refreshToken(dto: RefreshTokenDto, res: Resp): Promise<Response<{
        accessToken: string;
        refreshToken: string;
    }>>;
    create(createBuilderDto: CreateBuilderDto): Promise<Response<Builder>>;
    findAll(pageSize?: string, pageNumber?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', searchQuery?: string, status?: Status): Promise<Response<{
        builders: Builder[];
        totalPages: number;
        totalBuilders: number;
        pageSize: number;
        pageNumber: number;
    }>>;
    findByOwnerId(req: any): Promise<Response<Builder[]>>;
    findOne(id: string): Promise<Response<Builder>>;
    update(id: string, updateBuilderDto: UpdateBuilderDto): Promise<Response<Builder>>;
    remove(id: string): Promise<void>;
    builderList(): Promise<Response<{
        value: string;
        label: string;
    }[]>>;
    getBuildersWithProjects(): Promise<{
        data: (import("mongoose").Document<unknown, {}, Builder> & Builder & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        message: string;
    }>;
    getBuilder(id: string): Promise<{
        data: {
            builder: Builder;
            projects: (import("mongoose").Document<unknown, {}, import("../project/entities/project.entity").Project> & import("../project/entities/project.entity").Project & {
                _id: import("mongoose").Types.ObjectId;
            })[];
        };
        message: string;
    }>;
    updateBuilder(req: any, updateBuilderDto: UpdateBuilderDto): Promise<Response<Builder>>;
    findOneBuilder(req: any): Promise<Response<Builder>>;
}
