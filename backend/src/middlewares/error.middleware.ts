import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

// Centralized error handler
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message =
        err instanceof AppError ? err.message : "Something went wrong";

    console.error({
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.originalUrl,
        method: req.method,
    });

    res.status(statusCode).json({
        status: "error",
        message,
    });
}
