import { CollectionType } from '../enums/otp.enum';

export function isSmsOTP(data: string): boolean {
  return data === CollectionType.SMS_OTP;
}
