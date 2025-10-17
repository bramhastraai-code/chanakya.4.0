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
exports.AgentInquiryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agent_inquiry_entity_1 = require("./entities/agent-inquiry.entity");
let AgentInquiryService = class AgentInquiryService {
    constructor(agentInquiryModel) {
        this.agentInquiryModel = agentInquiryModel;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder, searchQuery, status) {
        try {
            const limit = parseInt(pageSize);
            const skip = (parseInt(pageNumber) - 1) * limit;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            const searchFilter = searchQuery
                ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } },
                        { phoneNumber: { $regex: searchQuery, $options: 'i' } },
                    ],
                }
                : {};
            if (status && status !== 'all') {
                searchFilter.status = status;
            }
            const totalInquiries = await this.agentInquiryModel
                .countDocuments(searchFilter)
                .exec();
            const inquiries = await this.agentInquiryModel
                .find(searchFilter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();
            return {
                inquiries,
                totalPages: Math.ceil(totalInquiries / limit),
                totalInquiries,
                pageSize: limit,
                pageNumber: parseInt(pageNumber),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching agent inquiries');
        }
    }
    async findOne(id) {
        try {
            const inquiry = await this.agentInquiryModel.findById(id).exec();
            if (!inquiry) {
                throw new common_1.NotFoundException(`Inquiry with ID ${id} not found.`);
            }
            return inquiry;
        }
        catch (error) {
            throw error;
        }
    }
    async create(createAgentInquiryDto) {
        try {
            const existingInquiry = await this.agentInquiryModel.findOne({
                phoneNumber: createAgentInquiryDto.phoneNumber,
            });
            if (existingInquiry) {
                throw new common_1.ConflictException('Phone number is already in use');
            }
            const createdInquiry = new this.agentInquiryModel(createAgentInquiryDto);
            return await createdInquiry.save();
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updateAgentInquiryDto) {
        try {
            const updatedInquiry = await this.agentInquiryModel
                .findByIdAndUpdate(id, updateAgentInquiryDto, { new: true })
                .exec();
            if (!updatedInquiry) {
                throw new common_1.NotFoundException(`Inquiry with ID ${id} not found.`);
            }
            return updatedInquiry;
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
            const deletedInquiry = await this.agentInquiryModel
                .findByIdAndDelete(id)
                .exec();
            if (!deletedInquiry) {
                throw new common_1.NotFoundException(`Inquiry with ID ${id} not found.`);
            }
            return deletedInquiry;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw new common_1.InternalServerErrorException('Error deleting the inquiry');
        }
    }
    async addAgentForm(createAgentInquiryDto) {
        try {
            const createdInquiry = new this.agentInquiryModel(createAgentInquiryDto);
            return await createdInquiry.save();
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AgentInquiryService = AgentInquiryService;
exports.AgentInquiryService = AgentInquiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agent_inquiry_entity_1.AgentInquiry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AgentInquiryService);
//# sourceMappingURL=agent-inquiry.service.js.map