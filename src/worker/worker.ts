import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { processTask } from "./processor";
import { deadLetterQueue } from "../queue/dlq.queue";

const worker = new Worker(
  "tasks",
  async (job) => {
    return processTask(job);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

/**
 * If job permanently fails after retries,
 * push to Dead Letter Queue.
 */
worker.on("failed", async (job) => {
  console.log(
    `Job ${job?.id} failed with error: ${job?.failedReason} details:`,
    job,
  );
  if (job?.attemptsMade === job?.opts.attempts) {
    await deadLetterQueue.add("dead-task", job?.data);
  }
});

export default worker;
