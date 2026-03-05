import { Router } from "express";
import {
  createTaskHandler,
  getTaskStatus,
  searchTasks,
} from "../controllers/task.controller";

const router = Router();

router.post("/tasks", createTaskHandler);
router.get("/tasks/search", searchTasks);
router.get("/tasks/:id", getTaskStatus);

export default router;
