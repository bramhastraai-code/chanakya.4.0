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
exports.BuilderService = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const builder_entity_1 = require("./entities/builder.entity");
const project_entity_1 = require("../project/entities/project.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let BuilderService = class BuilderService {
    constructor(builderModel, projectModel, jwt, config) {
        this.builderModel = builderModel;
        this.projectModel = projectModel;
        this.jwt = jwt;
        this.config = config;
        this.clientId = process.env.OTP_LESS_CLIENT_ID;
        this.clientSecret = process.env.OTP_LESS_CLIENT_SECRET;
        this.otpApiUrl = process.env.OTP_LESS_URL;
        this.verifyUrl = process.env.OTP_LESS_VERIFY_URL;
        this.otpExpiry = parseInt(process.env.OTP_LESS_EXPIERY, 10) || 300;
        this.otpLength = parseInt(process.env.OTP_LENGTH, 10) || 4;
    }
    async sendOtp_less(phoneNumber) {
        const body = JSON.stringify({
            phoneNumber,
            expiry: this.otpExpiry,
            otpLength: this.otpLength,
            channels: ['SMS'],
            metadata: { key1: 'Data1', key2: 'Data2' },
        });
        const options = {
            method: 'POST',
            headers: {
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                'Content-Type': 'application/json',
            },
            body,
        };
        console.log(this.otpApiUrl, options);
        try {
            return {
                requestId: '5325',
            };
        }
        catch (error) {
            throw error;
        }
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
            const user = await this.findByPhone(phoneNumber);
            if (!user) {
                throw new common_1.NotFoundException('No builder found with this phone number');
                newUser = true;
            }
            const { accessToken, refreshToken } = await this.generateTokens(user._id, user.phone);
            await this.updateRefreshToken(user._id, refreshToken);
            return {
                phoneNumber: user.phone,
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
        await this.builderModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async refreshToken(_id, refreshToken, res) {
        const user = await this.builderModel.findById({ _id });
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user._id, user.phone);
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
    async create(createBuilderDto) {
        const createdBuilder = new this.builderModel(createBuilderDto);
        return await createdBuilder.save();
    }
    async findAll(pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'asc', searchQuery, status) {
        const limit = parseInt(pageSize, 10);
        const skip = (parseInt(pageNumber, 10) - 1) * limit;
        const query = {};
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { email: { $regex: searchQuery, $options: 'i' } },
            ];
        }
        if (status !== 'all') {
            query.status = status;
        }
        const [builders, totalBuilders] = await Promise.all([
            this.builderModel
                .find(query)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit),
            this.builderModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(totalBuilders / limit);
        return {
            builders,
            totalPages,
            totalBuilders,
            pageSize: limit,
            pageNumber: parseInt(pageNumber, 10),
        };
    }
    async findOne(id) {
        const builder = await this.builderModel.findById(id);
        if (!builder) {
            throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
        }
        const projectCount = await this.projectModel.countDocuments({
            builder: id,
        });
        builder.totalProject = projectCount;
        await builder.save();
        return builder;
    }
    async findByPhone(phone) {
        return await this.builderModel.findOne({ phone }).exec();
    }
    async findByOwnerId(ownerId) {
        return await this.builderModel.find({ owner: ownerId }).exec();
    }
    async update(id, updateBuilderDto) {
        const updatedBuilder = await this.builderModel.findByIdAndUpdate(id, updateBuilderDto, { new: true });
        if (!updatedBuilder) {
            throw new common_1.NotFoundException(`Builder with ID ${id} not found`);
        }
        return updatedBuilder;
    }
    async remove(id) {
        const result = await this.builderModel.findByIdAndDelete(id);
        return result ? true : false;
    }
    async BuilderList() {
        const builders = await this.builderModel.find().exec();
        const data = builders.map((builder) => ({
            value: builder._id,
            label: builder.name,
        }));
        return data;
    }
    async getBuildersWithProjectCount() {
        try {
            const data = await this.builderModel
                .find({}, { name: 1, phone: 1, email: 1, logo: 1, totalProject: 1 })
                .sort({ totalProject: -1 })
                .exec();
            return data;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.BuilderService = BuilderService;
exports.BuilderService = BuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(builder_entity_1.Builder.name)),
    __param(1, (0, mongoose_1.InjectModel)(project_entity_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], BuilderService);
//# sourceMappingURL=builder.service.js.map