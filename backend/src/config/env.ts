import dotenv from "dotenv";
import { EnvSchema } from "../schemas/env.schema";
dotenv.config();

const envObj = {
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    DB_URL: process.env.DB_URL,
    DB_URL_ONLINE: process.env.DB_URL_ONLINE,
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    NODE_ENV: process.env.NODE_ENV || "development",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST_ONLINE: process.env.REDIS_HOST_ONLINE,
    REDIS_PORT_ONLINE: process.env.REDIS_PORT_ONLINE,
    REDIS_PASSWORD_ONLINE: process.env.REDIS_PASSWORD_ONLINE,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION || "15m",
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || "7d",
};

const env = EnvSchema.parse(envObj);

export default env;
