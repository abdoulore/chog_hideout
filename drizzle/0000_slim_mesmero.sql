CREATE TABLE `guild_challenges` (
	`user_id` text PRIMARY KEY NOT NULL,
	`nonce` text NOT NULL,
	`address` text NOT NULL,
	`message` text NOT NULL,
	`expires` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guild_challenges_nonce_unique` ON `guild_challenges` (`nonce`);--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` text PRIMARY KEY NOT NULL,
	`token_id` text NOT NULL,
	`name` text NOT NULL,
	`name_key` text NOT NULL,
	`motto` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_token_id_unique` ON `guilds` (`token_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_name_key_unique` ON `guilds` (`name_key`);--> statement-breakpoint
CREATE TABLE `guild_invites` (
	`hash` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`issuer` text NOT NULL,
	`expires` integer NOT NULL,
	`revoked` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guild_invites_guild_id_unique` ON `guild_invites` (`guild_id`);--> statement-breakpoint
CREATE TABLE `guild_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `guild_members` (
	`user_id` text PRIMARY KEY NOT NULL,
	`guild_id` text NOT NULL,
	`alias` text NOT NULL,
	`joined_at` integer NOT NULL,
	FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `guild_members_guild_idx` ON `guild_members` (`guild_id`);--> statement-breakpoint
CREATE TABLE `guild_wallets` (
	`user_id` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`proof_expires` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guild_wallets_address_unique` ON `guild_wallets` (`address`);