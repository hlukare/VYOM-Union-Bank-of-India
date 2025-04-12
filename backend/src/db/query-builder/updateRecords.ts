import { QueryResultRow } from "pg";
import { UpdateOptions } from "../../types/dbServices.type";
import { ValidationError } from "../../utils/errors";

export const updateRecordsQuery = <T extends QueryResultRow>(
    table: string,
    data: Partial<T>,
    options: UpdateOptions
) => {
    if (!options.where || options.where.length === 0) {
        throw new ValidationError(
            "UPDATE queries must have a WHERE condition."
        );
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
        throw new ValidationError("No data provided for update.");
    }

    const params: any[] = [];
    const setClauses = keys.map((key, index) => `"${key}" = $${index + 1}`);
    params.push(...Object.values(data));

    const whereClauses: string[] = [];
    options.where.forEach(({ column, operator, value }, index) => {
        const paramIndex = params.length + 1;
        if (operator === "IN" && Array.isArray(value)) {
            const placeholders = value
                .map((_, i) => `$${paramIndex + i}`)
                .join(", ");
            whereClauses.push(`"${column}" IN (${placeholders})`);
            params.push(...value);
        } else {
            whereClauses.push(`"${column}" ${operator} $${paramIndex}`);
            params.push(value);
        }
    });

    let query = `UPDATE "${table}" SET ${setClauses.join(", ")}`;
    query += ` WHERE ${whereClauses.join(" AND ")}`;

    if (options.returning && options.returning.length > 0) {
        query += ` RETURNING ${options.returning.map((col) => `${col}`).join(", ")}`;
    }

    return { text: query, params };
};

/*
Example Usage

const query = updateRecords("users", { status: "inactive", last_login: new Date() }, {
    where: [
        { column: "role", operator: "IN", value: ["admin", "editor"] },
        { column: "last_login", operator: "<", value: "2024-01-01" },
    ],
    returning: ["id", "name", "status"],
});

console.log(query.text);  // Generated SQL
console.log(query.params); // Parameterized values
*/
