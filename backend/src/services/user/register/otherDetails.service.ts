import { updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { UserSchema } from "../../../schemas/user.schema";
import { MaritalStatusType, UserType } from "../../../types/tables/user.type";
import { ValidationError } from "../../../utils/errors";

export async function addOtherDetails(
    id: string,
    occupation: string,
    annual_income: number,
    marital_status: string
) {
    try {
        const result = UserSchema.partial().safeParse({
            id,
            occupation,
            annual_income,
            marital_status,
        });
        if (!result.success) {
            throw new ValidationError(result.error.message);
        }

        // Update other details

        const updateData: Partial<UserType> = {
            occupation,
            annual_income,
            marital_status: marital_status as MaritalStatusType,
            registration_status: "face",
        };

        await updateRecord(tables.users, updateData, {
            where: [
                {
                    column: "id",
                    operator: "=",
                    value: id,
                },
            ],
        });

        return;
    } catch (error) {
        throw error;
    }
}
