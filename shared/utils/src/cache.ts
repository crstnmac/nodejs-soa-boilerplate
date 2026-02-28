import Redis from 'ioredis';
import type { Logger } from './logger';

export interface CacheOptions {
  keyPrefix?: string;
  defaultTTL?: number;
}

export class CacheService {
  private client: Redis;
  private logger: Logger;
  private connected = false;
  private readonly keyPrefix: string;
  private readonly defaultTTL: number;

  constructor(logger: Logger, options: CacheOptions = {}) {
    this.logger = logger;
    this.keyPrefix = options.keyPrefix || 'soa';
    this.defaultTTL = options.defaultTTL || 3600;
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times + 1, 3),
      retryDelayOnFailover: 100,
      connectTimeout: 10000,
      lazyConnect: true,
      keepAlive: 30000,
    });
    
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err) => {
      this.logger.error('Redis error', { error: err.message });
      this.connected = false;
    });
    
    this.client.on('connect', () => {
      this.logger.info('Redis connected');
      this.connected = true;
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.connected = false;
    });

    this.client.on('reconnecting', () => {
      this.logger.info('Redis reconnecting...');
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }

  private getKey(key: string): string {
    return `${this.keyPrefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Cache get error', { key, error });
      return null;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttl: number = this.defaultTTL
  ): Promise<void> {
    try {
      await this.client.setex(this.getKey(key), ttl, JSON.stringify(value));
    } catch (error) {
      this.logger.error('Cache set error', { key, error });
    }
  }

  async setNX(
    key: string,
    value: unknown,
    ttl: number = this.defaultTTL
  ): Promise<boolean> {
    try {
      const result = await this.client.set(this.getKey(key), JSON.stringify(value), 'EX', ttl, 'NX');
      return result === 'OK';
    } catch (error) {
      this.logger.error('Cache setNX error', { key, error });
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(this.getKey(key));
    } catch (error) {
      this.logger.error('Cache delete error', { key, error });
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}:${pattern}`);
      if (keys.length > 0) {
        await this.client.del(keys);
        this.logger.debug('Cache invalidated', { pattern, count: keys.length });
      }
    } catch (error) {
      this.logger.error('Cache invalidate error', { pattern, error });
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}:${pattern}`);
      if (keys.length > 0) {
        const count = await this.client.del(keys);
        this.logger.debug('Cache pattern deleted', { pattern, count });
        return count;
      }
      return 0;
    } catch (error) {
      this.logger.error('Cache delete pattern error', { pattern, error });
      return 0;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const result = await this.client.incrby(this.getKey(key), amount);
      return result;
    } catch (error) {
      this.logger.error('Cache increment error', { key, error });
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(this.getKey(key));
      return result === 1;
    } catch (error) {
      this.logger.error('Cache exists error', { key, error });
      return false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async flushAll(): Promise<void> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
        this.logger.warn('Cache flushed', { count: keys.length });
      }
    } catch (error) {
      this.logger.error('Cache flush error', { error });
    }
  }
}

let cacheInstance: CacheService | null = null;

export const getCache = (logger: Logger, options?: CacheOptions): CacheService => {
  if (!cacheInstance) {
    cacheInstance = new CacheService(logger, options);
  }
  return cacheInstance;
};
