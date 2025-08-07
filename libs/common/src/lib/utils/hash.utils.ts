import { createHash } from 'crypto';
import { InAppOtpDtoGetDetails, OtpRequestDto } from '../dtos/otp.dto';
import { getCurrentDate } from './date.utils';
import { DateFormat } from '../enums/date.enum';

export function createInAppSignature(
  dto: InAppOtpDtoGetDetails | OtpRequestDto,
  salt: string
): string {
  const {
    mobileNumber,
    deviceId,
    serviceType,
    timeLimit,
  } = dto;

  const username = 'username' in dto ? dto.username?.trim() : '';
  const password = 'password' in dto ? dto.password?.trim() : '';
  const date = 'date' in dto ? dto.date?.trim() : '';
  const otpType = 'otpType' in dto ? dto.otpType?.trim() : '';

  const DELIMITER = '|';
  const dataToHash = [
    username?.trim(),
    password?.trim(),
    mobileNumber?.trim(),
    deviceId?.trim(),
    date?.trim(),
    serviceType?.trim(),
    timeLimit,
    otpType?.trim(),
    salt?.trim(),
  ].join(DELIMITER);

  return createHashSignature(dataToHash);
}

export async function createTokenSignature(
  apiKey: string,
  secretKey: string
): Promise<string> {
  const currentDate = getCurrentDate(DateFormat.YMD);
  const data = [apiKey, secretKey, currentDate.trim()].join('|');

  return createHashSignature(data);
}

export function createHashSignature(data: string): string {
  return createHash('sha512').update(data).digest('hex');
}
