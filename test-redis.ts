import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

async function test() {
  console.log("Testing Upstash Redis connection...");
  try {
    await redis.set('test_key', 'hello_world');
    const val = await redis.get('test_key');
    console.log("Redis connected successfully. Value:", val);
  } catch (error) {
    console.error("Redis error:", error);
  }
}

test();
