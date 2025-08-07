import { Module } from '@nestjs/common';
import { InAppOtpController } from './in-app-otp.controller';
import { InAppOtpService } from './in-app-otp.service';

@Module({
  controllers: [InAppOtpController],
  providers: [InAppOtpService],
})
export class InAppOtpModule {}
