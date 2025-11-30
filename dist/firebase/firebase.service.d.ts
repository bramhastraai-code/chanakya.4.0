import { WebSocketGatewayHandler } from '../websocket/websocket.gateway';
import { Model } from 'mongoose';
import { FirebaseAdmin } from './firebase.admin';
import { Customer } from 'src/customer/entities/customer.entity';
export declare class NotificationService {
    private readonly firebaseAdmin;
    private readonly webSocketGateway;
    private customerModel;
    private readonly logger;
    constructor(firebaseAdmin: FirebaseAdmin, webSocketGateway: WebSocketGatewayHandler, customerModel: Model<Customer>);
    sendPushNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
    sendToMultipleUsers(userIds: string[], title: string, body: string, data?: Record<string, string>): Promise<false | import("firebase-admin/lib/messaging/messaging-api").BatchResponse>;
    sendHybridNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
    updateFcmToken(userId: string, token: string): Promise<void>;
}
