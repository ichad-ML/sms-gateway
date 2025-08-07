
import Joi from 'joi';
import { validateConfigSchema } from './utils/schema.validator';
import { ConfigModule, registerAs } from '@nestjs/config';

const schema = Joi.object({
  port: Joi.number(),

  smsOtpBaseUrl: Joi.string(),
  // inAppOtpBaseUrlGetDetails: Joi.string().required(),
  // inAppOtpBaseUrlValidate: Joi.string().required(),
  validateDeviceUrl: Joi.string(),
  authServiceUrl: Joi.string(),

  otpSalt: Joi.string(),
  authApiKey: Joi.string(),
  authSecretKey: Joi.string(),

  firebase: Joi.object({
    projectId: Joi.string(),
    clientEmail: Joi.string(),
    privateKey: Joi.string(),
    databaseURL: Joi.string(),
  }),
});

export default registerAs('otpConfig', async () => {
  await ConfigModule.envVariablesLoaded;

const config = {
  port: process.env['PORT'],

  smsOtpBaseUrl: process.env['SMS_BASE_URL'] || '',
  validateDeviceUrl: process.env['VALIDATE_DEVICE_BASE_URL'] || '',
  authServiceUrl: process.env['AUTH_SERVICE_BASE_URL'] || '',

  otpSalt: process.env['OTP_SALT'] || '',
  authApiKey: process.env['AUTH_API_KEY'] || '',
  authSecretKey: process.env['AUTH_SECRET_KEY'] || '',

  firebase: {
    projectId: process.env['FIREBASE_PROJECT_ID'],
    clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
    privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    databaseURL: process.env['FIREBASE_DATABASE_URL'],
  },
};

  validateConfigSchema('otpConfig', config, schema);

  return config;
});
