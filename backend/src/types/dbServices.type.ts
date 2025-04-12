export interface QueryOptions {
    returning?: string[];
}

export interface WhereCondition {
    column: string;
    operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "LIKE" | "ILIKE" | "IN";
    value: any;
}

export interface GroupedWhereCondition {
    type: "group"; // To differentiate from normal conditions
    operator: "AND" | "OR"; // How conditions in this group are combined
    conditions: (WhereCondition | GroupedWhereCondition)[]; // Nested conditions
}

export interface FindOptions {
    where?: (WhereCondition | GroupedWhereCondition)[];
    orderBy?: { column: string; direction: "ASC" | "DESC" }[];
    limit?: number;
    offset?: number;
}

export interface UpdateOptions {
    where: WhereCondition[];
    returning?: string[];
}

export interface DeleteOptions {
    where: WhereCondition[];
    returning?: string[];
}
