CREATE TABLE `contestants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`institute` text NOT NULL,
	`class` integer NOT NULL,
	`section` text NOT NULL,
	`roll` integer NOT NULL,
	`email` text NOT NULL,
	`mobile` text NOT NULL,
	`father_name` text NOT NULL,
	`mother_name` text NOT NULL,
	`category` text NOT NULL,
	`username` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "ck_contestants_class" CHECK(class BETWEEN 5 AND 10),
	CONSTRAINT "ck_contestants_roll" CHECK(roll > 0),
	CONSTRAINT "ck_contestants_mobile" CHECK(mobile LIKE '01%' AND LENGTH(mobile) = 11)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contestants_email_unique` ON `contestants` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `contestants_mobile_unique` ON `contestants` (`mobile`);--> statement-breakpoint
CREATE UNIQUE INDEX `contestants_username_unique` ON `contestants` (`username`);--> statement-breakpoint
CREATE INDEX `idx_contestants_email` ON `contestants` (`email`);--> statement-breakpoint
CREATE INDEX `idx_contestants_mobile` ON `contestants` (`mobile`);--> statement-breakpoint
CREATE INDEX `idx_contestants_username` ON `contestants` (`username`);--> statement-breakpoint
CREATE INDEX `idx_contestants_category` ON `contestants` (`category`);--> statement-breakpoint
CREATE INDEX `idx_contestants_created_at` ON `contestants` (`created_at`);--> statement-breakpoint
CREATE TABLE `device_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_fingerprint` text NOT NULL,
	`contestant_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`contestant_id`) REFERENCES `contestants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `device_registrations_device_fingerprint_unique` ON `device_registrations` (`device_fingerprint`);--> statement-breakpoint
CREATE INDEX `idx_device_registrations_fingerprint` ON `device_registrations` (`device_fingerprint`);--> statement-breakpoint
CREATE INDEX `idx_device_registrations_contestant_id` ON `device_registrations` (`contestant_id`);--> statement-breakpoint
CREATE TABLE `username_sequences` (
	`category` text PRIMARY KEY NOT NULL,
	`current_number` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "ck_username_sequences_current_number" CHECK(current_number >= 0 AND current_number <= 9999)
);
