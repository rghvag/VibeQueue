import { estypes } from "@elastic/elasticsearch";

type Query = estypes.QueryDslQueryContainer;
type SortOrder = estypes.SortOrder;
import { Request, Response, NextFunction } from "express";
import { createTask } from "../../services/task.service";
import {
  registerIdempotencyKey,
  getExistingJob,
} from "../../services/idempotency.service";
import { taskQueue } from "../../queue/bull.config";
import { elasticClient } from "../../config/elastic";

export async function createTaskHandler(req: Request, res: Response) {
  const idemKey = req.header("Idempotency-Key");

  if (!idemKey) {
    return res.status(400).json({ error: "Missing Idempotency-Key" });
  }

  const existing = await getExistingJob(idemKey);
  if (existing) {
    return res.json({ message: "Duplicate request", jobId: existing });
  }

  const job = await createTask(req.body);

  const stored = await registerIdempotencyKey(idemKey, job.id!);
  if (!stored) {
    return res.status(409).json({ error: "Duplicate detected" });
  }

  return res.status(201).json({ jobId: job.id, job, stored });
}

export async function getTaskStatus(req: Request, res: Response) {
  const job = await taskQueue.getJob(req.params.id as string);

  if (!job) return res.status(404).json({ error: "Not found" });

  const state = await job.getState();

  res.json({
    id: job.id,
    state,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
  });
}

export async function searchTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      type,
      page = "1",
      limit = "10",
      sort = "createdAt",
      order = "desc",
    } = req.query as Record<string, string>;
    console.log("Search params:", { type, page, limit, sort, order });

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const pageSize = Math.min(parseInt(limit) || 10, 100);
    const from = (pageNumber - 1) * pageSize;

    const allowedSortFields = ["createdAt", "priority", "status"];
    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";

    const sortOrder: SortOrder = order === "asc" ? "asc" : "desc";

    const query: Query = type ? { term: { type } } : { match_all: {} };

    const result = await elasticClient.search({
      index: "jobs",
      from,
      size: pageSize,
      query,
      // sort: [
      //   {
      //     [sortField]: {
      //       order: sortOrder,
      //     },
      //   },
      // ],
    });

    return res.json({
      page: pageNumber,
      total:
        typeof result.hits.total === "number"
          ? result.hits.total
          : (result.hits.total?.value ?? 0),
      data: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
      })),
    });
  } catch (error) {
    next(error);
  }
}
