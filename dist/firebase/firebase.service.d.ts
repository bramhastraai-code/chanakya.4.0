/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
