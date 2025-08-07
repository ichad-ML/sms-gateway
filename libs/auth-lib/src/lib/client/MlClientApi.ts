import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      if (error.response) {
        // this.logger.error('ERROR:', error.response.data);
      }
      throw new BadRequestException(error.message);
    }
  }
}
