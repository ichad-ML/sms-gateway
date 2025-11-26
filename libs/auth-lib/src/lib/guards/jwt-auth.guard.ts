import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log('Token:', token);
    console.log('Request Headers:', request.headers);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
    const apiKeysString =
      this.configService.get<string>('JWT_ALLOWED_API_KEYS') || '';
    const apiKeys = apiKeysString.split(',').map((key) => key.trim());

    if (!secretKey) {
      throw new UnauthorizedException('JWT secret is not defined');
    }

    try {
      const decoded = jwt.verify(token, secretKey) as unknown as JwtPayload;

      if (!decoded.apiKey || !apiKeys.includes(decoded.apiKey)) {
        throw new BadRequestException();
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenIssuedAt = decoded.iat;

      const ageInSeconds = currentTime - +tokenIssuedAt;
      console.log(
        'time difference in seconds:',
        ageInSeconds,
        'currentTime:',
        currentTime,
        'tokenIssuedAt:',
        tokenIssuedAt
      );

      if (ageInSeconds > 60) {
        return false;
      }

      request.user = decoded;
      return true;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException('Invalid API key.');
      }

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
