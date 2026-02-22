import express from "express";
import { errorMiddleware } from "./api/middlewares/error.middlware";

const app = express();

app.use(express.json());

// Global error handler
app.use(errorMiddleware);

export default app;
