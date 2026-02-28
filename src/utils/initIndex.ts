import { elasticClient } from "../config/elastic";

export async function initIndex() {
  const exists = await elasticClient.indices.exists({
    index: "jobs",
  });

  if (!exists) {
    await elasticClient.indices.create({
      index: "jobs",
      mappings: {
        properties: {
          type: { type: "keyword" },
          completedAt: { type: "date" },
          result: { type: "long" },
        },
      },
    });
  }
}
