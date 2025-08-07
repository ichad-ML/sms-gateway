
import { OtpService } from './otp.service';
import { FirebaseService } from '../common/firebase/firebase.service';

import { BadRequestException } from '@nestjs/common';
import { OtpApiService } from '@otp-gateway/api-lib';
import { createInAppSignature, isSmsOTP } from '@otp-gateway/common/utils';
import { OtpRequestDto, OtpVerifyDto, SmsOtpResponseDto } from '@otp-gateway/common/dtos';
import { CODE, CollectionType, MESSAGE } from '@otp-gateway/common/enums';
import { decryptAES } from '../common/otp-lib/otp-encryption';
import { verifyOTP } from '../common/otp-lib/otp-lib';
import { mockFirebaseService, mockLoggerService, mockOtpApiService, mockOtpConfig } from '../common/test/mock';
import { CustomLoggerService } from '@otp-gateway/common/logger';

jest.mock('@otp-gateway/common/utils', () => ({
  ...jest.requireActual('@otp-gateway/common/utils'),
  createInAppSignature: jest.fn(),
}));

jest.mock('../common/otp-lib/otp-lib', () => ({
  ...jest.requireActual('../common/otp-lib/otp-lib'),
  verifyOTP: jest.fn(),
}));

jest.mock('../common/otp-lib/otp-encryption', () => ({
  ...jest.requireActual('../common/otp-lib/otp-encryption'),
  encryptAES: jest.fn(),
  decryptAES: jest.fn(),
}));

describe('OTPService', () => {
  let otpService: OtpService;

  beforeAll(() => {
    otpService = new OtpService(
      mockOtpConfig,
      mockOtpApiService as OtpApiService,
      mockFirebaseService as FirebaseService,
      mockLoggerService as CustomLoggerService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks().restoreAllMocks();
  });

  it('should be defined', () => {
    expect(otpService).toBeDefined();
  });

  describe('requestOtp', () => {
    const otpRequestDto = {
      mobileNumber: '09925235991',
      deviceId: '72dd435951c44e63',
      serviceType: 'ELOAD',
      signature: 'mock-signature',
      timeLimit: 120,
      otpType: 'sms-otp',
    } as unknown as OtpRequestDto;

    beforeEach(async () => {
      const token = 'token-12345';
      jest.spyOn(otpService, 'generateToken').mockResolvedValue({ token });
      (createInAppSignature as jest.Mock).mockReturnValue('expected-signature');
    });

    it('should request OTP successfully', async () => {
      const response = { status: 200 } as unknown as SmsOtpResponseDto;

      (createInAppSignature as jest.Mock).mockReturnValue('mock-signature');

      jest.spyOn(mockOtpApiService, 'validateDevice').mockResolvedValue(200);
      jest.spyOn(mockOtpApiService, 'sendSmsOTP').mockResolvedValue(response);

      jest.spyOn(mockFirebaseService, 'createDocument').mockResolvedValue({
        id: 'mock-id',
      } as any);

      const result = await otpService.requestOtp(
        otpRequestDto,
        CollectionType.SMS_OTP
      );
      const smsStatus = isSmsOTP(otpRequestDto.otpType)
        ? response.status
        : undefined;

      expect(result).toMatchObject({
        smsStatus,
        otp: expect.any(String),
        id: 'mock-id',
        code: expect.any(Number),
        name: expect.any(String),
        message: 'OTP successfully generated.',
      });
    });

    it('should throw an error if signature does not match', async () => {
      (createInAppSignature as jest.Mock).mockReturnValue('expected-signature');

      await expect(
        otpService.requestOtp(otpRequestDto, CollectionType.IN_APP_OTP)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if device validation fails', async () => {
      const otpRequestDtoV2 = {
        mobileNumber: '09925235991',
        deviceId: 'invalid-device',
        serviceType: 'ELOAD',
        signature: 'mock-signature',
        timeLimit: 120,
        otpType: 'in-app-otp',
      } as unknown as OtpRequestDto;

      jest
        .spyOn(mockOtpApiService, 'validateDevice')
        .mockRejectedValue(new Error('Device not registered'));

      await expect(
        otpService.requestOtp(otpRequestDtoV2, CollectionType.IN_APP_OTP)
      ).rejects.toThrow('Device not registered');
    });

    it('should throw if token generation fails', async () => {
      jest.spyOn(mockOtpApiService, 'validateDevice').mockResolvedValue(200);

      jest
        .spyOn(otpService, 'generateToken')
        .mockRejectedValue(new Error('Token generation failed'));

      await expect(
        otpService.requestOtp(otpRequestDto, CollectionType.IN_APP_OTP)
      ).rejects.toThrow('Token generation failed');
    });
  });

  describe('verifyOtp', () => {
    const dto = {
      id: 'otp123',
      pin: '123456',
      timeLimit: 60,
    };

    const mockSecret = 'SECRET';

    it('should verify OTP successfully', async () => {
      // mockFirebaseService.getDocument.mockResolvedValue({
      //   request: {
      //     secretKey: 'encrypted',
      //     iv: 'iv123',
      //   },
      //   validate: {
      //     otpUsed: false,
      //   },
      // });
      jest.spyOn(mockFirebaseService, 'getDocument').mockResolvedValue({
        request: {
          secretKey: 'encrypted',
          iv: 'iv123',
        },
        validate: {
          otpUsed: false,
        },
      } as any);

      (decryptAES as jest.Mock).mockReturnValue(mockSecret);
      (verifyOTP as jest.Mock).mockReturnValue({
        isValid: true,
        isExpired: false,
        message: 'OTP is valid',
      });

      const result = await otpService.verifyOtp(
        dto as OtpVerifyDto,
        CollectionType.IN_APP_OTP
      );

      expect(result).toEqual({
        message: 'OTP is valid',
        code: CODE.SUCCESS,
        name: MESSAGE.SUCCESS,
      });

      expect(mockFirebaseService.updateDocument).toHaveBeenCalledWith(
        'IN_APP',
        dto.id,
        expect.objectContaining({
          validate: expect.objectContaining({
            isValid: true,
            isExpired: false,
            otpUsed: true,
            message: 'OTP is valid',
            validatedAt: expect.any(String),
          }),
        })
      );
    });

    it('should throw BadRequest if OTP was already used', async () => {
      // otpUsed = true
    });

    it('should throw BadRequest if OTP is both invalid and expired', async () => {
      // verifyOTP -> isValid = false, isExpired = true
    });
  });
});

// npx nx test otp --testPathPattern="src/app/otp/otp.service.spec.ts"
