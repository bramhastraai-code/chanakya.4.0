// src/firebase/firebase-admin.service.ts
import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseAdmin {
  private app: admin.app.App;
  public messaging: admin.messaging.Messaging;
  public firestore: admin.firestore.Firestore;
  public auth: admin.auth.Auth;

  constructor() {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      this.app = admin.app();
    }

    this.messaging = this.app.messaging();
    this.firestore = this.app.firestore();
    this.auth = this.app.auth();
  }

  getApp() {
    return this.app;
  }
}
