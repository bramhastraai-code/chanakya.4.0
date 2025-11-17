"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthService = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_entity_1 = require("../customer/entities/customer.entity");
const otp_entity_1 = require("./entity/otp.entity");
const crypto_1 = require("crypto");
const customer_service_1 = require("../customer/customer.service");
let CustomerAuthService = class CustomerAuthService {
    constructor(customerModel, otpModel, jwt, config, customerService) {
        this.customerModel = customerModel;
        this.otpModel = otpModel;
        this.jwt = jwt;
        this.config = config;
        this.customerService = customerService;
        this.clientId = process.env.OTP_LESS_CLIENT_ID;
        this.clientSecret = process.env.OTP_LESS_CLIENT_SECRET;
        this.otpApiUrl = process.env.OTP_LESS_URL;
        this.verifyUrl = process.env.OTP_LESS_VERIFY_URL;
        this.otpExpiry = parseInt(process.env.OTP_LESS_EXPIERY, 10) || 300;
        this.otpLength = parseInt(process.env.OTP_LENGTH, 10) || 4;
    }
    async sendOtp(phoneNumber) {
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        const expiresIn = new Date();
        expiresIn.setMinutes(expiresIn.getMinutes() + 5);
        await this.otpModel.create({ phoneNumber, otp, expiresIn });
        await this.sendSms(phoneNumber, `Your OTP is ${otp}`);
        return otp;
    }
    async sendOtp_less(phoneNumber) {
        console.log(phoneNumber);
        try {
            return {
                requestId: '5325',
            };
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOtp(phoneNumber, otp) {
        console.log(phoneNumber, otp);
        const otpRecord = await this.otpModel
            .findOne({ phoneNumber })
            .sort({ createdAt: -1 })
            .exec();
        (console.log('otpRecord', otpRecord), otpRecord);
        if (!otpRecord) {
            throw new common_1.BadRequestException('OTP not found');
        }
        const isOtpValid = otpRecord.otp === otp && otpRecord.expiresIn > new Date();
        if (!isOtpValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.otpModel.deleteOne({ _id: otpRecord._id }).exec();
        let newUser = false;
        let user = await this.customerService.findByMobile(phoneNumber);
        if (!user) {
            user = await this.customerService.create({ phoneNumber });
            newUser = true;
        }
        const { accessToken, refreshToken } = await this.generateTokens(user._id, user.phoneNumber);
        await this.updateRefreshToken(user._id, refreshToken);
        return {
            phoneNumber: user.phoneNumber,
            _id: user._id,
            newUser,
            accessToken,
            refreshToken,
        };
    }
    async verifyOtp_less(phoneNumber, requestId, otp) {
        try {
            if (requestId !== '5325' || otp !== '5325') {
                throw new common_1.HttpException({
                    message: 'invalid otp',
                    error: 'please try again  later',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            let newUser = false;
            let user = await this.customerService.findByMobile(phoneNumber);
            if (!user) {
                user = await this.customerService.create({ phoneNumber });
                newUser = true;
            }
            const { accessToken, refreshToken } = await this.generateTokens(user._id, user.phoneNumber);
            await this.updateRefreshToken(user._id, refreshToken);
            return {
                phoneNumber: user.phoneNumber,
                _id: user._id,
                newUser,
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async sendSms(mobile, message) {
        console.log(mobile, message);
    }
    async register(dto, res) {
        const oldUser = await this.customerModel.findOne({
            phoneNumber: dto.phoneNumber,
        });
        if (oldUser) {
            throw new common_1.ForbiddenException('phoneNumber is already in use');
        }
        const user = await new this.customerModel(dto).save();
        const { accessToken, refreshToken } = await this.generateTokens(user._id, user.phoneNumber);
        await this.updateRefreshToken(user.id, refreshToken);
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
            email: user.phoneNumber,
            _id: user._id,
            user,
        };
    }
    async generateTokens(userId, phoneNumber) {
        const payload = { sub: userId, phoneNumber };
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
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await argon.hash(refreshToken);
        console.log(userId, refreshToken);
        await this.customerModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async refreshToken(_id, refreshToken, res) {
        const user = await this.customerModel.findById({ _id });
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user._id, user.phoneNumber);
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
};
exports.CustomerAuthService = CustomerAuthService;
exports.CustomerAuthService = CustomerAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(otp_entity_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        customer_service_1.CustomerService])
], CustomerAuthService);
//# sourceMappingURL=customer-auth.service.js.map