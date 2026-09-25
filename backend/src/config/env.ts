import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const inProduction = process.env.NODE_ENV === 'production';

export const env = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://couda:jqU0tCJUC1d7LJHJ@cluster0.i9h9goc.mongodb.net/classwap',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'classwap_access_secret_key_2026_super_secure!',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'classwap_refresh_secret_key_2026_super_secure!',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};