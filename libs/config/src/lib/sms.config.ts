import * as Joi  from 'joi';
import { ConfigModule, registerAs } from '@nestjs/config';
import { validateConfigSchema } from './utils/schema.validator';

const schema = Joi.object({
  port: Joi.number(),

  smsBaseUrl: Joi.string().required(),
  smsUsername: Joi.string().required(),
  smsPassword: Joi.string().required(),

  smartSmsEnabled: Joi.boolean(),
  smsMaintenanceEnabled: Joi.boolean(),
});

export default registerAs('smsConfig', async () => {
  await ConfigModule.envVariablesLoaded;

  const config = {
    port: process.env['PORT'] || 3000,

    smsBaseUrl: process.env['SMS_BASE_URL'] || '',
    smsUsername: process.env['SMS_USERNAME'] || '',
    smsPassword: process.env['SMS_PASSWORD'] || '',

    smartSmsEnabled: process.env['SMART_SMS_ENABLED'] === 'true',
    smsMaintenanceEnabled: process.env['SMS_MAINTENANCE_ENABLED'] === 'true',
  };

  validateConfigSchema('smsConfig', config, schema);

  return config;
});
