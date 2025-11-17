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
exports.CustomerAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_auth_service_1 = require("./customer-auth.service");
const update_customer_auth_dto_1 = require("./dto/update-customer-auth.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const create_customer_auth_dto_1 = require("./dto/create-customer-auth.dto");
const console_1 = require("console");
let CustomerAuthController = class CustomerAuthController {
    constructor(authCustomerService) {
        this.authCustomerService = authCustomerService;
    }
    async sendOtp(phoneNumber) {
        const data = await this.authCustomerService.sendOtp(phoneNumber);
        return { data, message: `OTP sent successfully ${data}` };
    }
    async sendOtp_less(phoneNumber) {
        try {
            if (!phoneNumber) {
                throw new common_1.BadRequestException('Phone number is required');
            }
            const data = await this.authCustomerService.sendOtp_less(phoneNumber);
            return { data, message: 'OTP sent successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async verifyOtp(phoneNumber, otp) {
        const isVerified = await this.authCustomerService.verifyOtp(phoneNumber, otp);
        if (isVerified) {
            console.log(isVerified);
            return { message: 'OTP verified successfully', data: isVerified };
        }
        else {
            throw (0, console_1.error)('OTP verification failed');
        }
    }
    async verifyOtp_less(phoneNumber, requestId, otp) {
        try {
            const data = await this.authCustomerService.verifyOtp_less(phoneNumber, requestId, otp);
            return { data, message: 'OTP verified successfully ' };
        }
        catch (error) {
            throw error;
        }
    }
    async register(dto, res) {
        const data = await this.authCustomerService.register(dto, res);
        return { data, message: 'Customer logged in successfully' };
    }
    async refreshToken(dto, res) {
        const userId = dto.userId;
        const data = await this.authCustomerService.refreshToken(userId, dto.refreshToken, res);
        return { data, message: 'Token refreshed successfully' };
    }
};
exports.CustomerAuthController = CustomerAuthController;
__decorate([
    (0, common_1.Post)('send-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer login' }),
    (0, swagger_1.ApiBody)({ type: update_customer_auth_dto_1.UpdateCustomerAuthDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer logged in successfully' }),
    __param(0, (0, common_1.Body)('phoneNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('send-otp-less'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to a phone number' }),
    (0, swagger_1.ApiBody)({ type: update_customer_auth_dto_1.UpdateCustomerAuthDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid phone number' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)('phoneNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "sendOtp_less", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'otp Verification ' }),
    (0, swagger_1.ApiBody)({ type: create_customer_auth_dto_1.VerifyOtpDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer Verified successfully  ' }),
    __param(0, (0, common_1.Body)('phoneNumber')),
    __param(1, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('/verify-otp-less'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify OTP and authenticate user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                phoneNumber: { type: 'string', example: '+15551234567' },
                requestId: {
                    type: 'string',
                    example: '6492d9f9be434d3281527225032f611b',
                },
                otp: { type: 'string', example: '8482' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP verification successful.' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid OTP or phone number mismatch.',
    }),
    __param(0, (0, common_1.Body)('phoneNumber')),
    __param(1, (0, common_1.Body)('requestId')),
    __param(2, (0, common_1.Body)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "verifyOtp_less", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Customer login' }),
    (0, swagger_1.ApiBody)({ type: create_customer_auth_dto_1.CreateCustomerAuthDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer logged in successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_auth_dto_1.CreateCustomerAuthDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiBody)({ type: refresh_token_dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "refreshToken", null);
exports.CustomerAuthController = CustomerAuthController = __decorate([
    (0, swagger_1.ApiTags)('Customer Authentication'),
    (0, common_1.Controller)('customer-auth'),
    __metadata("design:paramtypes", [customer_auth_service_1.CustomerAuthService])
], CustomerAuthController);
//# sourceMappingURL=customer-auth.controller.js.map