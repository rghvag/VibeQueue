import { Redis } from "ioredis";
export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
};

export const redis = new Redis(redisConnection);
