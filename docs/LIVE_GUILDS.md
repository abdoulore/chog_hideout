# Live guild alpha

17 October 2026. This milestone adds persistent membership and NFT-backed guild-master authority. Live server competitions are now available at `/compete.html`; see LIVE_COMPETITIONS.md. No prize funding or payouts are implemented.

## Player experience

- Solo games and guest records require no wallet. Existing browser records are unchanged.
- A player signs in with the hosting platform's ChatGPT account to join a guild and retain membership on another device. No wallet is requested for joining or leaving.
- Only founding or claiming a guild, creating invitations and revoking invitations need a verified holder wallet. These controls live in an optional section, not the joining flow.
- The alpha supports injected EIP-1193 wallets with EIP-6963 discovery. On mobile, a holder opens the same Site in a wallet's browser and signs into the same player account. WalletConnect, external social login, hardware-wallet QA, contract-wallet and delegated verification support are not claimed.
- Each player account belongs to one guild at a time. Each Chog Genesis token anchors one persistent guild. Guild capacity is 50; this is a product limit, not a tournament squad size.
- Guild masters can generate a seven-day invitation. Creating another replaces the old invitation. Revocation removes access through the invitation without removing existing members.

## Ownership and message proof

Pinned chain: Monad mainnet, chain ID 143. Pinned ERC-721: `0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763` (Chog Genesis).

Sources checked on 17 October 2026:

- https://mint.chog.xyz/mint (Chog's mint site and its OpenSea collection link)
- https://opensea.io/collection/chog-genesis (creator ChogLabs, Monad collection)
- https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/701 (ERC-721 and on-chain token ID)
- https://docs.monad.xyz/ai/current-facts (chain ID and RPC)
- https://eips.ethereum.org/EIPS/eip-4361 (message format and verification constraints)
- https://eips.ethereum.org/EIPS/eip-6963 (wallet discovery)

A read-only RPC probe returned contract name `Chog Genesis` and successfully resolved `ownerOf(701)` at the finalized block tag. The display title CHOG #193 differs from this token's on-chain ID 701. The UI requests the on-chain token ID explicitly.

Server-generated five-minute challenges bind the exact message, nonce, authenticated user, wallet, host and chain. Proof consumes the nonce once and remembers the linked wallet for the player account. Management proof expires after 24 hours. A wallet can be linked to only one player account; changing it requires leaving the guild and explicitly unlinking it. Ending verification revokes management proof but retains membership.

The wallet signs a plain message. No transaction, payment, NFT transfer or token approval is requested. This alpha rejects accounts with deployed code, including delegated/contract accounts, rather than claiming contract-wallet session safety.

Founding, claiming, inviting, revoking and accepting an invitation check the founding NFT's current finalized owner through fixed public RPC endpoints. RPC failure denies the operation. When the NFT changes hands, the previous owner's management actions and invitations stop working. The new owner can claim the existing guild; its members and identity remain. Ownership checks are point-in-time reads, not atomic on-chain membership transactions. There is no custody or economic entitlement in this release.

## Hosting and storage

The application migrated from static `dist/` source to a Vinext Worker with existing games served from `public/`. Production output is generated in `dist/`; do not edit it. URLs and localStorage keys stay stable. The original guild rehearsal headquarters moved to `/rehearsal.html`; `/guild.html` now renders real guild membership. Tournament and event-management pages stay explicitly local rehearsal tools.

Hosting retains the existing project ID and private audience. D1 binding `DB` owns six tables, with schema-only generated migrations in `drizzle/`. Site-provided authenticated user IDs are the player identity. Email, full name and raw signature are not stored. Roster responses expose player aliases and roles, not platform IDs or members' full wallet addresses. Invitation tokens are stored as SHA-256 hashes; full invitation links are only shown when created. Link fragments prevent invitation tokens from being sent with ordinary page navigation.

API routes: `/api/guild/{state,challenge,verify,create,claim,invite,revoke,join,leave,disconnect,unlink,health}`. All product routes require hosting identity. Mutations require the pinned same origin, JSON, a bounded body and per-user rate limits. The health route reports service configuration only and remains behind the Site's access policy. API responses use `Cache-Control: no-store`.

The hosting policy currently permits only the owner account. **Another person's invitation cannot be tested live until access is explicitly expanded.** Making the Site public is a separate audience decision, not a side effect of building guilds. On a public Site, solo play can be anonymous; joining still uses ChatGPT sign-in. No user identity may be supplied by a public client or a self-written reverse proxy.

## Verification

The server tests use the generated SQL in a real SQLite database behind a D1-compatible adapter, with real locally generated message signatures and controlled chain ownership responses. They cover authenticated identity, CSRF, nonce expiry and replay, duplicate wallets, creation rollback, wallet-free membership across a service restart, ownership transfer, invitation rotation/revocation/expiry, simultaneous final-slot claims, outages and proof expiry. Frontend controller tests cover wallet-free joining, preserved invitation return paths, wallet cancellation, explicit leave confirmation and rejection of foreign invitation URLs.

A production build and live read-only chain probe are included. Unit tests do not replace a real holder signing in a mobile wallet or two actual users accepting a hosted invitation. Browser/phone visual QA is unavailable in this session. The host privacy setting also prevents claiming a completed two-person live test.

## Next gate

After host access is agreed, have a real Chog holder found a guild and a different signed-in account accept its invitation. Server tournaments, attempt issuance and validated replays are implemented. Complete a real holder and second-account end-to-end test before opening public competition. Keep funded prizes disabled until that verification path is reliable.
