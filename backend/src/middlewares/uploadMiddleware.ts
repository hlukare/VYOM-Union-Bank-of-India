import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Middleware Configuration Type
interface UploadFieldConfig {
    name: string;
    maxCount: number;
}

interface UploadOptions {
    fields: UploadFieldConfig[];
    acceptedTypes?: string[]; // Allowed MIME types
    maxSize?: number; // Max file size in bytes
    minSize?: number; // Min file size in bytes
    folder?: string; // Custom folder in Cloudinary
}

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
        const fileExt = path.extname(file.originalname); // Extract extension
        const uniqueFilename = `${uuidv4()}${fileExt}`; // Unique UUID filename

        return {
            folder: "union_bank", // Default folder (can be customized)
            public_id: uniqueFilename, // Store with UUID
            resource_type: "auto", // Supports images, videos, and raw files
            transformation: [{ quality: "auto", fetch_format: "auto" }],
        };
    },
});

// Secure File Filter (Validates MIME Type & Size)
const fileFilter = (
    acceptedTypes?: string[],
    minSize?: number,
    maxSize?: number
) => {
    return (
        req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (acceptedTypes && !acceptedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    `❌ Invalid file type. Allowed: ${acceptedTypes.join(", ")}`
                )
            );
        }
        if (minSize && file.size < minSize) {
            return cb(
                new Error(
                    `❌ File too small. Minimum size: ${minSize / 1024} KB`
                )
            );
        }
        if (maxSize && file.size > maxSize) {
            return cb(
                new Error(
                    `❌ File too large. Maximum size: ${maxSize / 1024} KB`
                )
            );
        }
        cb(null, true);
    };
};

// Dynamic Middleware for Secure File Uploads
export const uploadDynamicFiles = (options: UploadOptions) => {
    const upload = multer({
        storage,
        fileFilter: fileFilter(
            options.acceptedTypes,
            options.minSize,
            options.maxSize
        ),
        limits: { fileSize: options.maxSize }, // Max file size validation
    });

    return (req: Request, res: Response, next: NextFunction) => {
        upload.fields(options.fields)(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            if (!req.files)
                return res.status(400).json({ error: "No files uploaded" });

            // ✅ Extract Secure File URLs Dynamically
            const fileUrls: Record<string, string | string[]> = {};
            for (const field of options.fields) {
                const uploadedFiles = (
                    req.files as Record<string, Express.Multer.File[]>
                )[field.name];
                if (uploadedFiles) {
                    fileUrls[field.name] =
                        uploadedFiles.length > 1
                            ? uploadedFiles.map((file) => file.path) // Multiple files → Array
                            : uploadedFiles[0].path; // Single file → String
                }
            }

            req.body.fileUrls = fileUrls;
            next();
        });
    };
};
