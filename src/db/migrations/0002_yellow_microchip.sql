CREATE TABLE `nequi_table` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nequi_table_id_unique` ON `nequi_table` (`id`);--> statement-breakpoint
CREATE INDEX `nequi_index` ON `nequi_table` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `nequi_unique` ON `nequi_table` (`id`);