import { Injectable, LoggerService } from '@nestjs/common';
import { winstonLogger } from './winston.logger';

@Injectable()
export class CustomLoggerService implements LoggerService {
  log(...message: string[]) {
    winstonLogger.info(message);
  }

  error(message: string, trace?: string) {
    winstonLogger.error(message, trace);
  }

  warn(message: string) {
    winstonLogger.warn(message);
  }

  debug(message: string) {
    winstonLogger.debug(message);
  }

  verbose(message: string) {
    winstonLogger.verbose(message);
  }
}
