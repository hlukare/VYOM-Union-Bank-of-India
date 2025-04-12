import { Response } from "express";

export class ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;

    constructor(statusCode: number, message: string, data?: T) {
        this.success = statusCode >= 200 && statusCode < 300;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    static send<T>(
        res: Response,
        statusCode: number,
        message: string,
        data?: T
    ) {
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, message, data));
    }
}
