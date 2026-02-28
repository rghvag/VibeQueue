import { Router } from "express";
import {
  createTaskHandler,
  getTaskStatus,
  searchTasks,
} from "../controllers/task.controller";

const router = Router();

router.post("/tasks", createTaskHandler);
router.get("/tasks/:id", getTaskStatus);
router.get("/tasks/search", searchTasks);

export default router;
