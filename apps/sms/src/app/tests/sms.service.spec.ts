import { SmsDto } from '@sms-gateway/common/dtos';
import { SmsApiService } from '../services/sms-api.service';
import { TokenService } from '../services/token.service';
import { SmsService } from '../sms/sms.service';
import { MessageType } from '@sms-gateway/common/enums';
import { mockSmsApiService, mockSmsConfig, mockTokenService } from './mock';

describe('SmsService', () => {
  let smsService: SmsService;

  beforeAll(() => {
    smsService = new SmsService(
      mockSmsConfig,
      mockSmsApiService as SmsApiService,
      mockTokenService as TokenService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks().restoreAllMocks();
  });

  it('should be defined', () => {
    expect(smsService).toBeDefined();
  });

  it('should send SMS successfully', async () => {
    const inputDto: SmsDto = {
      type: MessageType.SMS,
      message: 'Your verification code is: {code}',
      mobileNumber: '+1234567890',
      value: 'code=123456',
    };

    const expectedApiPayload = {
      messageType: 'SMS',
      text: 'Your verification code is: {code}',
      destination: '+1234567890',
      keyValues: 'code=123456',
    };

    const mockToken = 'mock-access-token';
    const expectedResponse = {
      success: true,
      messageId: 'msg-12345',
      status: 'sent',
    };

    jest.spyOn(mockTokenService, 'getAccessToken').mockReturnValue(mockToken);
    jest
      .spyOn(mockSmsApiService, 'sendSms')
      .mockResolvedValue(expectedResponse);

    const result = await smsService.sendSms(inputDto);

    expect(mockTokenService.getAccessToken).toHaveBeenCalledTimes(1);
    expect(mockSmsApiService.sendSms).toHaveBeenCalledWith(
      expectedApiPayload,
      mockToken,
      mockSmsConfig.smsBaseUrl
    );
    expect(result).toEqual(expectedResponse);
  });
});

// npx nx test sms --testPathPattern="src/app/sms/sms.service.spec.ts"
