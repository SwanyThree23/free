/**
 * Redis Configuration
 * Caching and session management for MCP Hub
 */

import Redis from 'ioredis';
import { logger } from './logger';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
};

// Create Redis client
export const redisClient = new Redis(redisConfig);

// Redis event handlers
redisClient.on('connect', () => {
  logger.info('✅ Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('✅ Redis client ready');
});

redisClient.on('error', (err) => {
  logger.error('❌ Redis client error:', err);
});

redisClient.on('close', () => {
  logger.warn('⚠️  Redis client connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('🔄 Redis client reconnecting...');
});

// Cache utility functions
export class CacheService {
  /**
   * Set a value in cache with optional TTL
   */
  static async set(
    key: string,
    value: any,
    ttl?: number
  ): Promise<'OK' | null> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        return await redisClient.setex(key, ttl, stringValue);
      }
      return await redisClient.set(key, stringValue);
    } catch (error) {
      logger.error(`Error setting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get a value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a key from cache
   */
  static async del(key: string): Promise<number> {
    try {
      return await redisClient.del(key);
    } catch (error) {
      logger.error(`Error deleting cache key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  static async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) return 0;
      return await redisClient.del(...keys);
    } catch (error) {
      logger.error(`Error deleting cache pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if a key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking cache key existence ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  static async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`Error getting TTL for cache key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter
   */
  static async incr(key: string): Promise<number> {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      logger.error(`Error incrementing cache key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Decrement a counter
   */
  static async decr(key: string): Promise<number> {
    try {
      return await redisClient.decr(key);
    } catch (error) {
      logger.error(`Error decrementing cache key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Add item to a set
   */
  static async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.sadd(key, ...members);
    } catch (error) {
      logger.error(`Error adding to set ${key}:`, error);
      return 0;
    }
  }

  /**
   * Get all members of a set
   */
  static async smembers(key: string): Promise<string[]> {
    try {
      return await redisClient.smembers(key);
    } catch (error) {
      logger.error(`Error getting set members ${key}:`, error);
      return [];
    }
  }

  /**
   * Remove item from a set
   */
  static async srem(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.srem(key, ...members);
    } catch (error) {
      logger.error(`Error removing from set ${key}:`, error);
      return 0;
    }
  }

  /**
   * Flush all cache (use with caution!)
   */
  static async flushAll(): Promise<'OK'> {
    try {
      logger.warn('⚠️  Flushing all cache data');
      return await redisClient.flushall();
    } catch (error) {
      logger.error('Error flushing cache:', error);
      throw error;
    }
  }
}

// Test Redis connection
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    const pong = await redisClient.ping();
    if (pong === 'PONG') {
      logger.info('✅ Redis connection successful');
      return true;
    }
    return false;
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    return false;
  }
};

export default redisClient;
