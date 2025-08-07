import type { ConfigType } from '@nestjs/config';
import { SmsApiService } from '../services/sms-api.service';
import { TokenService } from '../services/token.service';
import { smsConfig } from '@otp-gateway/config';

export type Functions<T> = Partial<{
  [K in keyof T]: T[K];
}>;

export const mockSmsConfig = {
  port: 3000,
  smsBaseUrl: 'http://localhost:3000',
  smsUsername: 'username',
  smsPassword: 'password',
} as unknown as ConfigType<typeof smsConfig>;

export const mockSmsApiService: Functions<SmsApiService> = {
  async generateToken<T>(): Promise<T> {
    return {} as T;
  },

  async refreshToken<T>(): Promise<T> {
    return {} as T;
  },

  async sendSms<T>(): Promise<T> {
    return {} as T;
  },
};

export const mockTokenService: Functions<TokenService> = {
  getAccessToken<T>() {
    return '' as T;
  },
};
