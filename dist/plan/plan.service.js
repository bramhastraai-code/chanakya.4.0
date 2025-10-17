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
exports.PlanService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_entity_1 = require("./entities/plan.entity");
let PlanService = class PlanService {
    constructor(planModel) {
        this.planModel = planModel;
    }
    async create(createPlanDto) {
        try {
            const createdPlan = new this.planModel(createPlanDto);
            return createdPlan.save();
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updatePlanDto) {
        const updatedPlan = await this.planModel.findByIdAndUpdate(id, updatePlanDto, {
            new: true,
            runValidators: true,
        });
        if (!updatedPlan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return updatedPlan;
    }
    async findAll(pageSize = '10', pageNumber = '1', sortBy = 'createdAt', sortOrder = 'asc', searchQuery) {
        const limit = parseInt(pageSize, 10);
        const skip = (parseInt(pageNumber, 10) - 1) * limit;
        const query = searchQuery
            ? {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { productType: { $regex: searchQuery, $options: 'i' } },
                ],
            }
            : {};
        const plans = await this.planModel
            .find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);
        const totalPlans = await this.planModel.countDocuments(query);
        const totalPages = Math.ceil(totalPlans / limit);
        return {
            plans,
            totalPages,
            totalPlans,
            pageSize: limit,
            pageNumber: parseInt(pageNumber, 10),
        };
    }
    async findOne(id) {
        const plan = await this.planModel.findById(id).exec();
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return plan;
    }
    async remove(id) {
        const result = await this.planModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Plan not found');
        }
        return result;
    }
    async findByProductTypeAndStatus(planType) {
        const plans = await this.planModel.find({ productType: planType }).exec();
        if (!plans || plans.length === 0) {
            throw new common_1.NotFoundException('No plans found matching the criteria');
        }
        return plans;
    }
};
exports.PlanService = PlanService;
exports.PlanService = PlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_entity_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlanService);
//# sourceMappingURL=plan.service.js.map