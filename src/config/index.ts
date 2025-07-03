import dotenv from 'dotenv';

dotenv.config();

export const config = {
  metabaseSiteUrl: process.env.METABASE_SITE_URL || 'http://localhost:3000',
  metabaseSecretKey: process.env.METABASE_SECRET_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  port: parseInt(process.env.PORT || '3001', 10),
};

if (!config.metabaseSecretKey) {
  throw new Error('METABASE_SECRET_KEY is required');
}

// src/services/authService.ts
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