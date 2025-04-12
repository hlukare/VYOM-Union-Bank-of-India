import { z } from "zod";

export const UserKycDocumentsSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().nonempty(),
    document_type: z.enum(["aadhaar", "pan", "signature"]),
    file_url: z.string().url().nonempty(),
    uploaded_at: z
        .date()
        .default(() => new Date())
        .optional(),
});
