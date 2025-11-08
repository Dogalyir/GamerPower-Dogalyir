import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { DB_FILE } from "../config";

const sqlite = new Database(DB_FILE);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "src/db/migrations" });
