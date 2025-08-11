import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { ConfigModule } from '@nestjs/config';
import { SmsMaintenanceGuard } from '@otp-gateway/auth-lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SmsModule,
  ],
  controllers: [],
  providers: [SmsMaintenanceGuard],
  exports: [SmsMaintenanceGuard],
})
export class AppModule {}
