import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schemas from "./db-schemas";
import { Database } from "bun:sqlite";
import { DB_FILE } from "../config";

const sqlite = new Database(DB_FILE);
export const db = drizzle(sqlite, { schema: schemas });
