import { z } from "zod";
import { LoanSchema } from "../../schemas/loan.schema";

export type LoanType = z.infer<typeof LoanSchema>;

export type BankLoanType = "home" | "personal" | "education" | "auto";

export type LoanStatusType = "approved" | "pending" | "rejected" | "closed";
