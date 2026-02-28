import { redis } from "../config/redis";

/**
 * Prevents duplicate job creation.
 * Uses Redis SET NX to ensure only one request with same key succeeds.
 */
export async function registerIdempotencyKey(key: string, jobId: string) {
  const result = await redis.set(`idem:${key}`, jobId, "EX", 86400, "NX");
  return result === "OK";
}

export async function getExistingJob(key: string) {
  return redis.get(`idem:${key}`);
}
