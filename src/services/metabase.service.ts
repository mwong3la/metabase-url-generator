import jwt from 'jsonwebtoken';
import { appConfig } from '../config';
import { MetabasePayload, EmbedUrlResponse } from '../types';

export class MetabaseService {
  static generateEmbedUrl(
    dashboardId: number,
    params: Record<string, any> = {},
    expirationMinutes: number = 10
  ): EmbedUrlResponse {
    const exp = Math.round(Date.now() / 1000) + (expirationMinutes * 60);
    
    const payload: MetabasePayload = {
      resource: {
        dashboard: dashboardId
      },
      params :{
        "userid": [params.userId ],
      },
      exp
    };
    console.log(payload)

    const token = jwt.sign(payload, appConfig.metabaseSecretKey);
    const url = `${appConfig.metabaseSiteUrl}/embed/dashboard/${token}#bordered=true&titled=true`;
    
    return {
      url,
      expiresAt: new Date(exp * 1000).toISOString()
    };
  }

 static buildDashboardParams(userId?: string, agencyId?: string, additionalParams?: Record<string, any>): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (userId) {
      params.userId = userId;
    }
    
    if (agencyId) {
      params.agencyId = agencyId;
    }
    
    if (additionalParams) {
      Object.assign(params, additionalParams);
    }
    
    return params;
  }
}