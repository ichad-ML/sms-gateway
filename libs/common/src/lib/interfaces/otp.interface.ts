export interface VerifyOTPResponse {
  isValid: boolean;
  isExpired: boolean;
  message: string;
}
