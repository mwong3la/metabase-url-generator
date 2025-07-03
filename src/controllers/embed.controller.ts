import { Request, Response } from 'express';
import { DashboardRequest } from '../types';

export class EmbedController {
  static async generateDashboardUrl(req: Request, res: Response) {
    try {
      const { dashboardId, params, expirationMinutes = 10 }: DashboardRequest = req.body;
      
      if (!dashboardId || typeof dashboardId !== 'number') {
        return res.status(400).json({
          error: 'Dashboard ID is required and must be a number'
        });
      }

      // Extract and verify JWT token
      const authHeader = req.headers.authorization as string;
      const token = AuthService.extractTokenFromHeader(authHeader);
      const userPayload = AuthService.verifyToken(token);

      // Build dashboard parameters with user context
      const dashboardParams = MetabaseService.buildDashboardParams(
        userPayload.userId,
        userPayload.agencyId,
        params
      );

      // Generate Metabase embed URL
      const embedUrl = MetabaseService.generateEmbedUrl(
        dashboardId,
        dashboardParams,
        expirationMinutes
      );

      res.json({
        success: true,
        data: embedUrl,
        context: {
          userId: userPayload.userId,
          agencyId: userPayload.agencyId
        }
      });

    } catch (error) {
      console.error('Error generating dashboard URL:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          return res.status(401).json({
            error: 'Authentication failed',
            message: error.message
          });
        }
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate dashboard URL'
      });
    }
  }

  static async generateDashboardUrlByQuery(req: Request, res: Response) {
    try {
      const dashboardId = parseInt(req.params.dashboardId, 10);
      const { params, expirationMinutes = 10 } = req.query;
      
      if (!dashboardId || isNaN(dashboardId)) {
        return res.status(400).json({
          error: 'Valid dashboard ID is required'
        });
      }

      // Extract and verify JWT token
      const authHeader = req.headers.authorization as string;
      const token = AuthService.extractTokenFromHeader(authHeader);
      const userPayload = AuthService.verifyToken(token);

      // Parse additional params if provided
      let additionalParams = {};
      if (params && typeof params === 'string') {
        try {
          additionalParams = JSON.parse(params);
        } catch (e) {
          return res.status(400).json({
            error: 'Invalid params format. Must be valid JSON string.'
          });
        }
      }

      // Build dashboard parameters with user context
      const dashboardParams = MetabaseService.buildDashboardParams(
        userPayload.userId,
        userPayload.agencyId,
        additionalParams
      );

      // Generate Metabase embed URL
      const embedUrl = MetabaseService.generateEmbedUrl(
        dashboardId,
        dashboardParams,
        Number(expirationMinutes)
      );

      res.json({
        success: true,
        data: embedUrl,
        context: {
          userId: userPayload.userId,
          agencyId: userPayload.agencyId
        }
      });

    } catch (error) {
      console.error('Error generating dashboard URL:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          return res.status(401).json({
            error: 'Authentication failed',
            message: error.message
          });
        }
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to generate dashboard URL'
      });
    }
  }
}