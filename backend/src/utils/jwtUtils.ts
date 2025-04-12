import { UUIDTypes } from "uuid";

import jwt from "jsonwebtoken";
import env from "../config/env";

const generateAccessToken = (id: UUIDTypes) => {
    return jwt.sign({ id }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRATION || "15m",
    } as jwt.SignOptions);
};

const generateRefreshToken = (id: UUIDTypes) => {
    return jwt.sign({ id }, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRATION || "7d",
    } as jwt.SignOptions);
};

export { generateAccessToken, generateRefreshToken };
