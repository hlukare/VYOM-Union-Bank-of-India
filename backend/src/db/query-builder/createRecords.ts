import { QueryResultRow } from "pg";
import { QueryOptions } from "../../types/dbServices.type";
import { ValidationError } from "../../utils/errors";

export const createRecordsQuery = <T extends QueryResultRow>(
    table: string,
    data: Partial<T> | Partial<T>[],
    options: QueryOptions = { returning: ["*"] }
) => {
    const isArray = Array.isArray(data);
    const records = isArray ? data : [data];

    if (records.length === 0) {
        throw new ValidationError("No data provided for insertion.");
    }

    const keys = Object.keys(records[0]);
    const values = records.map((record) => keys.map((key) => record[key]));

    const placeholders = values
        .map(
            (row, rowIndex) =>
                `(${row.map((_, colIndex) => `$${rowIndex * keys.length + colIndex + 1}`).join(", ")})`
        )
        .join(", ");

    const query = `
        INSERT INTO "${table}" (${keys.map((k) => `"${k}"`).join(", ")})
        VALUES ${placeholders}
        RETURNING ${options?.returning?.map((col) => `${col}`).join(", ")}
    `;

    return { text: query, params: values.flat() };
};

/*
Example Usage

const query = createRecord("users", [
    { name: "Alice", email: "alice@example.com", age: 25 },
    { name: "Bob", email: "bob@example.com", age: 30 },
]);

console.log(query.text);  // Generated SQL
console.log(query.params); // Parameterized values
*/
