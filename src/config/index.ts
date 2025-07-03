import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  metabaseSiteUrl: process.env.METABASE_SITE_URL || 'http://localhost:3000',
  metabaseSecretKey: process.env.METABASE_SECRET_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  port: parseInt(process.env.PORT || '3001', 10),
};

if (!appConfig.metabaseSecretKey) {
  throw new Error('METABASE_SECRET_KEY is required');
}

// src/services/authService.ts
