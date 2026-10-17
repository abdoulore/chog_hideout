import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const wallets=sqliteTable('guild_wallets',{
 userId:text('user_id').primaryKey(),address:text('address').notNull().unique(),proofExpires:integer('proof_expires').notNull(),createdAt:integer('created_at').notNull()
});
export const challenges=sqliteTable('guild_challenges',{
 userId:text('user_id').primaryKey(),nonce:text('nonce').notNull().unique(),address:text('address').notNull(),message:text('message').notNull(),expires:integer('expires').notNull(),used:integer('used').notNull().default(0)
});
export const guilds=sqliteTable('guilds',{
 id:text('id').primaryKey(),tokenId:text('token_id').notNull().unique(),name:text('name').notNull(),nameKey:text('name_key').notNull().unique(),motto:text('motto').notNull(),createdBy:text('created_by').notNull(),createdAt:integer('created_at').notNull()
});
export const members=sqliteTable('guild_members',{
 userId:text('user_id').primaryKey(),guildId:text('guild_id').notNull().references(()=>guilds.id),alias:text('alias').notNull(),joinedAt:integer('joined_at').notNull()
},t=>[index('guild_members_guild_idx').on(t.guildId)]);
export const invites=sqliteTable('guild_invites',{
 hash:text('hash').primaryKey(),guildId:text('guild_id').notNull().unique().references(()=>guilds.id),issuer:text('issuer').notNull(),expires:integer('expires').notNull(),revoked:integer('revoked').notNull().default(0)
});
export const limits=sqliteTable('guild_rate_limits',{
 key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()
});
