import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateCustomerAuthDto } from './dto/create-customer-auth.dto';
import { Otp } from './entity/otp.entity';
import { CustomerService } from 'src/customer/customer.service';
export declare class CustomerAuthService {
    private customerModel;
    private otpModel;
    private jwt;
    private config;
    private customerService;
    private readonly clientId;
    private readonly clientSecret;
    private readonly otpApiUrl;
    private readonly otpExpiry;
    private readonly otpLength;
    private readonly verifyUrl;
    constructor(customerModel: Model<Customer>, otpModel: Model<Otp>, jwt: JwtService, config: ConfigService, customerService: CustomerService);
    sendOtp(phoneNumber: string): Promise<string>;
    sendOtp_less(phoneNumber: string): Promise<any>;
    verifyOtp(phoneNumber: string, otp: string): Promise<{
        phoneNumber: string;
        _id: Types.ObjectId;
        newUser: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
    verifyOtp_less(phoneNumber: string, requestId: string, otp: string): Promise<any>;
    sendSms(mobile: string, message: string): Promise<void>;
    register(dto: CreateCustomerAuthDto, res: Response): Promise<{
        email: string;
        _id: unknown;
        user: import("mongoose").Document<unknown, {}, Customer, {}, {}> & Customer & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    generateTokens(userId: Types.ObjectId, phoneNumber: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: Types.ObjectId, refreshToken: string): Promise<void>;
    refreshToken(_id: Types.ObjectId, refreshToken: string, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: import("mongoose").Document<unknown, {}, Customer, {}, {}> & Customer & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
