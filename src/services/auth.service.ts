import jwt from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload } from '../types';

export class AuthService {
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static extractTokenFromHeader(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header format');
    }
    return authHeader.substring(7);
  }
}