import { index, int, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const GamerTable = sqliteTable("gamer_table", {
  id: int().primaryKey().unique(),
}, (t) => [
  index("gamer_index").on(t.id),
  unique("gamer_unique").on(t.id) 
]
);
