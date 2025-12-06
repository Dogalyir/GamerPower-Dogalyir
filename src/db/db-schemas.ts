import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const GamerTable = sqliteTable("gamer_table", {
  id: int().primaryKey().unique(),
}, (t) => [
  index("gamer_index").on(t.id),
  unique("gamer_unique").on(t.id)
]);

export const NequiTable = sqliteTable("nequi_table", {
  id: text().primaryKey().unique(),
  status: text().notNull(),
}, (t) => [
  index("nequi_index").on(t.id),
  unique("nequi_unique").on(t.id)
]);
