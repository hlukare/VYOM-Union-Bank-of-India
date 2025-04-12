import { Pool, QueryResultRow } from "pg";
import env from "./env";
const pool = new Pool({
    connectionString:
        env.NODE_ENV === "online_development" ? env.DB_URL_ONLINE : env.DB_URL,
    max: 20,
    ssl:
        env.NODE_ENV === "production" || env.NODE_ENV === "online_development"
            ? { rejectUnauthorized: false }
            : false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
});

// Perform a query on the database
const query = async <T extends QueryResultRow>(
    text: string,
    params: any = []
) => {
    try {
        const result = await pool.query<T>(text, params);
        return result.rows;
    } catch (error) {
        console.error("Database Query Error", error);
        throw error;
    }
};

// Perform a transaction on the database
const transaction = async <T extends QueryResultRow>(
    commands: { text: string; params: any[] }[]
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Start the transaction
        const results: T[][] = [];
        for (const command of commands) {
            const { text, params } = command;
            const result = await client.query<T>(text, params);
            results.push(result.rows);
        }
        await client.query("COMMIT"); // Commit the transaction
        return results;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction failed. Rolled back.", error);
        throw error;
    } finally {
        client.release();
    }
};
export { query, transaction };
