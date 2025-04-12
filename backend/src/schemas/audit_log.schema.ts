import { z } from "zod";

export const AuditLogSchema = z.object({
    id: z.string().uuid().optional(),
    event_type: z
        .enum([
            "login",
            "transaction",
            "account_change",
            "loan_request",
            "service_ticket",
        ])
        .refine(
            (value) => {
                const validValues = [
                    "login",
                    "transaction",
                    "account_change",
                    "loan_request",
                    "service_ticket",
                ];
                if (!validValues.includes(value)) {
                    return false;
                }
                return true;
            },
            {
                message:
                    "event_type must be one of the following: login, transaction, account_change, loan_request, service_ticket",
            }
        ),
    user_id: z.string().uuid().optional(),
    employee_id: z.string().uuid().optional(),
    details: z.string().min(1),
    ip_address: z.string().refine(
        (value) => {
            try {
                const address = value.split(":")[0];
                const port = value.split(":")[1];
                if (address && port) {
                    const addressParts = address.split(".");
                    if (addressParts.length === 4) {
                        return addressParts.every((part) => {
                            const number = parseInt(part);
                            return number >= 0 && number <= 255;
                        });
                    }
                }
                return false;
            } catch (error) {
                return false;
            }
        },
        {
            message:
                "ip_address must be in the format of 'XXX.XXX.XXX.XXX:XXXX'",
        }
    ),
    timestamp: z.date().default(() => new Date()),
});
