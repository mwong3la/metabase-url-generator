import { Request, Response } from 'express';
import { LoginRequest } from '../types';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginRequest = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'Username and password are required'
        });
      }

      // Validate user credentials
      const user = await AuthService.validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const loginResponse = AuthService.generateToken(user.userId, user.agencyId, username);

      res.json({
        success: true,
        data: loginResponse
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Login failed'
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      // User info is added to request by auth middleware
      const user = (req as any).user;
      
      res.json({
        success: true,
        data: {
          userId: user.userId,
          agencyId: user.agencyId,
          tokenExpiresAt: new Date(user.exp * 1000).toISOString()
        }
      });

    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get user info'
      });
    }
  }
}