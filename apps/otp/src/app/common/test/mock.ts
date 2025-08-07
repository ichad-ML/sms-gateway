import type { ConfigType } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { OtpApiService } from '@otp-gateway/api-lib';
import { otpConfig } from '@otp-gateway/config';

export type Functions<T> = Partial<{
  [K in keyof T]: T[K];
}>;

export const mockOtpApiService: Functions<OtpApiService> = {
  async validateDevice<T>(): Promise<T> {
    return {} as T;
  },

  async sendSmsOTP<T>(): Promise<T> {
    return {} as T;
  },
};

export const mockFirebaseService: Functions<FirebaseService> = {
  async createDocument<T>(): Promise<T> {
    return {} as T;
  },
  async getDocument<T>(): Promise<T> {
    return {} as T;
  },
  async updateDocument<T>(): Promise<T> {
    return {} as T;
  },
};

export const mockLoggerService = {
  log: (..._args: any[]) => {
    // mock
  },
  error: (..._args: any[]) => {
    // mock
  },
  warn: (..._args: any[]) => {
    // mock
  },
  debug: (..._args: any[]) => {
    // mock
  },
  verbose: (..._args: any[]) => {
    // mock
  },
};

export const mockOtpConfig = {
  port: 3000,
  smsOtpBaseUrl: '',
  inAppOtpBaseUrl: '',
} as unknown as ConfigType<typeof otpConfig>;
