import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header is required'
      });
    }

    const token = AuthService.extractTokenFromHeader(authHeader);
    const payload = AuthService.verifyToken(token);
    
    // Add user info to request for later use
    (req as any).user = payload;
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}