import { z } from "zod";

const UserAddressSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().uuid().nonempty(),
    address_type: z.enum(["permanent", "temporary"]),
    country: z.string().min(1).max(100).nonempty(),
    state: z.string().min(1).max(100).nonempty(),
    po: z.string().min(0).max(100).optional(),
    district: z.string().min(0).max(100).optional(),
    city: z.string().min(0).max(100).optional(),
    pincode: z.string().min(6).max(10).nonempty(),
    street: z.string().min(0).max(255).optional(),
    house: z.string().min(0).max(255).optional(),
    landmark: z.string().min(0).max(255).optional(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

export { UserAddressSchema };
