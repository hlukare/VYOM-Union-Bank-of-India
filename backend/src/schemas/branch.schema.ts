import { z } from "zod";

export const BranchSchema = z.object({
    id: z.string().uuid().optional(),
    branch_code: z
        .string()
        .regex(/^[A-Za-z0-9]{3,10}$/)
        .min(3, "Branch code must be at least 3 characters long")
        .max(10, "Branch code must be at most 10 characters long"),
    branch_name: z.string().min(1, "Branch name is required"),
    address: z.string().min(1, "Address is required"),
    phone: z
        .string()
        .regex(/^[0-9]{10,15}$/)
        .min(10, "Phone number must be at least 10 digits long")
        .max(15, "Phone number must be at most 15 digits long"),
    manager_id: z.string().uuid().optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
