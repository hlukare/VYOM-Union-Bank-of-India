import { z } from "zod";

const EnvSchema = z.object({
    PORT: z.string(),
    CORS_ORIGIN: z.string(),
    DB_URL: z.string().url(),
    DB_URL_ONLINE: z.string().url(),
    NODE_ENV: z.enum([
        "development",
        "online_development",
        "testing",
        "online_testing",
        "production",
    ]),
    ACCESS_TOKEN_SECRET: z.string().min(32),
    ACCESS_TOKEN_EXPIRATION: z.string().refine((value) => {
        const match = value.match(/^(\d+)([smhd])$/);
        if (!match) return false;
        const num = Number(match[1]);
        const unit = match[2];
        switch (unit) {
            case "s":
                return num >= 1 && num <= 60;
            case "m":
                return num >= 1 && num <= 60;
            case "h":
                return num >= 1 && num <= 24;
            case "d":
                return num >= 1 && num <= 30;
            default:
                return false;
        }
    }),
    REFRESH_TOKEN_SECRET: z.string().min(32),
    REFRESH_TOKEN_EXPIRATION: z.string().refine((value) => {
        const match = value.match(/^(\d+)([smhd])$/);
        if (!match) return false;
        const num = Number(match[1]);
        const unit = match[2];
        switch (unit) {
            case "s":
                return num >= 1 && num <= 60;
            case "m":
                return num >= 1 && num <= 60;
            case "h":
                return num >= 1 && num <= 24;
            case "d":
                return num >= 1 && num <= 30;
            default:
                return false;
        }
    }),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.string(),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_HOST_ONLINE: z.string().min(1),
    REDIS_PORT_ONLINE: z.string(),
    REDIS_PASSWORD_ONLINE: z.string().min(1),
});

export { EnvSchema };
