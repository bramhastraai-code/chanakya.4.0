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
exports.UserBehaviorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_behavior_service_1 = require("./user-behavior.service");
const user_behavior_entity_1 = require("./entities/user-behavior.entity");
const create_user_behavior_dto_1 = require("./dto/create-user-behavior.dto");
let UserBehaviorController = class UserBehaviorController {
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    async trackEvent(trackUserBehaviorDto, req) {
        const data = await this.trackingService.trackEvent(trackUserBehaviorDto, req.headers['user-agent'], req.ip);
        return {
            data,
            message: 'Event tracked successfully',
        };
    }
    async getDailyActivity(days = 30) {
        const data = await this.trackingService.getDailyActivity(days);
        return {
            data,
            message: 'Daily activity metrics retrieved successfully',
        };
    }
    async getUserRetention(cohortSize = 7) {
        const data = await this.trackingService.calculateRetention(cohortSize);
        return {
            data,
            message: 'User retention metrics calculated successfully',
        };
    }
    async getPopularPages(limit = 10) {
        const data = await this.trackingService.getPopularPages(limit);
        return {
            data,
            message: 'Popular pages metrics retrieved successfully',
        };
    }
    async getCtaPerformance(limit = 20) {
        const data = await this.trackingService.getCtaPerformance(limit);
        return {
            data,
            message: 'CTA performance metrics retrieved successfully',
        };
    }
    async getUserJourneys(limit = 50) {
        const data = await this.trackingService.analyzeUserJourneys(limit);
        return {
            data,
            message: 'User journey patterns analyzed successfully',
        };
    }
    async getDeviceBreakdown() {
        const data = await this.trackingService.getDeviceBreakdown();
        return {
            data,
            message: 'Device usage metrics retrieved successfully',
        };
    }
    async getSectionEngagement() {
        const data = await this.trackingService.getSectionEngagement();
        return {
            data,
            message: 'Section engagement metrics retrieved successfully',
        };
    }
};
exports.UserBehaviorController = UserBehaviorController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Track user behavior event' }),
    (0, swagger_1.ApiBody)({ type: create_user_behavior_dto_1.TrackUserBehaviorDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event tracked successfully',
        type: user_behavior_entity_1.UserBehavior,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid input data',
    }),
    (0, common_1.Post)('event'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_behavior_dto_1.TrackUserBehaviorDto, Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Get)('daily-activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily user activity metrics' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        description: 'Number of days to analyze',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily activity metrics' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getDailyActivity", null);
__decorate([
    (0, common_1.Get)('user-retention'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate user retention rates' }),
    (0, swagger_1.ApiQuery)({
        name: 'cohortSize',
        required: false,
        description: 'Cohort size in days',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User retention metrics' }),
    __param(0, (0, common_1.Query)('cohortSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getUserRetention", null);
__decorate([
    (0, common_1.Get)('popular-pages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get most visited pages' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of results to return',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Popular pages metrics' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getPopularPages", null);
__decorate([
    (0, common_1.Get)('cta-performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get CTA performance metrics' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of results to return',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CTA performance metrics' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getCtaPerformance", null);
__decorate([
    (0, common_1.Get)('user-journeys'),
    (0, swagger_1.ApiOperation)({ summary: 'Analyze common user journeys' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of journeys to analyze',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User journey patterns' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getUserJourneys", null);
__decorate([
    (0, common_1.Get)('device-breakdown'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device usage breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device usage metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getDeviceBreakdown", null);
__decorate([
    (0, common_1.Get)('section-engagement'),
    (0, swagger_1.ApiOperation)({ summary: 'Get section engagement metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Section engagement metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserBehaviorController.prototype, "getSectionEngagement", null);
exports.UserBehaviorController = UserBehaviorController = __decorate([
    (0, swagger_1.ApiTags)('Tracking'),
    (0, common_1.Controller)('tracking'),
    __metadata("design:paramtypes", [user_behavior_service_1.UserBehaviorService])
], UserBehaviorController);
//# sourceMappingURL=user-behavior.controller.js.map