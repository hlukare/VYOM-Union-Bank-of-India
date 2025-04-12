import { QueryResultRow } from "pg";
import { DeleteOptions } from "../../types/dbServices.type";
import { ValidationError } from "../../utils/errors";

/**
 * DELETE query builder - Securely deletes records with filtering.
 */
export const deleteRecordsQuery = <T extends QueryResultRow>(
    table: string,
    options: DeleteOptions
) => {
    if (!options.where || options.where.length === 0) {
        throw new ValidationError(
            "DELETE queries must have a WHERE condition."
        );
    }

    const params: any[] = [];
    const whereClauses: string[] = [];

    // Securely build WHERE clause
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

    let query = `DELETE FROM "${table}" WHERE ${whereClauses.join(" AND ")}`;

    if (options.returning && options.returning.length > 0) {
        query += ` RETURNING ${options.returning.map((col) => `${col}`).join(", ")}`;
    }

    return { text: query, params };
};

/*
Example Usage

const query = deleteRecords("users", {
    where: [
        { column: "status", operator: "=", value: "inactive" },
        { column: "role", operator: "IN", value: ["guest", "banned"] },
    ],
    returning: ["id", "name"],
});

console.log(query.text);  // Generated SQL
console.log(query.params); // Parameterized values
*/
