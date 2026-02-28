import { taskQueue } from "../queue/bull.config";

export async function createTask(data: {
  type: string;
  payload: any;
  priority?: number;
  scheduledAt?: number;
}) {
  return taskQueue.add(data.type, data.payload, {
    priority: data.priority || 1,
    delay: data.scheduledAt ? data.scheduledAt - Date.now() : 0,
  });
}
