import { Module } from '@nestjs/common';
import { SmsOtpModule } from './sms-otp/sms-otp.module';
import { InAppOtpModule } from './in-app-otp/in-app-otp.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SmsOtpModule,
    InAppOtpModule,
    CommonModule,
    OtpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
