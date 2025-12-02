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
exports.InquiryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inquiry_entity_1 = require("./entities/inquiry.entity");
let InquiryService = class InquiryService {
    constructor(inquiryModel) {
        this.inquiryModel = inquiryModel;
    }
    async create(createInquiryDto) {
        try {
            const createdInquiry = new this.inquiryModel(createInquiryDto);
            return createdInquiry.save();
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateInquiryDto) {
        const updatedInquiry = await this.inquiryModel.findByIdAndUpdate(id, updateInquiryDto, {
            new: true,
            runValidators: true,
        });
        if (!updatedInquiry) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        return updatedInquiry;
    }
    async findAll(pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'desc', searchQuery, inquiryType, status) {
        const limit = parseInt(pageSize, 10);
        const skip = (parseInt(pageNumber, 10) - 1) * limit;
        const query = {};
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { message: { $regex: searchQuery, $options: 'i' } },
                { contactNumber: { $regex: searchQuery, $options: 'i' } },
            ];
        }
        if (inquiryType) {
            query.inquiryType = inquiryType;
        }
        if (status) {
            query.status = status;
        }
        const inquiries = await this.inquiryModel
            .find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const totalInquiries = await this.inquiryModel.countDocuments(query);
        const totalPages = Math.ceil(totalInquiries / limit);
        return {
            inquiries,
            totalPages,
            totalInquiries,
            pageSize: limit,
            pageNumber: parseInt(pageNumber, 10),
        };
    }
    async findOne(id) {
        return this.inquiryModel.findById(id).exec();
    }
    async remove(id) {
        const result = await this.inquiryModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Inquiry not found');
        }
        return result;
    }
};
exports.InquiryService = InquiryService;
exports.InquiryService = InquiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inquiry_entity_1.Inquiry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InquiryService);
//# sourceMappingURL=inquiry.service.js.map