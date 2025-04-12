class ApiError extends Error {
    statusCode: number;
    message: string;
    errors: string[];
    stack?: string;
    data: null;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: string[] = [],
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.data = null;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
