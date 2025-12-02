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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../core/entities/user.entity");
const builder_profile_entity_1 = require("../profiles/builder/entities/builder-profile.entity");
const argon = require("argon2");
const user_role_enum_1 = require("../common/enum/user-role.enum");
let BuilderService = class BuilderService {
    constructor(userModel, builderProfileModel) {
        this.userModel = userModel;
        this.builderProfileModel = builderProfileModel;
    }
    async create(createBuilderDto) {
        const existingUser = await this.userModel.findOne({
            email: createBuilderDto.email,
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already in use');
        }
        const hashedPassword = await argon.hash(createBuilderDto.password);
        const user = await this.userModel.create({
            name: createBuilderDto.name,
            email: createBuilderDto.email,
            phoneNumber: createBuilderDto.phoneNumber,
            password: hashedPassword,
            role: user_role_enum_1.UserRole.BUILDER,
            isActive: true,
            isEmailVerified: true,
            isPhoneVerified: true,
        });
        const profile = await this.builderProfileModel.create({
            userId: user._id,
            companyName: createBuilderDto.companyName,
            companyLogo: createBuilderDto.companyLogo,
            establishedYear: createBuilderDto.establishedYear,
            reraNumber: createBuilderDto.reraNumber,
            gstin: createBuilderDto.gstin,
            address: createBuilderDto.address,
            contactPerson: createBuilderDto.contactPerson,
            contactEmail: createBuilderDto.contactEmail,
            contactPhone: createBuilderDto.contactPhone,
            description: createBuilderDto.description,
            socialLinks: {
                website: createBuilderDto.websiteUrl,
            },
        });
        return { user, profile };
    }
    async findAll(page = 1, limit = 10, search, sort = 'createdAt', order = 'desc', filter) {
        const skip = (page - 1) * limit;
        const query = { role: user_role_enum_1.UserRole.BUILDER };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
            ];
        }
        if (filter) {
            if (filter.isActive !== undefined) {
                query.isActive = filter.isActive === 'true';
            }
        }
        const [users, total] = await Promise.all([
            this.userModel
                .find(query)
                .sort({ [sort]: order === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            this.userModel.countDocuments(query).exec(),
        ]);
        const userIds = users.map((u) => u._id);
        const profiles = await this.builderProfileModel
            .find({ userId: { $in: userIds } })
            .lean()
            .exec();
        const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
        const data = users.map((user) => {
            const profile = profileMap.get(user._id.toString());
            delete user.password;
            delete user.refreshToken;
            return { ...user, profile };
        });
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).lean().exec();
        if (!user || user.role !== user_role_enum_1.UserRole.BUILDER) {
            throw new common_1.NotFoundException('Builder not found');
        }
        const profile = await this.builderProfileModel
            .findOne({ userId: id })
            .lean()
            .exec();
        delete user.password;
        delete user.refreshToken;
        return { ...user, profile };
    }
    async update(id, updateBuilderDto) {
        const user = await this.userModel.findById(id);
        if (!user || user.role !== user_role_enum_1.UserRole.BUILDER) {
            throw new common_1.NotFoundException('Builder not found');
        }
        if (updateBuilderDto.name)
            user.name = updateBuilderDto.name;
        if (updateBuilderDto.email)
            user.email = updateBuilderDto.email;
        if (updateBuilderDto.phoneNumber)
            user.phoneNumber = updateBuilderDto.phoneNumber;
        if (updateBuilderDto.password) {
            user.password = await argon.hash(updateBuilderDto.password);
        }
        await user.save();
        const profile = await this.builderProfileModel.findOne({ userId: id });
        if (profile) {
            if (updateBuilderDto.companyName)
                profile.companyName = updateBuilderDto.companyName;
            if (updateBuilderDto.companyLogo)
                profile.companyLogo = updateBuilderDto.companyLogo;
            if (updateBuilderDto.establishedYear)
                profile.establishedYear = updateBuilderDto.establishedYear;
            if (updateBuilderDto.reraNumber)
                profile.reraNumber = updateBuilderDto.reraNumber;
            if (updateBuilderDto.gstin)
                profile.gstin = updateBuilderDto.gstin;
            if (updateBuilderDto.address)
                profile.address = updateBuilderDto.address;
            if (updateBuilderDto.contactPerson)
                profile.contactPerson = updateBuilderDto.contactPerson;
            if (updateBuilderDto.contactEmail)
                profile.contactEmail = updateBuilderDto.contactEmail;
            if (updateBuilderDto.contactPhone)
                profile.contactPhone = updateBuilderDto.contactPhone;
            if (updateBuilderDto.description)
                profile.description = updateBuilderDto.description;
            if (updateBuilderDto.isVerified !== undefined)
                profile.isVerified = updateBuilderDto.isVerified;
            if (updateBuilderDto.websiteUrl) {
                profile.socialLinks = {
                    ...profile.socialLinks,
                    website: updateBuilderDto.websiteUrl,
                };
            }
            await profile.save();
        }
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.userModel.findById(id);
        if (!user || user.role !== user_role_enum_1.UserRole.BUILDER) {
            throw new common_1.NotFoundException('Builder not found');
        }
        await this.userModel.findByIdAndDelete(id);
        await this.builderProfileModel.findOneAndDelete({ userId: id });
        return { message: 'Builder deleted successfully' };
    }
};
exports.BuilderService = BuilderService;
exports.BuilderService = BuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(builder_profile_entity_1.BuilderProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BuilderService);
//# sourceMappingURL=builder.service.js.map