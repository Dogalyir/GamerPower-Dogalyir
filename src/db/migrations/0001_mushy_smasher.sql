CREATE TABLE `gamer_table` (
	`id` integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gamer_table_id_unique` ON `gamer_table` (`id`);--> statement-breakpoint
CREATE INDEX `gamer_index` ON `gamer_table` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `gamer_unique` ON `gamer_table` (`id`);--> statement-breakpoint
DROP TABLE `users_table`;