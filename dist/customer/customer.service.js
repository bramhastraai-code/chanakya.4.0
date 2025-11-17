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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_entity_1 = require("./entities/customer.entity");
let CustomerService = class CustomerService {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder, searchQuery, userType, status) {
        console.log({
            pageSize,
            pageNumber,
            sortBy,
            sortOrder,
            searchQuery,
            userType,
            status,
        });
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
                    ],
                }
                : {};
            if (userType && userType !== 'All') {
                searchFilter.userType = userType;
            }
            if (status && status !== 'all') {
                searchFilter.status = status;
            }
            console.log('searchFilter', searchFilter);
            const totalCustomers = await this.customerModel
                .countDocuments(searchFilter)
                .exec();
            const customers = await this.customerModel
                .find(searchFilter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec();
            const totalPages = Math.ceil(totalCustomers / limit);
            console.log('customers', customers);
            return {
                customers,
                totalPages,
                totalCustomers,
                pageSize: limit,
                pageNumber: parseInt(pageNumber),
            };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const customer = await this.customerModel
                .findById(id)
                .populate('assignAgent')
                .exec();
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID ${id} not found.`);
            }
            return customer;
        }
        catch (error) {
            throw error;
        }
    }
    async create(createCustomerDto) {
        try {
            const existingCustomer = await this.customerModel.findOne({
                phoneNumber: createCustomerDto.phoneNumber,
            });
            if (existingCustomer) {
                throw new common_1.ConflictException('phone number  is already in use');
            }
            const createdCustomer = new this.customerModel(createCustomerDto);
            return await createdCustomer.save();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw error;
        }
    }
    async update(id, updateCustomerDto) {
        try {
            const updatedCustomer = await this.customerModel
                .findByIdAndUpdate(id, updateCustomerDto, { new: true })
                .exec();
            if (!updatedCustomer) {
                throw new common_1.NotFoundException(`Customer with ID ${id} not found.`);
            }
            return updatedCustomer;
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
            const deletedCustomer = await this.customerModel
                .findByIdAndDelete(id)
                .exec();
            if (!deletedCustomer) {
                throw new common_1.NotFoundException(`Customer with ID ${id} not found.`);
            }
            return deletedCustomer;
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw new common_1.BadRequestException(`Invalid ID format: ${id}`);
            }
            throw error;
        }
    }
    async findByMobile(phoneNumber) {
        return this.customerModel.findOne({ phoneNumber });
    }
    async getAppliedProjects(customerId) {
        try {
            const customer = await this.customerModel
                .findById(customerId)
                .populate('projectsApplied', 'projectName thumbnail city state priceMin priceMax');
            if (!customer) {
                throw new common_1.NotFoundException('Customer not found');
            }
            return customer.projectsApplied;
        }
        catch (error) {
            throw error;
        }
    }
    async getCustomersByAgentWithPagination(agentId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const [customers, total] = await Promise.all([
                this.customerModel
                    .find({ assignAgent: agentId })
                    .select('name userType responseTime phoneNumber status projectsApplied address city country email latitude longitude name pinCode state userImage leadStatus')
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.customerModel.countDocuments({ assignAgent: agentId }).exec(),
            ]);
            return { customers, total };
        }
        catch (error) {
            throw error;
        }
    }
    async createCustomerByAgent(agentId, createCustomerDto) {
        try {
            const existingCustomer = await this.customerModel.findOne({
                phoneNumber: createCustomerDto.phoneNumber,
            });
            if (existingCustomer) {
                throw new common_1.ConflictException('phone number is already in use');
            }
            const customerData = {
                ...createCustomerDto,
                assignAgent: agentId,
            };
            const createdCustomer = new this.customerModel(customerData);
            return await createdCustomer.save();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw error;
        }
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_entity_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomerService);
//# sourceMappingURL=customer.service.js.map