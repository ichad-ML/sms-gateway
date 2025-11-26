import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { smsConfig } from '@sms-gateway/config';
import { MlClientApi } from '@sms-gateway/auth-lib';
import { TokenService } from '../services/token.service';
import { SmsApiService } from '../services/sms-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [smsConfig],
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService, MlClientApi, TokenService, SmsApiService],
})
export class SmsModule {}
