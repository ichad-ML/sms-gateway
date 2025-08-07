import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { CollectionType, TransactionType } from '../enums/otp.enum';

export class InAppOtpDtoGetDetails {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'mobileNumber must be 11 digits',
  })
  @Expose({ name: 'mobileno' })
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'Signature' })
  signature: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'deviceID' })
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'timelimit' })
  @Transform(({ value }) => Number(value))
  timeLimit: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  serviceType: TransactionType;
}

export class OtpRequestDto {
  // @IsString()
  // @IsNotEmpty()
  // username: string;

  // @IsString()
  // @IsNotEmpty()
  // password: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'mobileNumber must be 11 digits',
  })
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  signature: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  timeLimit: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  serviceType: TransactionType;

  @IsNotEmpty()
  @IsString()
  otpType: CollectionType;
}

export class OtpResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  smsStatus?: string;
}

export class OtpVerifyDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'mobileNumber must be 11 digits',
  })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  pin: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  timeLimit: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  serviceType: TransactionType;

  // @IsString()
  // @IsNotEmpty()
  // token: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  otpType: CollectionType;
}

export class OtpVerifyResponseDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class InAppOtpResponseDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  // @IsString()
  // @IsNotEmpty()
  // message: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsString()
  // @IsNotEmpty()
  // token: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class InAppOtpValidateDto extends PickType(InAppOtpDtoGetDetails, [
  'deviceId',
  'timeLimit',
]) {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'mobileNumber must be 11 digits',
  })
  @Expose({ name: 'mobile_no' })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'pin' })
  otp: string;

  @IsNotEmpty()
  @Expose({ name: 'service_type' })
  @IsEnum(TransactionType)
  serviceType: TransactionType;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  otpType: CollectionType;
}

export class SmsOtpRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, {
    message: 'mobileNumber must be 11 digits',
  })
  @Expose({ name: 'mobileno' })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'msg' })
  message: string;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'sms_provider' })
  smsProvider: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'service_type' })
  serviceType: TransactionType;
}
