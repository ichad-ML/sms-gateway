import { VerifyOTPResponse } from '@sms-gateway/common/interfaces';
import { authenticator } from 'otplib';

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function generateOTP(secret: string, timelimitSeconds = 60): string {
  authenticator.options = {
    step: timelimitSeconds, // validity period
  };

  return authenticator.generate(secret);
}

export function verifyOTP(
  secret: string,
  token: string,
  timelimitSeconds = 60
): VerifyOTPResponse {
  authenticator.options = {
    step: timelimitSeconds,
    window: 1,
  };

  const delta = authenticator.checkDelta(token, secret);

  if (delta === null) {
    return { isValid: false, isExpired: false, message: 'Invalid OTP.' };
  }

  if (delta < -1) {
    return { isValid: false, isExpired: true, message: 'OTP expired.' };
  }

  if (delta >= -1 && delta <= 1) {
    return { isValid: true, isExpired: false, message: 'OTP is valid.' };
  }

  return {
    isValid: false,
    isExpired: false,
    message: 'Unable to verify OTP.',
  };
}
