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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../core/entities/user.entity");
const argon = require("argon2");
const unified_auth_service_1 = require("../core/auth/unified-auth.service");
const status_enum_1 = require("../common/enum/status.enum");
let UserService = class UserService {
    constructor(userModel, authService) {
        this.userModel = userModel;
        this.authService = authService;
    }
    async findAll(pageSize, pageNumber, sortBy = 'name', sortOrder = 'asc', searchQuery, role, status) {
        try {
            const limit = parseInt(pageSize);
            const skip = (parseInt(pageNumber) - 1) * limit;
            const searchFilter = {};
            if (searchQuery) {
                searchFilter.$or = [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } },
                ];
            }
            console.log('role', role);
            if (role && role !== 'all') {
                searchFilter.role = role;
            }
            console.log('status', status);
            if (status && status !== status_enum_1.Status.ALL) {
                searchFilter.status = status;
            }
            const totalUsers = await this.userModel
                .countDocuments(searchFilter)
                .exec();
            const users = await this.userModel
                .find(searchFilter)
                .skip(skip)
                .limit(limit)
                .populate({ path: 'role', strictPopulate: false })
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .exec();
            const totalPages = Math.ceil(totalUsers / limit);
            return {
                users,
                totalPages,
                totalUsers,
                pageSize: limit,
                pageNumber: parseInt(pageNumber),
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const user = await this.userModel
                .findById(id)
                .populate({ path: 'role', strictPopulate: false })
                .populate({ path: 'createdBy', strictPopulate: false })
                .populate({ path: 'updatedBy', strictPopulate: false })
                .exec();
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async create(createUserDto) {
        try {
            const existingUser = await this.userModel.findOne({
                email: createUserDto.email,
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email is already in use');
            }
            createUserDto.password = await argon.hash(createUserDto.password);
            const createdUser = new this.userModel(createUserDto);
            const response = await createdUser.save();
            console.log('user cr4ate', createUserDto);
            const { refreshToken } = await this.authService.generateTokens(createdUser._id, createdUser.email, createdUser.role);
            await this.authService.updateRefreshToken(createdUser._id, refreshToken);
            return response;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw error;
        }
    }
    async update(id, updateUserDto) {
        try {
            const updatedUser = await this.userModel
                .findByIdAndUpdate(id, updateUserDto, { new: true })
                .populate({ path: 'role', strictPopulate: false })
                .populate({ path: 'createdBy', strictPopulate: false })
                .populate({ path: 'updatedBy', strictPopulate: false })
                .exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return updatedUser;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            const deletedUser = await this.userModel
                .findByIdAndDelete(id)
                .populate({ path: 'role', strictPopulate: false })
                .populate({ path: 'createdBy', strictPopulate: false })
                .populate({ path: 'updatedBy', strictPopulate: false })
                .exec();
            if (!deletedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found.`);
            }
            return deletedUser;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw error;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        unified_auth_service_1.UnifiedAuthService])
], UserService);
//# sourceMappingURL=user.service.js.map