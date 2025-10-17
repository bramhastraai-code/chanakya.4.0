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
exports.PlanController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const plan_service_1 = require("./plan.service");
const plan_entity_1 = require("./entities/plan.entity");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
let PlanController = class PlanController {
    constructor(planService) {
        this.planService = planService;
    }
    async create(createPlanDto) {
        try {
            const data = await this.planService.create(createPlanDto);
            return { data, message: 'Plan created successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updatePlanDto) {
        try {
            const updatedPlan = await this.planService.update(id, updatePlanDto);
            if (!updatedPlan) {
                throw new common_1.NotFoundException('Plan not found');
            }
            return updatedPlan;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while updating the plan.');
        }
    }
    async findAll(pageSize, pageNumber, sortBy = 'createdAt', sortOrder = 'asc', searchQuery) {
        try {
            const data = await this.planService.findAll(pageSize, pageNumber, sortBy, sortOrder, searchQuery);
            if (!data.plans || data.plans.length === 0) {
                throw new common_1.NotFoundException('No plans found');
            }
            return { data, message: 'Retrieve successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(id) {
        try {
            const plan = await this.planService.findOne(id);
            if (!plan) {
                throw new common_1.NotFoundException('Plan not found');
            }
            return { data: plan, message: 'Retrieve successfully' };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred while retrieving the plan.');
        }
    }
    async remove(id) {
        try {
            const result = await this.planService.remove(id);
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException('Plan not found');
            }
            return { data: 'DELETE successfully', message: 'delete successful' };
        }
        catch (error) {
            throw error;
        }
    }
    async findPlansByProductTypeAndStatus(planType) {
        try {
            const data = await this.planService.findByProductTypeAndStatus(planType);
            return { data, message: 'Plans fetched successfully' };
        }
        catch (error) {
            throw new common_1.NotFoundException('No plans found matching the criteria');
        }
    }
};
exports.PlanController = PlanController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Plan created successfully',
        type: plan_entity_1.Plan,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('plan/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing plan' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plan updated successfully',
        type: plan_entity_1.Plan,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plan not found',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all plans with pagination, sorting, and search',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        type: Number,
        required: true,
        description: 'Number of plans per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageNumber',
        type: Number,
        required: true,
        description: 'Page number to retrieve',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        type: String,
        required: false,
        enum: ['createdAt', 'updatedAt', 'price'],
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        type: String,
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'searchQuery',
        type: String,
        required: false,
        description: 'Search term for filtering plans',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of plans retrieved successfully',
        type: [plan_entity_1.Plan],
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No plans found',
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('searchQuery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('plan/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a single plan by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The plan details',
        type: plan_entity_1.Plan,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plan not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('plan/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a plan by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Plan deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Plan not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/plan-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get plans by Plan type' }),
    (0, swagger_1.ApiQuery)({
        name: 'planType',
        required: true,
        type: String,
        description: 'The product type to filter by',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Plans fetched successfully',
        type: [plan_entity_1.Plan],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No plans found',
    }),
    __param(0, (0, common_1.Query)('planType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanController.prototype, "findPlansByProductTypeAndStatus", null);
exports.PlanController = PlanController = __decorate([
    (0, swagger_1.ApiTags)('plans'),
    (0, common_1.Controller)('plans'),
    __metadata("design:paramtypes", [plan_service_1.PlanService])
], PlanController);
//# sourceMappingURL=plan.controller.js.map