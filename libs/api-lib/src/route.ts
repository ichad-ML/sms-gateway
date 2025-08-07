export const AUTHSERVICE = {
  GENERATE_TOKEN: '/api/v1/external-user',
};

export const URLS = {
  VALIDATE_DEVICE: '/api/money-accounts/validate-device',

  REQUEST_OTP: '/api/sms',

  SEND_SMS: '/cgpapi/messages/sms', // SMART Connect API
  SMS_AUTH_LOGIN: '/rest/auth/login', // SMART Auth login - for accessToken
  SMS_AUTH_REFRESH: '/rest/auth/refresh',
};
