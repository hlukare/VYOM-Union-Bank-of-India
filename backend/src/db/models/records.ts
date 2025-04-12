import { QueryResultRow } from "pg";
import { query } from "../../config/db";
import {
    findRecordsQuery,
    createRecordsQuery,
    updateRecordsQuery,
    deleteRecordsQuery,
} from "../query-builder/index";
import { tables } from "../tables";

import {
    FindOptions,
    UpdateOptions,
    DeleteOptions,
} from "../../types/dbServices.type";

async function getRecords<T extends QueryResultRow>(
    table: string,
    filter: FindOptions,
    returning: string[] = ["*"]
): Promise<Partial<T[]>> {
    try {
        const { text, params } = findRecordsQuery<T>(table, returning, filter);
        return await query<T>(text, params);
    } catch (error) {
        throw error;
    }
}

async function createRecord<T extends QueryResultRow>(table: string, data: T) {
    try {
        const { text, params } = createRecordsQuery<T>(table, data);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}

async function updateRecord<T extends QueryResultRow>(
    table: string,
    data: Partial<T>,
    options: UpdateOptions
) {
    try {
        const { text, params } = updateRecordsQuery<T>(table, data, options);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}

async function deleteRecord<T extends QueryResultRow>(options: DeleteOptions) {
    try {
        const { text, params } = deleteRecordsQuery<T>(tables.users, options);
        return await query(text, params);
    } catch (error) {
        throw error;
    }
}
export { getRecords, createRecord, updateRecord, deleteRecord };
