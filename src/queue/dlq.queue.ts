import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const deadLetterQueue = new Queue("tasks-dlq", {
  connection: redisConnection,
});
