
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import path from "path";

console.log("Starting verification...");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const dbUrl = process.env.DATABASE_URL;
console.log("DB URL:", dbUrl);

if (!dbUrl) {
    console.error("No DATABASE_URL");
    process.exit(1);
}

const client = createClient({ url: dbUrl });

async function main() {
    try {
        console.log("Executing query...");
        const result = await client.execute("SELECT count(*) as count FROM lessons");
        console.log("Result:", result.rows);
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
