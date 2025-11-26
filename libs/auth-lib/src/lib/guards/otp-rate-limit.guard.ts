import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

const otpAttemptStore = new Map<
  string,
  { count: number; firstAttemptAt: number }
>();

@Injectable()
export class OtpRateLimitGuard implements CanActivate {
  // Maximum number of attempts allowed within the time window. 5 per minute.
  private readonly maxAttempts = 5;
  private readonly windowMs = 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const id = req.body?.mobile_no || req.body?.mobileno;
    const key = `otp:${id}`;
    const now = Date.now();

    const entry = otpAttemptStore.get(key);

    if (!entry || now - entry.firstAttemptAt > this.windowMs) {
      otpAttemptStore.set(key, { count: 1, firstAttemptAt: now });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      throw new HttpException(
        {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many attempts. Please try again later.',
          retryAfter: `${this.windowMs / 1000} seconds`,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    entry.count++;
    return true;
  }
}
