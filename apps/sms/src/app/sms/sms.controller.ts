import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsDto, SmsOtpResponseDto } from '@otp-gateway/common/dtos';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/')
  async sendSms(@Body() requestDto: SmsDto): Promise<SmsOtpResponseDto> {
    return this.smsService.sendSms(requestDto);
  }
}
