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
import { Response as CustomResponse } from 'src/common/interceptor/response.interface';
import { Response } from 'express';
import { CustomerAuthService } from './customer-auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateCustomerAuthDto } from './dto/create-customer-auth.dto';
export declare class CustomerAuthController {
    private authCustomerService;
    constructor(authCustomerService: CustomerAuthService);
    sendOtp(phoneNumber: string): Promise<CustomResponse<any>>;
    sendOtp_less(phoneNumber: string): Promise<{
        data: any;
        message: string;
    }>;
    verifyOtp(phoneNumber: string, otp: string): Promise<CustomResponse<any>>;
    verifyOtp_less(phoneNumber: string, requestId: string, otp: string): Promise<{
        data: any;
        message: string;
    }>;
    register(dto: CreateCustomerAuthDto, res: Response): Promise<{
        data: {
            email: string;
            _id: any;
            user: import("mongoose").Document<unknown, {}, import("../customer/entities/customer.entity").Customer> & import("../customer/entities/customer.entity").Customer & {
                _id: import("mongoose").Types.ObjectId;
            };
        };
        message: string;
    }>;
    refreshToken(dto: RefreshTokenDto, res: Response): Promise<CustomResponse<{
        accessToken: string;
        refreshToken: string;
    }>>;
}
