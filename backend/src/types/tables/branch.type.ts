import { z } from "zod";
import { BranchSchema } from "../../schemas/branch.schema";

export type BranchType = z.infer<typeof BranchSchema>;
