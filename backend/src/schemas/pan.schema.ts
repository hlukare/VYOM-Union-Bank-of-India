import { z } from "zod";

export const PanVerificationSchema = z.object({
    verification_id: z.string().nonempty(),
    reference_id: z.number().int().nonnegative(),
    pan: z
        .string()
        .nonempty()
        .regex(/^[A-Za-z0-9]{10}$/, {
            message: "PAN number must be 10 characters long",
        }),
    name: z.string().nonempty(),
    dob: z.string(),
    name_match: z.enum(["Y", "N"]),
    dob_match: z.enum(["Y", "N"]),
    pan_status: z.enum(["E", "I", "U", "V"]),
    status: z.enum(["VALID", "INVALID", "PENDING"]),
    aadhaar_seeding_status: z.enum(["Y", "N"]),
    aadhaar_seeding_status_desc: z.string(),
});
