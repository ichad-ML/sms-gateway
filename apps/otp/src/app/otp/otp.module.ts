import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { FirebaseService } from '../common/firebase/firebase.service';
import { MlClientApi } from '@sms-gateway/auth-lib';
import { OtpApiService } from '@sms-gateway/api-lib';
import { LoggerModule } from '@sms-gateway/common/logger';

@Module({
  imports: [LoggerModule],
  controllers: [OtpController],
  providers: [OtpService, OtpApiService, FirebaseService, MlClientApi],
})
export class OtpModule {}
