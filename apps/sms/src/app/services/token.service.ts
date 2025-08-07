import { Inject, Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { SmsApiService } from './sms-api.service';
import type { ConfigType } from '@nestjs/config';
import { smsConfig } from '@otp-gateway/config';
import { getCurrentDate } from '@otp-gateway/common/utils';
import { DateFormat } from '@otp-gateway/common/enums';

@Injectable()
export class TokenService implements OnModuleInit {
  private accessToken: string;
  private refreshToken: string;

  // Token lifetimes (in seconds)
  private readonly accessTokenTTL = 1800; // 30 minutes
  private readonly refreshTokenTTL = 28800; // 8 hours
  private readonly bufferSeconds = 300; // 5-minute early refresh

  private refreshTokenIssuedAt: number;
  private refreshIntervalId: NodeJS.Timer;

  constructor(
    @Inject(smsConfig.KEY)
    private readonly config: ConfigType<typeof smsConfig>,
    private readonly smsApiService: SmsApiService
  ) {}

  onModuleInit() {
    this.initTokens();
  }

  private async initTokens() {
    const tokens = await this.requestNewTokens();
    this.setTokens(tokens);
    this.startAccessTokenRefreshCycle();
  }

  private setTokens(tokens: { accessToken: string; refreshToken: string }) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.refreshTokenIssuedAt = Math.floor(Date.now() / 1000);
  }

  private startAccessTokenRefreshCycle() {
    const intervalSeconds = this.accessTokenTTL - this.bufferSeconds;

    this.refreshIntervalId = setInterval(async () => {
      try {
        if (this.isRefreshTokenExpired()) {
          console.warn(
            '[TokenService] Refresh token expired — re-authenticating...'
          );
          const tokens = await this.requestNewTokens();
          this.setTokens(tokens);
          console.log('[TokenService] Successfully re-authenticated.');
        } else {
          const newAccessToken = await this.refreshAccessToken();
          this.accessToken = newAccessToken;
          const currentDate = getCurrentDate(DateFormat.YMD_Hms);
          console.log(
            `[TokenService] Access token refreshed at ${currentDate}`
          );
        }
      } catch (err: any) {
        console.error(`[TokenService] Token refresh failed: ${err.message}`);
      }
    }, intervalSeconds * 1000); // e.g., every 25 minutes
  }

  private isRefreshTokenExpired(): boolean {
    const now = Math.floor(Date.now() / 1000);
    return now - this.refreshTokenIssuedAt >= this.refreshTokenTTL;
  }

  private async refreshAccessToken(): Promise<string> {
    const baseUrl = this.config.smsBaseUrl;
    const { accessToken } = await this.smsApiService.refreshToken(
      this.refreshToken,
      this.accessToken,
      baseUrl
    );

    return accessToken;
  }

  private async requestNewTokens(): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const username = this.config.smsUsername;
    const password = this.config.smsPassword;
    const baseUrl = this.config.smsBaseUrl;

    const { accessToken, refreshToken } =
      await this.smsApiService.generateToken(username, password, baseUrl);

    return { accessToken, refreshToken };
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
