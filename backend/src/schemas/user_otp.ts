import { z } from "zod";

export const UserOtpSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().nonempty(),
    otp: z
        .string()
        .min(6, "OTP must be at least 6 characters long")
        .max(6, "OTP must be at most 6 characters long"),
    otp_type: z.enum(["phone", "email"]),
    expires_at: z.date(),
    created_at: z.date().default(() => new Date()),
});

export const UserOtpSchemaForCreation = UserOtpSchema.omit({
    id: true,
    created_at: true,
});
