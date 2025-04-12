import { z } from "zod";

const VideoKycSessionSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid(),
    scheduled_at: z.date(),
    agent_id: z.string().uuid().nullable(),
    status: z.enum(["scheduled", "completed", "failed", "rejected"]),
    verified_at: z.date().nullable(),
    created_at: z.date().default(() => new Date()),
});

export { VideoKycSessionSchema };
