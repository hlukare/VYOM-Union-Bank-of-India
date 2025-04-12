import { NextFunction, Request, Response } from "express";
export default async function asyncWrapper(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error); //Error is passed to error-handling middleware
        }
    };
}
