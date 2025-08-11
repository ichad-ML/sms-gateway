import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
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
    const apiKey = this.configService.get<string>('JWT_API_KEY');

    if (!secretKey || !apiKey) {
      throw new UnauthorizedException('JWT secret is not defined');
    }

    try {
      const decoded = jwt.verify(token, secretKey) as unknown as JwtPayload;
      console.log('decoded=>', decoded);

      if (!decoded.apiKey || !decoded.iat) {
        return false;
      }

      if (decoded.apiKey !== apiKey) {
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const tokenIssuedAt = decoded.iat;

      const ageInSeconds = currentTime - +tokenIssuedAt;

      if (ageInSeconds > 60) {
        return false;
      }

      if (+tokenIssuedAt > currentTime) {
        return false;
      }

      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
