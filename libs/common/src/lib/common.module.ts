import { Module } from '@nestjs/common';
import { CustomLoggerService, LoggerModule } from './logger';

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [CustomLoggerService],
  exports: [],
})
export class CommonModule {}
