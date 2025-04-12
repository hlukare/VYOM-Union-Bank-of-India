// src/utils/errors.ts

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, true);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, 401, true);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500, false);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden: Access is denied") {
        super(message, 403, true);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, true);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict: Duplicate resource") {
        super(message, 409, true);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429, true);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(
        message = "Service is currently unavailable. Please try again later"
    ) {
        super(message, 503, true);
    }
}
