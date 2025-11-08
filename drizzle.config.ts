import { defineConfig } from "drizzle-kit";
import { DB_FILE } from "./src/config";

export default defineConfig({
  out: "src/db/migrations",
  schema: "src/db/db-schemas.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DB_FILE,
  },
});
