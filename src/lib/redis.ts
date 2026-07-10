import { Redis } from '@upstash/redis';

// Initialize Redis client using Upstash REST URL and Token from env variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});
