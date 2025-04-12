import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required"),
    dob: z
        .date()
        .min(new Date("1900-01-01"), "Date of birth must be after 1900-01-01")
        .max(new Date(), "Date of birth must be before today's date"),
    gender: z.enum(["M", "F", "Other"]),
    email: z.string().email().nullable(),
    mobile_number: z
        .string()
        .regex(/^[0-9]{10,15}$/)
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be at most 15 digits long")
        .nonempty(),
    aadhar_number: z
        .string()
        .regex(/^[0-9]{12}$/)
        .min(12, "Aadhar number must be 12 digits long")
        .max(12, "Aadhar number must be 12 digits long")
        .nonempty(),
    pan_number: z
        .string()
        .regex(/^[A-Za-z0-9]{10}$/)
        .min(10, "Pan number must be 10 characters long")
        .max(10, "Pan number must be 10 characters long")
        .nullable(),
    occupation: z.string().nullable(),
    annual_income: z
        .number()
        .min(0, "Annual income must be greater than 0")
        .nullable(),
    marital_status: z
        .enum(["Single", "Married", "Divorced", "Widowed"])
        .nullable(),
    aadhar_photo_link: z.string().url().nonempty(),
    facial_embedding: z.array(z.number()).nullable(),
    kyc_status: z.enum(["pending", "approved", "rejected"]),
    registration_status: z.enum([
        "pan",
        "aadhar",
        "email",
        "face",
        "document",
        "other",
        "vkyc",
        "completed",
    ]),
    refresh_token: z.string().nullable(),
    status: z.enum(["active", "inactive"]),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

export const UserSchemaForCreation = UserSchema.pick({
    id: true,
    mobile_number: true,
    registration_status: true,
    created_at: true,
    updated_at: true,
});

export const MaritalStatusOptions = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
] as const;

export const GenderOptions = ["M", "F", "Other"] as const;

export const kycStatusOptions = ["pending", "approved", "rejected"] as const;

export const registrationStatusOptions = [
    "pan",
    "aadhar",
    "email",
    "face",
    "document",
    "other",
    "vkyc",
    "completed",
] as const;
