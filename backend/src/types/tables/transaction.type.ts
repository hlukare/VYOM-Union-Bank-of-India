import { z } from "zod";
import { TransactionSchema } from "../../schemas/transaction.schema";

export type TransactionType = z.infer<typeof TransactionSchema>;

export type TransactionTypeEnum =
    | "deposit"
    | "withdrawal"
    | "transfer"
    | "loan_repayment";

export type TransactionStatusEnum = "pending" | "completed" | "failed";

export type TransactionInitiatedByTypeEnum = "user" | "employee";
