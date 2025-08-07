export interface JwtPayload {
  apiKey: string;
  iat: string;
  [key: string]: any;
}
