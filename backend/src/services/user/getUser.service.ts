import { getRecords } from "../../db/models/records";
import { tables } from "../../db/tables";
import { UserType } from "../../types/tables/user.type";

export async function getUser(id: string) {
    const user = await getRecords<UserType>(tables.users, {
        where: [
            {
                column: "id",
                operator: "=",
                value: id,
            },
        ],
    });
    return user;
}
