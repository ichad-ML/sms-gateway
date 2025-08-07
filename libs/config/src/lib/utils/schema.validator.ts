import Joi from 'joi';
import { inspect } from 'util';

export const validateConfigSchema = (
  context: string,
  config: object,
  schema: Joi.ObjectSchema
) => {
  const { error } = schema.validate(config, {
    abortEarly: false,
  });

  if (error) {
    console.error(
      `${context}: Config Validation Error`,
      inspect(error.details.map((entry) => entry.message))
    );
  }
};
