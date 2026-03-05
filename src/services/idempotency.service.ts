import { redis } from "../config/redis";

export async function registerIdempotencyKey(key: string, jobId: string) {
  const result = await redis.set(`idem:${key}`, jobId, "EX", 86400, "NX");
  return result === "OK";
}

export async function getExistingJob(key: string) {
  return redis.get(`idem:${key}`);
}
