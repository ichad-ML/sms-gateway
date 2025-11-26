import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
<<<<<<< Updated upstream
import { SmsDto, SmsOtpResponseDto } from '@otp-gateway/common/dtos';
=======
import { SmsDto, SmsOtpResponseDto } from '@sms-gateway/common/dtos';
import { SmsMaintenanceGuard } from '@sms-gateway/auth-lib';
>>>>>>> Stashed changes

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/')
  async sendSms(@Body() requestDto: SmsDto): Promise<SmsOtpResponseDto> {
    return this.smsService.sendSms(requestDto);
  }
}
