import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { getRecords, updateRecord } from "../db/models/records";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils";
import { AuthRequest } from "../types/authRequest.type";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { ApiResponse } from "../utils/ApiResponse";
import { UserType } from "../types/tables/user.type";
import { tables } from "../db/tables";

// Refresh Token API
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshToken = req.headers["x-refresh-token"] as string;

        if (!refreshToken) {
            throw new ForbiddenError("No refresh token found");
        }

        // Verify and decode refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                env.REFRESH_TOKEN_SECRET as string
            );
        } catch (error) {
            throw new ForbiddenError("Invalid refresh token");
            return;
        }

        const userId = (decoded as { id: string }).id;

        // Fetch user by decoded user ID
        const users = await getRecords<UserType>(tables.users, {
            where: [{ column: "id", operator: "=", value: userId }],
        });

        if (users.length === 0) {
            throw new ForbiddenError(
                "Invalid refresh token. Please log in again."
            );
        }

        const user = users[0];
        // Security: If refresh token does not match, logout user
        if (refreshToken !== user?.refresh_token) {
            await updateRecord(
                tables.users,
                { refresh_token: null, updated_at: new Date() },
                { where: [{ column: "id", operator: "=", value: userId }] }
            );
            throw new ForbiddenError(
                "Invalid refresh token. Please log in again."
            );
        }

        // Generate new tokens (ROTATION)
        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        // Update refresh token in DB (Invalidate Old Token)
        await updateRecord(
            tables.users,
            { refresh_token: newRefreshToken, updated_at: new Date() },
            { where: [{ column: "id", operator: "=", value: userId }] }
        );

        // Send new tokens in response headers
        res.setHeader("x-access-token", newAccessToken);
        res.setHeader("x-refresh-token", newRefreshToken);

        ApiResponse.send(res, 200, "Tokens refreshed successfully");
        return;
    } catch (error) {
        next(error);
    }
};

// Logout API

export const logout = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id; // Assuming user ID is available in `req.user` from middleware

        if (!userId) {
            throw new UnauthorizedError("Unauthorized: No user found");
            return;
        }

        // Remove refresh token from the database
        await updateRecord(
            tables.users,
            { refresh_token: null, updated_at: new Date() },
            { where: [{ column: "id", operator: "=", value: userId }] }
        );

        ApiResponse.send(res, 200, "Logout successful");

        return;
    } catch (error) {
        next(error);
    }
};
