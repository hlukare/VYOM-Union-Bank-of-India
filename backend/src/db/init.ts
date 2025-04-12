import { transaction } from "../config/db";
import fs from "fs";
import path from "path";

const runMigrations = async () => {
    const migrationDir = path.join(__dirname, "migrations");
    const orderFile = path.join(migrationDir, "migration_order.json");

    if (!fs.existsSync(orderFile)) {
        console.error("Migration order file not found!");
        process.exit(1);
    }

    const migrationOrder = JSON.parse(fs.readFileSync(orderFile, "utf-8"));
    const sql = [];
    for (const file of migrationOrder) {
        const filePath = path.join(migrationDir, file);
        if (!fs.existsSync(filePath)) {
            console.error(`Migration file ${file} not found!`);
            continue;
        }

        sql.push({ text: fs.readFileSync(filePath, "utf-8"), params: [] });
    }
    try {
        await transaction(sql);
    } catch (err) {
        console.error("Database Migration Error", err);
        process.exit(1); // Exit the script on failure
    }
};

export { runMigrations };
