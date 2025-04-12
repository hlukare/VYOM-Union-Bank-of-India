import { z } from "zod";
import { FeedbackSchema } from "../../schemas/feedback.schema";

export type FeedbackType = z.infer<typeof FeedbackSchema>;
