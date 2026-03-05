import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { processEmail, processNotification } from "./processor";
import { deadLetterQueue } from "../queue/dlq.queue";
import { gracefulShutdown } from "../utils/shutdown";

let worker: Worker;
try {
  worker = new Worker(
    "tasks",
    async (job) => {
      switch (job.name) {
        case "email":
          return processEmail(job);
        case "notification":
          return processNotification(job);
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    },
  );
} catch (error) {
  console.error("Error initializing worker:", error);
  process.exit(1);
}

worker.on("error", (error) => {
  console.error("Connection error. Shutting down.", error);
  process.exit(1);
});

/* If job permanently fails after retries, push to Dead Letter Queue.*/
worker.on("failed", async (job) => {
  console.log(
    `Job ${job?.id} failed with error: ${job?.failedReason} details:`,
    job,
  );
  if (job?.attemptsMade === job?.opts.attempts) {
    await deadLetterQueue.add("dead-task", job?.data);
  }
});

// Handle graceful shutdown
gracefulShutdown(null, worker);

export default worker;
