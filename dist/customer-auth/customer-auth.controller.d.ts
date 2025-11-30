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
            _id: import("mongoose").Types.ObjectId;
            user: import("mongoose").Document<unknown, {}, import("../customer/entities/customer.entity").Customer, {}, {}> & import("../customer/entities/customer.entity").Customer & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
        };
        message: string;
    }>;
    refreshToken(dto: RefreshTokenDto, res: Response): Promise<CustomResponse<{
        accessToken: string;
        refreshToken: string;
    }>>;
}
