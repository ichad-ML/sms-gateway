import { Module } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SmsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
