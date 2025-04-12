import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./config/logger";
import { errorHandler } from "./middlewares/error.middleware";
import env from "./config/env";
import { runMigrations } from "./db/init";

import v1Router from "./routes/v1";
import { uploadDynamicFiles } from "./middlewares/uploadMiddleware";
import { ApiResponse } from "./utils/ApiResponse";
import { NotFoundError } from "./utils/errors";
// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Compression Middleware
app.use(compression());

// CORS Middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Static Middleware
app.use(express.static("public"));

// JSON & URL-Encoded Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Logging Middleware (Morgan + Winston)
app.use(
    morgan("combined", {
        stream: { write: (message: string) => logger.info(message.trim()) },
    })
);

// JSON & URL-Encoded Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
    ApiResponse.send(res, 200, "Hello World");
    return;
});

app.use("/api/v1", v1Router);

const upload = () => {
    return uploadDynamicFiles({
        fields: [
            { name: "profilePic", maxCount: 1 }, // Single file
            // { name: "documents", maxCount: 5 }, // Multiple files
        ],
        acceptedTypes: ["image/jpeg", "image/png", "application/pdf"], // Allowed file types
        maxSize: 5 * 1024 * 1024, // Max 5MB
        minSize: 10 * 1024, // Min 10KB
        folder: "banking-app", // Custom folder for organization
    });
};

app.get("/test", async (req: Request, res: Response) => {
    await runMigrations();
    res.status(200).json({ message: "Hello, World!" });
});
app.post("/test", upload(), async (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello, World!", data: req.files });
});

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError("Route not found"));
});

// Global Error Handler
app.use(errorHandler);

// 🚀 Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
