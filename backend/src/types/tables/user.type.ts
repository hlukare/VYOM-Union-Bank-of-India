import { z } from "zod";
import {
    UserSchema,
    UserSchemaForCreation,
    MaritalStatusOptions,
    GenderOptions,
    kycStatusOptions,
    registrationStatusOptions,
} from "../../schemas/user.schema";

export type UserType = z.infer<typeof UserSchema>;
export type UserSchemaForCreationType = z.infer<typeof UserSchemaForCreation>;
export type MaritalStatusType = (typeof MaritalStatusOptions)[number];
export type GenderType = (typeof GenderOptions)[number];
export type KycStatusType = (typeof kycStatusOptions)[number];
export type RegistrationStatusType = (typeof registrationStatusOptions)[number];
