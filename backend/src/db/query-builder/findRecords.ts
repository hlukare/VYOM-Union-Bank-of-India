import {
    FindOptions,
    GroupedWhereCondition,
    WhereCondition,
} from "../../types/dbServices.type";

export const findRecordsQuery = <T extends Record<string, any>>(
    table: string,
    returning: (keyof T)[] = ["*" as keyof T],
    options: FindOptions = {}
) => {
    let query = `SELECT ${returning.map((col) => `${String(col)}`).join(", ")} FROM "${table}"`;
    const params: any[] = [];

    const processWhereClause = (
        conditions: (WhereCondition | GroupedWhereCondition)[],
        parentOperator: "AND" | "OR" = "AND"
    ) => {
        const whereClauses: string[] = [];

        conditions.forEach((condition) => {
            if ("type" in condition && condition.type === "group") {
                // Recursive case: Process grouped conditions
                const groupClause = processWhereClause(
                    condition.conditions,
                    condition.operator
                );
                whereClauses.push(`(${groupClause})`);
            } else {
                // Process individual conditions
                const { column, operator, value } = condition as WhereCondition;
                if (operator === "IN" && Array.isArray(value)) {
                    const placeholders = value
                        .map((_, i) => `$${params.length + i + 1}`)
                        .join(", ");
                    whereClauses.push(`"${column}" IN (${placeholders})`);
                    params.push(...value);
                } else {
                    whereClauses.push(
                        `"${column}" ${operator} $${params.length + 1}`
                    );
                    params.push(value);
                }
            }
        });

        return whereClauses.join(` ${parentOperator} `);
    };

    if (options.where && options.where.length > 0) {
        query += ` WHERE ${processWhereClause(options.where)}`;
    }

    // Handle ORDER BY clause
    if (options.orderBy) {
        const orderByClause = options.orderBy
            .map(({ column, direction }) => `"${column}" ${direction}`)
            .join(", ");
        query += ` ORDER BY ${orderByClause}`;
    }

    if (options.limit) {
        params.push(options.limit);
        query += ` LIMIT $${params.length}`;
    }

    if (options.offset) {
        params.push(options.offset);
        query += ` OFFSET $${params.length}`;
    }

    return { text: query, params };
};
