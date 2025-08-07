import { Module } from '@nestjs/common';
import { SmsOtpController } from './sms-otp.controller';
import { SmsOtpService } from './sms-otp.service';

@Module({
  controllers: [SmsOtpController],
  providers: [SmsOtpService],
})
export class SmsOtpModule {}
