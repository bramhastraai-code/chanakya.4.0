import * as admin from 'firebase-admin';
export declare class FirebaseAdmin {
    private app;
    messaging: admin.messaging.Messaging;
    firestore: admin.firestore.Firestore;
    auth: admin.auth.Auth;
    constructor();
    getApp(): admin.app.App;
}
