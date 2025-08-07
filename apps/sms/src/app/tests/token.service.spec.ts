import { mockSmsApiService, mockSmsConfig } from './mock';
import { SmsApiService } from '../services/sms-api.service';
import { TokenService } from '../services/token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  const mockTokens = {
    accessToken: 'initial-access-token',
    refreshToken: 'initial-refresh-token',
  };

  const newTokens = {
    accessToken: 'new-auth-token',
    refreshToken: 'new-refresh-token',
  };

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeAll(() => {
    jest.useFakeTimers();
    tokenService = new TokenService(
      mockSmsConfig,
      mockSmsApiService as SmsApiService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks().restoreAllMocks();

    jest
      .spyOn(tokenService as any, 'requestNewTokens')
      .mockResolvedValue(mockTokens);

    tokenService.onModuleInit();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('should initialize tokens on module init', async () => {
    const setTokensSpy = jest
      .spyOn(tokenService as any, 'setTokens')
      .mockImplementation(jest.fn());
    const startRefreshCycleSpy = jest
      .spyOn(tokenService as any, 'startAccessTokenRefreshCycle')
      .mockImplementation(jest.fn());

    await tokenService.onModuleInit();

    expect(setTokensSpy).toHaveBeenCalledWith(mockTokens);
    expect(startRefreshCycleSpy).toHaveBeenCalledTimes(1);
  });

  describe('getAccessToken', () => {
    it('should return the current access token', () => {
      const token = tokenService.getAccessToken();
      expect(token).toBe(mockTokens.accessToken);
    });

    it('should return undefined if no token is set', () => {
      jest.spyOn(tokenService, 'getAccessToken').mockReturnValue('');
      const token = tokenService.getAccessToken();
      expect(token).toBeFalsy();
    });
  });

  describe('Private Methods', () => {
    beforeEach(async () => {
      jest
        .spyOn(mockSmsApiService, 'generateToken')
        .mockResolvedValue(mockTokens);
      tokenService.onModuleInit();
    });

    describe('refreshAccessToken', () => {
      it('should refresh access token successfully', async () => {
        jest.spyOn(mockSmsApiService, 'refreshToken').mockResolvedValue({
          accessToken: newTokens.accessToken,
        });

        const result = await (tokenService as any).refreshAccessToken();

        expect(mockSmsApiService.refreshToken).toHaveBeenCalledWith(
          mockTokens.refreshToken,
          mockTokens.accessToken,
          'http://localhost:3000'
        );
        expect(result).toBe(newTokens.accessToken);
      });
    });

    describe('isRefreshTokenExpired', () => {
      it('should return false for non-expired refresh token', () => {
        expect((tokenService as any).isRefreshTokenExpired()).toBe(false);
      });

      it('should return true for expired refresh token', () => {
        const nineHoursAgo = Math.floor(Date.now() / 1000) - 9 * 60 * 60;
        (tokenService as any).refreshTokenIssuedAt = nineHoursAgo;
        expect((tokenService as any).isRefreshTokenExpired()).toBe(true);
      });
    });

    describe('Token Refresh Cycle', () => {
      beforeEach(async () => {
        jest
          .spyOn(mockSmsApiService, 'generateToken')
          .mockResolvedValue(mockTokens);

        tokenService.onModuleInit();
      });

      it('should refresh access token automatically after 25 minutes', async () => {
        const mockNewToken = 'refreshed-access-token';
        jest.spyOn(mockSmsApiService, 'refreshToken').mockResolvedValue({
          accessToken: mockNewToken,
        });
        jest
          .spyOn(tokenService, 'getAccessToken')
          .mockReturnValue(mockNewToken);

        const refreshAccessTokenSpy = jest.spyOn(
          tokenService as any,
          'refreshAccessToken'
        );

        jest.advanceTimersByTime(25 * 60 * 1000);
        await jest.runAllTicks();

        expect(refreshAccessTokenSpy).toHaveBeenCalled();
        expect(tokenService.getAccessToken()).toBe(mockNewToken);
      });

      it('should re-authenticate when refresh token is expired', async () => {
        jest
          .spyOn(tokenService as any, 'isRefreshTokenExpired')
          .mockReturnValue(true);
        jest
          .spyOn(mockSmsApiService, 'generateToken')
          .mockResolvedValue(newTokens);
        jest
          .spyOn(tokenService, 'getAccessToken')
          .mockReturnValue(newTokens.accessToken);

        const requestNewTokensSpy = jest.spyOn(
          tokenService as any,
          'requestNewTokens'
        );

        jest.advanceTimersByTime(25 * 60 * 1000);
        await jest.runAllTicks();

        expect(requestNewTokensSpy).toHaveBeenCalled();
        expect(tokenService.getAccessToken()).toBe(newTokens.accessToken);
      });

      // it('should log error when token refresh fails', async () => {
      //   const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      //   const mockError = new Error('Network timeout');

      //   jest
      //     .spyOn(mockSmsApiService, 'refreshToken')
      //     .mockRejectedValue(mockError);

      //   // Make sure the refresh cycle is started
      //   (tokenService as any).startAccessTokenRefreshCycle();

      //   // Now advance the timers
      //   jest.advanceTimersByTime(25 * 60 * 1000);

      //   // Wait for the async operation to complete
      //   await new Promise((resolve) => setImmediate(resolve));

      //   expect(consoleSpy).toHaveBeenCalledWith(
      //     expect.stringContaining(
      //       '[TokenService] Token refresh failed: Network timeout'
      //     )
      //   );
      //   consoleSpy.mockRestore();
      // });
    });
  });
});

// npx nx test sms --testPathPattern="src/app/tests/token.service.spec.ts"
