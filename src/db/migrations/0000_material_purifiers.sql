CREATE TABLE `cpu_brands` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cpu_models` (
	`id` integer PRIMARY KEY NOT NULL,
	`socket_id` integer,
	`name` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`socket_id`) REFERENCES `cpu_sockets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cpu_sockets` (
	`id` integer PRIMARY KEY NOT NULL,
	`brand_id` integer,
	`name` text NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `cpu_brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cpu_brands_value_unique` ON `cpu_brands` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `cpu_models_value_unique` ON `cpu_models` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `cpu_sockets_value_unique` ON `cpu_sockets` (`value`);