import { z } from "zod";

export const LoanSchema = z.object({
    id: z.string().uuid().optional(),
    loan_number: z
        .string()
        .length(12, "Loan number must be 12 characters long")
        .nonempty(),
    user_id: z.string().uuid().nonempty(),
    account_id: z.string().uuid().nonempty(),
    loan_type: z.enum(["home", "personal", "education", "auto"]),
    loan_amount: z.number().positive("Loan amount must be greater than 0"),
    interest_rate: z.number().positive("Interest rate must be greater than 0"),
    tenure: z.number().int().positive("Tenure must be greater than 0"),
    status: z.enum(["approved", "pending", "rejected", "closed"]),
    approved_by: z.string().uuid().optional(),
    created_at: z.date().default(() => new Date()),
});
