export interface DashboardRequest {
    dashboardId: number;
    params?: Record<string, any>;
    expirationMinutes?: number;
  }
  
  export interface TokenPayload {
    userId?: string;
    agencyId?: string;
    iat?: number;
    exp?: number;
  }
  
  export interface MetabasePayload {
    resource: {
      dashboard: number;
    };
    params: Record<string, any>;
    exp: number;
  }
  
  export interface EmbedUrlResponse {
    url: string;
    expiresAt: string;
  }