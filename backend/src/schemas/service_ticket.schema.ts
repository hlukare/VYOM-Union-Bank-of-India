import { z } from "zod";

const ServiceTicketPriority = z.enum(["low", "medium", "high"]);

export const ServiceTicketSchema = z.object({
    id: z.string().uuid().optional(),
    ticket_number: z.string().length(12),
    user_id: z.string().uuid(),
    category: z.enum(["loan", "transaction", "account_issue", "general"]),
    description: z.string().min(1),
    status: z.enum(["open", "in_progress", "closed"]),
    assigned_to: z.string().uuid().nullable(),
    priority: ServiceTicketPriority.default("low"),
    video_query_id: z.string().uuid().nullable(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});
