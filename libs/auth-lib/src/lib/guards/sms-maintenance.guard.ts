import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CODE } from '@otp-gateway/common';
import { smsConfig } from '@otp-gateway/config';

@Injectable()
export class SmsMaintenanceGuard implements CanActivate {
  constructor(
    @Inject(smsConfig.KEY)
    private readonly config: ConfigType<typeof smsConfig>
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.config.smsMaintenanceEnabled) {
      throw new ServiceUnavailableException({
        code: 'SMS_SERVICE_UNAVAILABLE',
        message:
        'SMS service is currently under maintenance. Please try again later.',
        statusCode: CODE.SERVICE_UNAVAILABLE,
      });
    }

    return true;
  }
}
