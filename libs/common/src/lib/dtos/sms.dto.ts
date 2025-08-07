import { IsNotEmpty, IsString } from 'class-validator';
import { MessageType } from '../enums/otp.enum';

export class SmsDto {
  @IsString()
  @IsNotEmpty()
  type: MessageType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class SmsOtpResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
