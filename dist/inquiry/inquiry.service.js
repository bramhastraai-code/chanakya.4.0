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
const customer_entity_1 = require("../customer/entities/customer.entity");
const usertype_enum_1 = require("../customer/enum/usertype.enum");
let InquiryService = class InquiryService {
    constructor(inquiryModel, customerModel) {
        this.inquiryModel = inquiryModel;
        this.customerModel = customerModel;
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
    async findByCustomerId(customerId, pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'desc') {
        const limit = parseInt(pageSize, 10);
        const skip = (parseInt(pageNumber, 10) - 1) * limit;
        const query = {
            userId: new mongoose_2.Types.ObjectId(customerId),
        };
        try {
            const inquiries = await this.inquiryModel
                .find(query)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .populate({
                path: 'projectId',
                options: { strictPopulate: false },
            })
                .populate({
                path: 'propertyId',
                options: { strictPopulate: false },
            })
                .exec();
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
        catch (error) {
            throw new Error(`Error finding inquiries: ${error.message}`);
        }
    }
    async createInquiry(createInquiryDto, agentId) {
        const { contactNumber, name, address, city, ...inquiryData } = createInquiryDto;
        let customer = await this.customerModel.findOne({
            phoneNumber: contactNumber,
        });
        if (!customer) {
            customer = await this.customerModel.create({
                phoneNumber: contactNumber,
                name: name || 'Unknown',
                address: address || '',
                city: city || '',
                assignAgent: agentId,
                userType: 'User',
                status: usertype_enum_1.UserStatus.ACTIVE,
            });
        }
        else {
            if (!customer.assignAgent) {
                customer.assignAgent = new mongoose_2.Types.ObjectId(agentId);
                await customer.save();
            }
        }
        const inquiry = await this.inquiryModel.create({
            ...inquiryData,
            userId: customer._id,
            contactNumber,
            status: 'PENDING',
        });
        return inquiry;
    }
    async updateInquiry(id, updateInquiryDto, agentId) {
        const { contactNumber, name, address, city, ...inquiryData } = updateInquiryDto;
        const inquiry = await this.inquiryModel.findById(id);
        if (!inquiry) {
            throw new Error('Inquiry not found');
        }
        let customer;
        if (contactNumber && contactNumber !== inquiry.contactNumber) {
            customer = await this.customerModel.findOne({
                phoneNumber: contactNumber,
            });
            if (!customer) {
                customer = await this.customerModel.create({
                    phoneNumber: contactNumber,
                    name: name || 'Unknown',
                    address: address || '',
                    city: city || '',
                    assignAgent: agentId,
                    userType: 'USER',
                    status: usertype_enum_1.UserStatus.ACTIVE,
                    verificationStatus: 'PENDING',
                });
            }
            inquiry.userId = customer._id;
            inquiry.contactNumber = contactNumber;
        }
        else {
            customer = await this.customerModel.findById(inquiry.userId);
        }
        if (customer) {
            const customerUpdates = {};
            if (name)
                customerUpdates.name = name;
            if (address)
                customerUpdates.address = address;
            if (city)
                customerUpdates.city = city;
            if (!customer.assignAgent) {
                customerUpdates.assignAgent = new mongoose_2.Types.ObjectId(agentId);
            }
            if (Object.keys(customerUpdates).length > 0) {
                await this.customerModel.findByIdAndUpdate(customer._id, customerUpdates, { new: true });
            }
        }
        const updatedInquiry = await this.inquiryModel
            .findByIdAndUpdate(id, {
            ...inquiryData,
            userId: inquiry.userId,
        }, { new: true })
            .populate('userId');
        return updatedInquiry;
    }
};
exports.InquiryService = InquiryService;
exports.InquiryService = InquiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inquiry_entity_1.Inquiry.name)),
    __param(1, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], InquiryService);
//# sourceMappingURL=inquiry.service.js.map