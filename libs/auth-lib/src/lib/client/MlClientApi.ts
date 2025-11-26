import axios, { AxiosRequestConfig } from 'axios';
<<<<<<< Updated upstream
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
=======
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
>>>>>>> Stashed changes
// import { CustomLoggerService } from '@ml-workspace/common';

@Injectable()
export class MlClientApi {
//   constructor(private readonly logger: CustomLoggerService) {}

  async sendRequest(config: AxiosRequestConfig, token?: string): Promise<any> {
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // this.logger.log(`\nConfig: ${JSON.stringify(config, null, 2)}`);

    try {
      const response = await axios.request(config);
      return response;
    } catch (error: any) {
<<<<<<< Updated upstream
      if (error.response) {
        // this.logger.error('ERROR:', error.response.data);
      }
=======
      if (error.response.status === HttpStatus.SERVICE_UNAVAILABLE)
        throw new ServiceUnavailableException(error.response.data);

      if (error.response.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.response.data);

>>>>>>> Stashed changes
      throw new BadRequestException(error.message);
    }
  }
}
