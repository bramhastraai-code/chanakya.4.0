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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const firebase_admin_1 = require("./firebase.admin");
const user_entity_1 = require("../core/entities/user.entity");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(firebaseAdmin, webSocketGateway, userModel) {
        this.firebaseAdmin = firebaseAdmin;
        this.webSocketGateway = webSocketGateway;
        this.userModel = userModel;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendPushNotification(userId, title, body, data) {
        try {
            const user = await this.userModel.findById(userId).select('fcmToken');
            console.log(`Sending notification to user ${userId} with FCM token: ${user?.fcmToken}`);
            if (!user || !user.fcmToken) {
                this.logger.warn(`No FCM token found for user ${userId}`);
                return false;
            }
            const message = {
                token: user.fcmToken,
                notification: { title, body },
                data,
            };
            const response = await this.firebaseAdmin.messaging.send(message);
            this.logger.log(`Notification sent to ${userId}: ${response}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error sending notification to ${userId}`, error);
            return false;
        }
    }
    async sendToMultipleUsers(userIds, title, body, data) {
        try {
            const users = await this.userModel
                .find({ _id: { $in: userIds } })
                .select('fcmToken');
            const validTokens = users
                .filter((user) => user.fcmToken)
                .map((user) => user.fcmToken);
            if (validTokens.length === 0) {
                this.logger.warn('No valid FCM tokens found for the provided users');
                return false;
            }
            const message = {
                tokens: validTokens,
                notification: { title, body },
                data,
            };
            const response = await this.firebaseAdmin.messaging.sendEachForMulticast(message);
            this.logger.log(`Multicast notification sent: ${response.successCount} successful`);
            return response;
        }
        catch (error) {
            this.logger.error('Error sending multicast notification', error);
            return false;
        }
    }
    async sendHybridNotification(userId, title, body, data) {
        const wsSuccess = this.webSocketGateway.sendNotificationToBroker(userId, {
            type: 'PUSH_NOTIFICATION',
            title,
            body,
            data,
        });
        if (!wsSuccess) {
            this.logger.log(`User ${userId} not connected via WebSocket, falling back to FCM`);
            return this.sendPushNotification(userId, title, body, data);
        }
        await this.sendPushNotification(userId, title, body, data);
        return true;
    }
    async updateFcmToken(userId, token) {
        await this.userModel.findByIdAndUpdate(userId, {
            fcmToken: token,
        });
        this.logger.log(`Updated FCM token for user ${userId}`);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [firebase_admin_1.FirebaseAdmin,
        websocket_gateway_1.WebSocketGatewayHandler,
        mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=firebase.service.js.map