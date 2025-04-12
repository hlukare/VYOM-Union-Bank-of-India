import { z } from "zod";

const phoneNumberSchema = z.string().regex(/^\+\d{12}$/, {
    message: "phone number must be in E.164 format",
});

export { phoneNumberSchema };
