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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("src/user/entity/user.entity");
let AuthService = class AuthService {
    constructor(userModel, jwt, config) {
        this.userModel = userModel;
        this.jwt = jwt;
        this.config = config;
    }
    async login(dto, res) {
        const user = await this.userModel
            .findOne({ email: dto.email })
            .populate('role', { strictPopulate: false });
        if (!user) {
            throw new common_1.ForbiddenException('Unauthorized User');
        }
        const pwMatches = await argon.verify(user.password, dto.password);
        if (!pwMatches) {
            throw new common_1.ForbiddenException('Credential incorrect');
        }
        const { accessToken, refreshToken } = await this.generateTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, refreshToken);
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
            email: user.email,
            _id: user._id,
            accessToken,
            refreshToken,
            user,
        };
    }
    async resetPassword(id, password) {
        console.log('updatedUser', id, password);
        try {
            const hash = await argon.hash(password);
            const updatedUser = await this.userModel
                .findByIdAndUpdate({ _id: id }, { password: hash }, { new: true })
                .exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
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
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async refreshToken(_id, refreshToken, res) {
        const user = await this.userModel.findById({ _id }).populate('role');
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await argon.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user._id, user.email);
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
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map