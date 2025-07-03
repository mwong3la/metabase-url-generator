import jwt from 'jsonwebtoken';
import { appConfig } from '../config';
import { TokenPayload, LoginResponse } from '../types';

export class AuthService {
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, appConfig.jwtSecret) as TokenPayload;
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

  static generateToken(userId: string, agencyId: string, username: string): LoginResponse {
    const payload: TokenPayload = {
      userId,
      agencyId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    const token = jwt.sign(payload, appConfig.jwtSecret);
    
    return {
      token,
      expiresAt: new Date(payload.exp! * 1000).toISOString(),
      user: {
        userId,
        agencyId,
        username
      }
    };
  }

  // Mock user database - replace with your actual user lookup
  static async validateUser(username: string, password: string): Promise<{userId: string, agencyId: string} | null> {
    // This is a mock implementation - replace with your actual authentication logic
    const mockUsers = [
      { username: 'admin', password: 'admin123', userId: 'user_001', agencyId: 'agency_001' },
      { username: 'user1', password: 'pass123', userId: 'user_002', agencyId: 'agency_001' },
      { username: 'agent1', password: 'agent123', userId: 'user_003', agencyId: 'agency_002' }
    ];

    const user = mockUsers.find(u => u.username === username && u.password === password);
    return user ? { userId: user.userId, agencyId: user.agencyId } : null;
  }
}
