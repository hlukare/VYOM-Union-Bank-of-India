import { z } from "zod";
import { UserKycDocumentsSchema } from "../../schemas/user_kyc_documents";

export type UserKycDocumentsType = z.infer<typeof UserKycDocumentsSchema>;
