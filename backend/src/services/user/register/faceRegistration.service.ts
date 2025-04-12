import { updateRecord } from "../../../db/models/records";
import { tables } from "../../../db/tables";
import { UserType } from "../../../types/tables/user.type";
import { ValidationError } from "../../../utils/errors";

const EMBEDDING_LENGTH = 128;

export async function registerFace(id: string, facial_embedding: string) {
    try {
        if (!facial_embedding || !Array.isArray(facial_embedding)) {
            throw new ValidationError("Facial Embedding should be an Array");
        }
        if (facial_embedding.length !== EMBEDDING_LENGTH) {
            throw new ValidationError(
                "Facial Embedding should be of length 128"
            );
        }

        // Update User
        await updateRecord<UserType>(
            tables.users,
            { facial_embedding, registration_status: "document" },
            {
                where: [
                    {
                        column: "id",
                        operator: "=",
                        value: id,
                    },
                ],
            }
        );
    } catch (error) {
        throw error;
    }
}
