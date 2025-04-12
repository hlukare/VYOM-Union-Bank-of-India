import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary"; // Import Cloudinary config

// ✅ Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
        folder: "uploads", // Default folder (can override in middleware)
        format: file.mimetype.split("/")[1], // Extract format dynamically
        resource_type: "auto", // Supports images, videos, and raw files
        transformation: [{ quality: "auto", fetch_format: "auto" }],
    }),
});

// ✅ Multer Instance (Exported)
const upload = multer({ storage });

export default upload;
