import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AUTH_SERVICE_URL, URLS } from '../../route';
import { MlClientApi } from '@sms-gateway/auth-lib';
import { SmsDto } from '@sms-gateway/common';
import { otpConfig } from '@sms-gateway/config';

@Injectable()
export class OtpApiService {
  constructor(
    @Inject(otpConfig.KEY)
    private readonly config: ConfigType<typeof otpConfig>,
    private readonly mlClientApi: MlClientApi
  ) {}

  async validateDevice(
    deviceUniqueId: string,
    mobileNumber: string,
    token?: string
  ): Promise<any> {
    const response = await this.mlClientApi.sendRequest(
      {
        data: { deviceUniqueId, mobileNumber },
        method: 'POST',
        url: URLS.VALIDATE_DEVICE,
        baseURL: this.config.validateDeviceUrl,
      },
      token
    );

    return response.data;
  }

  async generateToken(apiKey: string, signature: string) {
    const data = { apiKey, signature };

    const response = await this.mlClientApi.sendRequest({
      data,
      method: 'POST',
      url: AUTH_SERVICE_URL.GENERATE_TOKEN,
      baseURL: this.config.authServiceUrl,
    });

    return response.data.data;
  }

  async sendSmsOTP(data: SmsDto) {
    const response = await this.mlClientApi.sendRequest({
      data,
      method: 'POST',
      url: URLS.REQUEST_OTP,
      baseURL: this.config.smsOtpBaseUrl,
    });

    return response.data;
  }
}
