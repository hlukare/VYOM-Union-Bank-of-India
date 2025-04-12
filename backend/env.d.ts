declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: string;
        CORS_ORIGIN: string;
        DB_URL: string;
        JWT_SECRET: string;
        NODE_ENV: "development" | "testing" | "production";

        ACCESS_TOKEN_SECRET: string;
        ACCESS_TOKEN_EXPIRATION: string;
        REFRESH_TOKEN_SECRET: string;
        REFRESH_TOKEN_EXPIRATION: string;

        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;

        REDIS_HOST: string;
        REDIS_PORT?: string;
        REDIS_PASSWORD: string;
    }
}
