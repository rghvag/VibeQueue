import { Queue, QueueOptions } from "bullmq";
import { redisConnection } from "../config/redis";

const connection = redisConnection; // Use the redisConnection object from config

const defaultJobOptions: QueueOptions["defaultJobOptions"] = {
  attempts: 5, // retry up to 5 times
  backoff: {
    type: "exponential", // exponential retry delay
    delay: 1000, // base delay 1s
  },
  removeOnComplete: false,
  removeOnFail: false, // keep failed for DLQ processing
};

export const taskQueue = new Queue("tasks", {
  connection,
  defaultJobOptions,
});
