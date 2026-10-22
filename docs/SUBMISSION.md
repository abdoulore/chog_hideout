# Chog Hideout — submission

## One-line pitch

A pixel-art rooftop heist where Chog NFT holders lead guilds and players compete through server-verified escapes.

## Project description

Chog Hideout brings the Chog community into a playable world of rooftop heists. Players jump, double jump and dash across three connected missions, recover the Pocket Sun, manage power cells and choose how much optional treasure to risk carrying home. Touch gestures make the campaign accessible on mobile, while keyboard controls support desktop play.

Chog Genesis NFTs on Monad give holders a concrete leadership role. A verified holder can found a guild, invite players, host timed events and enter a fixed squad. Ordinary members join with a player account and compete without a wallet connection. Guild identity and membership persist when a new NFT owner claims leadership.

Competition results come from gameplay. The server issues attempts, replays submitted inputs and calculates haul and time. Complete squads rank on shared standings, and winning guilds receive saved in-game trophies. The result is a game players can enjoy individually and a community activity holders can organize around their Chog.

## Repository to submit

https://github.com/abdoulore/chog_hideout/tree/pixel-renderer

The `pixel-renderer` branch contains the submission build, all three missions, the live guild service and server-verified competitions.

## Review path

1. Follow the README's local setup and start at `/home.html`.
2. Play the Sun Vault, then continue through the East Annex and the Lantern Run.
3. Explore `/guild.html` and `/compete.html` in the hosted application for account-backed guilds and events.
4. Run `npm test` to exercise the gameplay and multi-user guild/competition flows locally.

Hosted application: https://chog-playtest-lab.fondbuddy6.chatgpt.site/home.html — access follows the hosting account's sharing settings. The local campaign provides the direct repository-based gameplay route.

## Monad integration

- Network: Monad mainnet, chain ID `143`.
- Collection: Chog Genesis, `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763`.
- Holder verification: server-issued message challenge, signature verification and a current `ownerOf` read.
- NFT utility: guild founding and leadership, invitations, event hosting and squad selection.
- Player participation: account-based membership; wallet verification is reserved for holder management.
- Rewards: saved in-game guild trophies.

## Technology

JavaScript and Canvas gameplay, pixel assets, Vinext/React Worker application, viem ownership verification, D1 persistence, Drizzle migrations and Node automated tests.

## Validation

The submission build passed 190 automated tests and a production build. Coverage includes all three mission routes, touch/keyboard controller behavior, NFT ownership changes, wallet-free members, fixed squads, replay-derived scores, shared standings and tied trophy awards.

## Demo

Use the [demo walkthrough](DEMO.md) for a concise presentation of the campaign, NFT utility and competition flow.
