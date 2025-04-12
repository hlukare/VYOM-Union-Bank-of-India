import { z } from "zod";

export const AccountSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z
        .string()
        .uuid()
        .refine((value) => value !== undefined, {
            message: "user_id must be a valid UUID",
        }),
    account_number: z.string().min(1).max(20),
    account_type: z.enum(["savings", "current", "fixed_deposit"]),
    balance: z.number().nonnegative().default(0.0),
    status: z.enum(["active", "inactive", "closed", "frozen"]),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
