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
exports.FirebaseController = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("./firebase.service");
const swagger_1 = require("@nestjs/swagger");
let FirebaseController = class FirebaseController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendNotification(userId, title, body, data) {
        return this.notificationService.sendPushNotification(userId, title, body, data);
    }
    async sendToMultipleUsers(userIds, title, body, data) {
        return this.notificationService.sendToMultipleUsers(userIds, title, body, data);
    }
    async sendHybridNotification(userId, title, body, data) {
        return this.notificationService.sendHybridNotification(userId, title, body, data);
    }
    async updateFcmToken(userId, token) {
        const data = await this.notificationService.updateFcmToken(userId, token);
        return {
            data,
            message: 'FCM token updated successfully',
        };
    }
};
exports.FirebaseController = FirebaseController;
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a push notification to a single user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' },
                data: { type: 'object', additionalProperties: { type: 'string' } },
            },
        },
    }),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('body')),
    __param(3, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('send-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a push notification to multiple users' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userIds: { type: 'array', items: { type: 'string' } },
                title: { type: 'string' },
                body: { type: 'string' },
                data: { type: 'object', additionalProperties: { type: 'string' } },
            },
        },
    }),
    __param(0, (0, common_1.Body)('userIds')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('body')),
    __param(3, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "sendToMultipleUsers", null);
__decorate([
    (0, common_1.Post)('send-hybrid'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a hybrid notification (WebSocket + FCM)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' },
                data: { type: 'object', additionalProperties: { type: 'string' } },
            },
        },
    }),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('body')),
    __param(3, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "sendHybridNotification", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Update FCM token for a user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                token: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "updateFcmToken", null);
exports.FirebaseController = FirebaseController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, swagger_1.ApiTags)('Firebase Notifications'),
    (0, common_1.Controller)('firebase'),
    __metadata("design:paramtypes", [firebase_service_1.NotificationService])
], FirebaseController);
//# sourceMappingURL=firebase.controller.js.map