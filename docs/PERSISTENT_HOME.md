# Illustrated guest home and saved progression

15 October 2026. The new home is the default entry to Chog Hideout at /home.html; the root redirects there. The original lab is preserved at /lab.html, the heist at /play.html, and the renderer experiment at /renderer-lab.html.

## What works

- A coherent illustrated workshop with the same warm Rooftop Mischief direction, a round city window, central lantern hook and two trophy pegs.
- The actual animated mascot is composited into the room; it is still the generic game mascot, not an NFT-specific avatar.
- The Pocket Sun appears on its hook after any valid heist completion. A clean-run medal and an all-eight-sparks medal appear when earned.
- Tapping a hook or a keepsake row explains its story or its requirement in a dialog.
- A local hideout name survives reloads and is rendered as text. Name length is bounded and whitespace is normalised.
- Clean-heist time, escape time and the best completed spark count are shown independently.
- Heist success exposes a primary Go home action. Replay, practice and whole-heist retry remain available.
- Older completed saves retain their Sun and valid clean record. Old spark totals were never saved, so the migration starts that field at zero and does not invent an achievement.
- Corrupt/blocked browser storage and missing artwork do not block mission entry. Failed rename persistence is reported to the player.

## Data and boundaries

The home name uses chog-home:v1. Mission progression retains chog-heist:borrowed-sunshine-v1 with a backward-compatible bestSparks field. Completion remains recorded at extraction, before the result animation delay. Keepsakes are derived from those records; visiting the home does not grant them.

This is a browser-local guest home. It does not establish NFT ownership, authenticate a wallet, synchronize between devices, create shared rooms, mint trophies, or authorize another user's edits. There is no decorative wallet button implying otherwise.

## Ownership preparation

The current hackathon page says Chog NFTs must be essential to the experience: https://chogathon.chog.xyz/ . Its page was retrieved through search in this pass, while direct opens were intermittent.

OpenSea lists Chog Genesis by ChogLabs on Monad: https://opensea.io/collection/chog-genesis . A listed ERC-721 item resolves to https://opensea.io/item/monad/0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763/1090 . This provides a collection-contract candidate, not a completed ownership integration. Note that the displayed name CHOG #582 and actual token ID 1090 differ: token identity must use the onchain ID, not a parsed display name.

The official Monad developer listing reports mainnet chain ID 143 and RPC rpc.monad.xyz: https://monad.xyz/developers . These are preparation facts, not evidence that an RPC ownership check was performed here. Direct explorer access could not be completed.

Before enabling owner edits: confirm the supported collection/chain, perform real ERC-721 interface/ownerOf/tokenURI reads, obtain one usable owner-controlled token for the end-to-end demo, and implement server-side signed-nonce authentication plus a fresh current-owner check on each protected write. Keep token address 0x350035555E10d9AfAF1566AaebfCeD5BA6C27777 separate: the official Chog home labels it the $CHOG token contract, not the NFT collection.

The next owner action should control a persistent token-linked hideout and bounded challenge version. A local name change is not proof of that authority.

## Artwork

Runtime asset: dist/assets/burrows-home-v1.jpg, 900 by 1200, about 291 KB. Generated with the built-in OpenAI image-generation tool, inspected and compressed for delivery. Existing Chog, Sun and spark assets remain separate overlays. The home-only image is not added to the heist's image loader, so opening the game does not require this download.

Full generation prompt:

Use case: stylized-concept. Asset type: illustrated background for a polished 2D storybook game's home hub. A cosy rooftop workshop loft in a whimsical terracotta city, portrait 3:4 composition. Rich hand-painted game art, warm honey afternoon light, chunky timber beams, cream plaster, copper kettle inventions, trailing green plants, violet fabric accents, lilac distant towers through a large round window in the upper-middle. Main central subject: a beautiful small timber mantel shelf centered at about 52% of image width and 65% image height, with one clearly EMPTY lantern hook above it and two small empty trophy pegs beside it. There is NO lantern and no sun object on the shelf; those will be interactive game sprites added later. Keep the central shelf and its empty hook clearly legible. An arched wooden door is along the left side, a workbench and potted flowers on the right. The bottom 15% shows a clear wooden floor with room for a small character sprite added later. Paint the room as one coherent architectural place, not a collage of props. Composition puts key shelf and window within the central 65% so the illustration remains readable in a narrow viewport. Warm, lived-in, beautiful material texture and depth matching an illustrated platform adventure; confident dark plum contours, gold bevels, no photorealism, no isometric view. No character, no UI, no numbers, no letters, no text, no hearts, no coins, no screens, no watermark. Bright and welcoming natural light, with an empty hook that makes the absence of a beloved lantern noticeable.

## Verification

Automated checks exercise real mission completion into persisted home data, previous-save migration, all-sparks recognition, failed-run rejection, rename/reload, blocked saves, corrupt data, dialogs, storage-event refresh and local route/link resolution. The existing simulation, input, camera and renderer-fallback checks remain.

The production home renderer was visually inspected at phone scale in empty, Sun-restored and fully decorated states. DOM mocks do not validate CSS layout or touch feel; no real browser/device test was available in this environment. Ownership verification and multi-user challenge permissions remain unimplemented.

