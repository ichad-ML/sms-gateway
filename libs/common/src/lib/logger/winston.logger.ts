import { createLogger, format, transports } from 'winston';
import { DateFormat } from '../enums/date.enum';

export const winstonLogger = createLogger({
  level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: DateFormat.YMD_Hms }),
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `[LoggerService][${level}] ${timestamp} : ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});
