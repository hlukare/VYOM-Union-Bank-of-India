import { z } from "zod";
import { AccountSchema } from "../../schemas/account.schema";

export type AccountType = z.infer<typeof AccountSchema>;

export type BankAccountType = "current" | "savings" | "fixed_deposit";

export type AccountStatusType = "active" | "inactive" | "closed" | "frozen";
