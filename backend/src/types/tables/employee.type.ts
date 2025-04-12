import { z } from "zod";
import { EmployeeSchema } from "../../schemas/employee.schema";

export type EmployeeType = z.infer<typeof EmployeeSchema>;

export type EmployeeRolesType =
    | "manager"
    | "cashier"
    | "loan_officer"
    | "customer_support";

export type EmployeeStatusType = "active" | "inactive" | "terminated";
