import * as Joi  from 'joi';
import { ConfigModule, registerAs } from '@nestjs/config';
import { validateConfigSchema } from './utils/schema.validator';

const schema = Joi.object({
  port: Joi.number(),

  smartSms: Joi.object({
    baseUrl: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    enabled: Joi.boolean(),
  }),

  globeSms: Joi.object({
    baseUrl: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    enabled: Joi.boolean(),
  }),

  smsMaintenanceEnabled: Joi.boolean(),
});

export default registerAs('smsConfig', async () => {
  await ConfigModule.envVariablesLoaded;

  const config = {
    port: process.env['PORT'] || 3000,

    smartSms: {
      baseUrl: process.env['SMART_SMS_BASE_URL'] || '',
      username: process.env['SMART_SMS_USERNAME'] || '',
      password: process.env['SMART_SMS_PASSWORD'] || '',
      enabled: process.env['SMART_SMS_ENABLED'] === 'true',
    },

    globeSms: {
      baseUrl: process.env['GLOBE_SMS_BASE_URL'] || '',
      username: process.env['GLOBE_SMS_USERNAME'] || '',
      password: process.env['GLOBE_SMS_PASSWORD'] || '',
      enabled: process.env['GLOBE_SMS_ENABLED'] === 'true',
    },

    smsMaintenanceEnabled: process.env['SMS_MAINTENANCE_ENABLED'] === 'false',
  };

  validateConfigSchema('smsConfig', config, schema);

  return config;
});
