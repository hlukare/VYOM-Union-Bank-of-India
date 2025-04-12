import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { AuthRequest } from "../types/authRequest.type";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

// Middleware for verifying access tokens
const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Unauthorized: No access token found");
        }

        const accessToken = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(
                accessToken,
                env.ACCESS_TOKEN_SECRET as string
            ) as { id: string };
            req.user = { id: decoded.id };
            return next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.log("Token expired");
                throw new UnauthorizedError("Unauthorized: Token expired");
            }
            throw new ForbiddenError("Forbidden: Invalid access token");
        }
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
