import { z } from "zod";
import { PanVerificationSchema } from "../schemas/pan.schema";

export type PanVerificationType = z.infer<typeof PanVerificationSchema>;
