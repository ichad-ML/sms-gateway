export enum CollectionType {
  IN_APP_OTP = 'in-app-otp',
  SMS_OTP = 'sms-otp',
  SMS = 'sms',
}

export enum TransactionType {
  LOGIN = 'LOGIN',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  SENDOUT = 'SENDOUT',
  PAYOUT = 'PAYOUT',
  BILLS_PAYMENT = 'BILLS_PAYMENT',
  ELOAD = 'ELOAD',
}

export enum OTPService {
  IN_APP = 'IN_APP',
  SMS = 'SMS',
}

export enum OTPOperation {
  GET_DETAILS = 'GET_DETAILS',
  VALIDATE_OTP = 'VALIDATE_OTP',
}

export enum MessageType {
  SMS = 'SMS',
}
