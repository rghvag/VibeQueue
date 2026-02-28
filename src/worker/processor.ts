import { Worker } from "worker_threads";
import path from "path";
import { indexJob } from "../services/elastic.service";

export function processTask(job: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const thread = new Worker(path.resolve(__dirname, "thread.worker.js"), {
      workerData: job.data,
    });

    thread.on("message", async (result) => {
      await indexJob(job.id, result);
      resolve(result);
    });

    thread.on("error", reject);
  });
}
