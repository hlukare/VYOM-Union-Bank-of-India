import { z } from "zod";
import { AuditLogSchema } from "../../schemas/audit_log.schema";

export type AuditLogType = z.infer<typeof AuditLogSchema>;
