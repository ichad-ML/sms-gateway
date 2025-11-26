import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsDto, SmsOtpResponseDto } from '@sms-gateway/common/dtos';
import { SmsMaintenanceGuard } from '@sms-gateway/auth-lib';

@UseGuards(SmsMaintenanceGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/')
  async sendSms(@Body() requestDto: SmsDto): Promise<SmsOtpResponseDto> {
    console.log('body=>', requestDto);
    return this.smsService.sendSms(requestDto);
  }
}
