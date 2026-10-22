# Chog Hideout

**Steal the light. Lead your guild. Bring it home.**

Chog Hideout is a pixel-art rooftop heist game built for the Chog community on Monad. Jump between rooftops, dash through hazards, outwit a caretaker and recover the Pocket Sun across three connected missions. Chog NFT holders become guild masters, bringing players together for team competitions with server-verified scores.

**[Submission guide](docs/SUBMISSION.md) · [Demo walkthrough](docs/DEMO.md) · [NFT and guilds](docs/LIVE_GUILDS.md) · [Competition rules](docs/LIVE_COMPETITIONS.md)**

> Submission branch: **`pixel-renderer`**. Clone this branch to run the current game and guild system.

## Play first. Build your crew.

Start the solo campaign without a wallet. Learn the rooftops, discover optional routes and improve your escape. Join a guild with your player account when you want to compete with a crew. NFT ownership gives holders a leadership role: founding a guild, inviting members, hosting events and choosing the squad.

The NFT is the guild's foundation. When ownership changes, the new holder can claim leadership while the guild keeps its identity and members.

## Three missions, three heists

| Mission | Your objective | What makes it different |
| --- | --- | --- |
| **01 · The Sun Vault** | Carry a power cell to the vault, release two seals and recover the Sun. | Choose a street escape or restore the lift for a rooftop return. |
| **02 · The East Annex** | Cross the steam yard, release the yard and tower seals, and bring the Sun back. | A patrolling caretaker, planter cover and a flowerpot distraction reward timing and route choice. |
| **03 · The Lantern Run** | Carry the Sun forward, collect the exit cell and power the extraction door. | A forward-moving rooftop escape with an optional music-box detour. |

Campaign completion unlocks the next mission and saves progress in the browser. Optional treasure adds another reason to replay.

## Movement made for mobile

| Action | Touch | Keyboard |
| --- | --- | --- |
| Move | Drag the left control | A / D or left / right arrows |
| Jump / double jump | Swipe up on the right; swipe again in the air | Space; press again in the air |
| Dash | Swipe left or right on the right side | X or Shift |
| Drop through a platform | Swipe down | Down arrow |
| Use a nearby object | Stop beside it and tap the glowing object | Hold E |
| Drop a carried item | Tap its inventory icon | Q |
| Pause / map | Pause menu | Escape / M |

The pause menu also offers button controls. Jump buffering, coyote time, ledge assistance, camera look-ahead and animated feedback make movement responsive across the campaign.

## The NFT has a job

Chog Genesis ownership on **Monad** anchors each guild. A holder signs a wallet message; the server checks ownership of the selected on-chain token ID. Verification uses a signature rather than a payment or token approval.

- **Found a guild:** give a Chog-backed crew its name and identity.
- **Invite your community:** bring up to 50 players into the guild; members join through their player accounts.
- **Host an event:** select a mission, duration and one- or three-player squads.
- **Lead the team:** lock the roster and compete against other guilds.
- **Earn a guild trophy:** complete squads climb shared standings and receive a saved in-game award.

Guild-master actions check current NFT ownership. Members can play guild events without connecting a wallet.

## Competition that follows the gameplay

Each player has ten attempts per event. Successful runs submit a compact recording of their inputs. The server replays those inputs through the game simulation and calculates the result.

Every squad member must finish for the guild to rank. Each player's best haul counts, with time breaking ties. Guilds rank by combined haul and then combined time; exact ties share the trophy. Event rewards are saved in-game trophies.

## Run locally

Use **Node.js 22.13 or newer**.

```bash
git clone --branch pixel-renderer https://github.com/abdoulore/chog_hideout.git
cd chog_hideout
npm ci
npm run solo
```

Open **http://localhost:8080/home.html** and start the campaign. This command serves the game directly and is the quickest gameplay demo.

For the full application development server:

```bash
npm run dev
```

Use the URL printed in the terminal. The hosted guild service uses platform-authenticated player identity and a D1 database bound as `DB`. See [guild architecture and setup](docs/LIVE_GUILDS.md) for that environment. Solo gameplay and automated guild tests run locally.

```bash
npm test
npm run build
```

**190 automated tests passed for the submission build**, covering mission completion, real game controls, ownership checks, guild membership, squad entry, replay validation and trophy results.

## Architecture

| Layer | Implementation |
| --- | --- |
| Game | JavaScript, Canvas rendering, pixel assets and a deterministic 120 Hz simulation |
| Player experience | Responsive HTML/CSS, touch gestures, keyboard controls and browser campaign saves |
| Application | Vinext/React Worker with server API routes |
| Guild identity | Platform-authenticated accounts and signed holder verification using viem |
| Ownership | Chog Genesis ERC-721 on Monad, checked through `ownerOf` |
| Persistence | D1 with Drizzle schema and generated SQL migrations |
| Competition | Server-issued attempts, input replay verification, shared standings and saved trophies |
| Verification | Node test runner, SQLite-backed server fixtures and controller tests |

## Explore the code

| Path | What to find |
| --- | --- |
| `public/home.html` | Campaign home and mission progression |
| `public/mischief.mjs` | Mission rules, movement, guards, objects and extraction |
| `public/mischief-play.mjs` | Gameplay screen and controls |
| `public/pixel/` | Pixel-art assets |
| `public/guild.html` | Guild membership and holder verification |
| `public/compete.html` | Event hosting, squad entry and standings |
| `server/guild-api.mjs` | Authentication, ownership and guild operations |
| `server/competition.mjs` | Event lifecycle, attempts, scores and awards |
| `server/replay-verify.mjs` | Server simulation of submitted gameplay |
| `db/schema.ts` / `drizzle/` | Database schema and migrations |
| `tests/` | Gameplay, interface and server verification |

## Built for Chogathon

Chog Hideout turns NFT ownership into a community leadership role around an accessible game. Solo players have a campaign to enjoy; guilds have a reason to assemble, practice and compete.

Built by [abdoulore](https://github.com/abdoulore) for [Chogathon](https://chogathon.chog.xyz/).

Game story and locations are original Chog-inspired interpretations. Chog branding and collection artwork remain the property of their respective owners.
