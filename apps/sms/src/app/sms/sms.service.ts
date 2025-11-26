import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { smsConfig } from '@sms-gateway/config';
import { SmsApiService } from '../services/sms-api.service';
import { TokenService } from '../services/token.service';
import { SmsDto, SmsOtpResponseDto } from '@sms-gateway/common/dtos';

@Injectable()
export class SmsService {
  constructor(
    @Inject(smsConfig.KEY)
    private readonly config: ConfigType<typeof smsConfig>,
    private readonly smsApiService: SmsApiService,
    private readonly tokenService: TokenService,
  ) {}

  async sendSms(dto: SmsDto): Promise<SmsOtpResponseDto> {
    const token = this.tokenService.getAccessToken();

    const data = {
      messageType: dto.type,
      text: dto.message,
      destination: dto.mobileNumber,
      keyValues: dto.value,
    } as unknown as SmsDto;

    return this.smsApiService.sendSms(data, token, this.config.smsBaseUrl);
  }
}
