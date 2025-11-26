import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRateLimitGuard } from '@sms-gateway/auth-lib';
import { OtpRequestDto, OtpResponseDto, OtpVerifyDto, OtpVerifyResponseDto } from '@sms-gateway/common/dtos';
import { isSmsOTP } from '@sms-gateway/common/utils';
import { CollectionType } from '@sms-gateway/common/enums';

@UseGuards(OtpRateLimitGuard)
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/')
  async requestOtp(@Body() requestDto: OtpRequestDto): Promise<OtpResponseDto> {
    const collection = isSmsOTP(requestDto.otpType)
      ? CollectionType.SMS_OTP
      : CollectionType.IN_APP_OTP;

    return this.otpService.requestOtp(requestDto, collection);
  }

  @Post('/verify')
  async verifyOtp(
    @Body() requestDto: OtpVerifyDto
  ): Promise<OtpVerifyResponseDto> {
    const collection = isSmsOTP(requestDto.otpType)
      ? CollectionType.SMS_OTP
      : CollectionType.IN_APP_OTP;

    return this.otpService.verifyOtp(requestDto, collection);
  }
}
