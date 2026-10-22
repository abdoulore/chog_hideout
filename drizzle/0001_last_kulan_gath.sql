CREATE TABLE `live_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`entry_id` text NOT NULL,
	`user_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL,
	`ticks` integer,
	`haul` integer,
	`replay` text
);
--> statement-breakpoint
CREATE INDEX `live_attempts_event_user_idx` ON `live_attempts` (`event_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `live_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`guild_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `live_entries_event_idx` ON `live_entries` (`event_id`);--> statement-breakpoint
CREATE TABLE `live_events` (
	`id` text PRIMARY KEY NOT NULL,
	`guild_id` text,
	`name` text NOT NULL,
	`mission` text NOT NULL,
	`squad_size` integer NOT NULL,
	`starts_at` integer NOT NULL,
	`ends_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`cancelled` integer DEFAULT 0 NOT NULL,
	`ruleset` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `live_players` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`entry_id` text NOT NULL,
	`user_id` text NOT NULL,
	`alias` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `live_players_event_idx` ON `live_players` (`event_id`);--> statement-breakpoint
CREATE TABLE `live_trophies` (
	`event_id` text PRIMARY KEY NOT NULL,
	`winners` text NOT NULL,
	`awarded_at` integer NOT NULL
);
