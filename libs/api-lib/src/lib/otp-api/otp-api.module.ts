import { Module } from '@nestjs/common';
import { OtpApiService } from './otp-api.service';
import { MlClientApi } from '@otp-gateway/auth-lib';

@Module({
  imports: [],
  providers: [OtpApiService, MlClientApi],
  controllers: [],
  exports: [OtpApiService],
})
export class OtpApiModule {}
