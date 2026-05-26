import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL ?? 'redis://localhost:16379')

if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') globalForRedis.redis = redis
