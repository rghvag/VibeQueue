import express from "express";
import { errorMiddleware } from "./api/middlewares/error.middlware";
import taskRouter from "./api/routes/task.routes";

const app = express();

app.use(express.json());

app.use("/api", taskRouter);

// Global error handler
app.use(errorMiddleware);

export default app;
