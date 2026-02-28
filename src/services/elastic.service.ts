import { elasticClient } from "../config/elastic";

/**
 * Index completed job.
 * Stored for search & analytics.
 */
export async function indexJob(id: string, document: any) {
  await elasticClient.index({
    index: "jobs",
    id,
    document,
  });
}
