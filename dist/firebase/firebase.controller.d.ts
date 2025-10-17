import { NotificationService } from './firebase.service';
import { Response } from 'src/common/interceptor/response.interface';
export declare class FirebaseController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
    sendToMultipleUsers(userIds: string[], title: string, body: string, data?: Record<string, string>): Promise<false | import("firebase-admin/lib/messaging/messaging-api").BatchResponse>;
    sendHybridNotification(userId: string, title: string, body: string, data?: Record<string, string>): Promise<boolean>;
    updateFcmToken(userId: string, token: string): Promise<Response<any>>;
}
