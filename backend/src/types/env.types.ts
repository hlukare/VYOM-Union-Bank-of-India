import { EnvSchema } from "../schemas/env.schema";
import { z } from "zod";

export type EnvType = z.infer<typeof EnvSchema>;
