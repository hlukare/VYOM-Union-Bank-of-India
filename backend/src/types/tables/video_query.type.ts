import { z } from "zod";
import { VideoQuerySchema } from "../../schemas/video_query";

export type VideoQueryType = z.infer<typeof VideoQuerySchema>;

export type VideoQueryStatusType = "assigned" | "in_progress" | "processed";
