import { z } from "zod";

const TransactionType = z.enum([
    "deposit",
    "withdrawal",
    "transfer",
    "loan_repayment",
]);

const TransactionStatus = z.enum(["pending", "completed", "failed"]);

const TransactionInitiatedByType = z.enum(["user", "employee"]);

export const TransactionSchema = z.object({
    id: z.string().uuid().optional(),
    account_id: z.string().uuid().nonempty(),
    transaction_type: TransactionType,
    amount: z.number().positive().min(0.01),
    status: TransactionStatus,
    initiated_by: z.string().uuid().nonempty(),
    initiated_by_type: TransactionInitiatedByType,
    approved_by: z.string().uuid().nullable(),
    created_at: z.date().default(() => new Date()),
});
