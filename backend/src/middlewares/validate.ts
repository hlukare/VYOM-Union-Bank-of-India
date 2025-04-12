import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import {
    fromError,
    ValidationError as zodValidationError,
} from "zod-validation-error";
import { ValidationError } from "../utils/errors";

export default function validate(
    schema: ZodSchema<any>,
    optional: Boolean = false
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (optional) {
                req.body = schema.optional().parse(req.body);
            } else {
                req.body = schema.parse(req.body);
            }
            next();
        } catch (error) {
            if (error instanceof zodValidationError) {
                const e = fromError(error);
                throw new ValidationError(e.message);
            }
            throw error;
        }
    };
}
