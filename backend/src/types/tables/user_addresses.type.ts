import { z } from "zod";
import { UserAddressSchema } from "../../schemas/user_address.schema";

export type UserAddressType = z.infer<typeof UserAddressSchema>;
