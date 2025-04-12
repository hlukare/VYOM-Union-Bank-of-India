import { z } from "zod";

export const VideoQuerySchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().nonempty(),
    file_url: z.string().url().nonempty(),
    transcript: z.string().optional(),
    status: z.enum(["in_progress", "processed", "assigned"]),
    is_deleted: z.boolean().default(false),
    assigned_to: z.string().uuid().optional(),
    created_at: z.date().default(() => new Date()),
});
