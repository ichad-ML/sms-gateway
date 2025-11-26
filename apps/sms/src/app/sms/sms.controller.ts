import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsDto, SmsOtpResponseDto } from '@sms-gateway/common/dtos';
import { JwtAuthGuard, SmsMaintenanceGuard } from '@sms-gateway/auth-lib';

@UseGuards(SmsMaintenanceGuard)
@UseGuards(JwtAuthGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/')
  async sendSms(@Body() requestDto: SmsDto): Promise<SmsOtpResponseDto> {
    return this.smsService.sendSms(requestDto);
  }
}
