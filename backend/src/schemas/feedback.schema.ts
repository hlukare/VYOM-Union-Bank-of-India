import { z } from "zod";

export const FeedbackSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z
        .string()
        .uuid()
        .refine((value) => value !== undefined, {
            message: "User ID is required",
        }),
    employee_id: z.string().uuid().nullable(),
    rating: z.number().int().min(1).max(5).nonnegative(),
    comments: z.string().min(1).max(1000),
    created_at: z.date().default(() => new Date()),
});
