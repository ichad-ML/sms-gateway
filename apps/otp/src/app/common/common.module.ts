import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { otpConfig } from '@otp-gateway/config';
import { FirebaseService } from './firebase/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [otpConfig],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: async () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: false,
          },
          exceptionFactory: (errors: ValidationError[]) => {
            for (const error of errors) {
              if (error.constraints?.isEnum) {
                error.constraints.isEnum = `${error.property} has an invalid value.`;
              }
            }

            return new ValidationPipe().createExceptionFactory()(errors);
          },
        }),
    },
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class CommonModule {}
