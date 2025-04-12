import { z } from "zod";
import { ServiceTicketSchema } from "../../schemas/service_ticket.schema";

export type ServiceTicketType = z.infer<typeof ServiceTicketSchema>;

export type ServiceTicketCategoryType =
    | "loan"
    | "transaction"
    | "account_issue"
    | "general";

export type ServiceTicketStatusType = "open" | "in_progress" | "closed";

export type ServiceTicketPriorityType = "low" | "medium" | "high";
