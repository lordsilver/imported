CREATE TABLE `product_listings` (
	`id` integer PRIMARY KEY NOT NULL,
	`supplier_id` integer,
	`cpu_model_id` integer,
	`price` real NOT NULL,
	`url` text NOT NULL,
	`last_updated` integer NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cpu_model_id`) REFERENCES `cpu_models`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suppliers_value_unique` ON `suppliers` (`value`);