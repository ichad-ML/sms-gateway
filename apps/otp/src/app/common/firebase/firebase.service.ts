import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { CollectionType } from '@sms-gateway/common/enums';
import { otpConfig } from '@sms-gateway/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: FirebaseFirestore.Firestore;

  constructor(
    @Inject(otpConfig.KEY)
    private readonly config: ConfigType<typeof otpConfig>
  ) {}

  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.config.firebase.projectId,
          clientEmail: this.config.firebase.clientEmail,
          privateKey: this.config.firebase.privateKey,
        }),
      });
    }

    this.db = admin.firestore();
  }

  get firestore() {
    return this.db;
  }

  async createDocument(app: CollectionType, data: any) {
    return this.db.collection(app).add(data);
  }

  async getDocument<T = FirebaseFirestore.DocumentData>(
    collection: CollectionType,
    docId: string
  ): Promise<T & { id: string }> {
    const docRef = this.db.collection(collection).doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error(
        `Document with ID "${docId}" not found in collection "${collection}".`
      );
    }

    return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
  }

  async updateDocument<T = FirebaseFirestore.DocumentData>(
    collection: CollectionType,
    docId: string,
    data: Partial<T>
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true });
  }
}
