import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error({
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}