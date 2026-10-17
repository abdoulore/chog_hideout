# Chog Hideout

A browser-playable Chog rooftop heist. In **One More Thing**, choose what to steal, distract a caretaker, and decide when to bank your haul. Theft changes the available routes. The earlier Borrowed Sunshine mission and movement/editor experiments remain playable.

The chosen production art direction is **Rooftop Mischief**. Its illustrated world and story are documented alongside the working gameplay experiment.

![Rooftop Mischief visual target](docs/art-direction/rooftop-mischief.jpg)

*Concept art target. The focused game now uses illustrated city, rooftop, prop, and character assets inspired by this direction.*

## Run locally

Requires Node.js 20 or newer. No dependencies or installation step are needed.

```bash
npm run dev
```

Open **http://localhost:8080** for your illustrated guest hideout. The home remembers the recovered Pocket Sun, earned keepsakes, hideout name and personal records on this browser. The original lab is preserved at `/lab.html`. Alternatively, serve `dist/` with a static HTTP server. The files in `dist/` are the editable, buildless application source.

```bash
npm test
```

## One More Thing — current gameplay prototype

Open **http://localhost:8080/mischief.html**, or enter from the illustrated home. Any one treasure counts as an escape. Hold the action near the home door to bank what you carry, or turn back for more. Getting caught loses only the current, unbanked haul.

- **Lift battery (1):** opens the street shutter, disables the moving lift. Return it to its socket to reverse that tradeoff.
- **Pocket Sun (3):** rings the depot bell when taken.
- **Music box (2):** keeps sounding while carried. Drop it as a recoverable decoy.
- **Flowerpot:** knock it from the canopy to draw the caretaker away.
- **Caretaker:** patrols, investigates noises, fills a visible suspicion bar, then chases. A marked planter and shutter block sight; breaking sight lets pursuit expire. The caretaker warns before pursuit and heads toward a visible jumper’s predicted landing. Breaking sight then dropping the music box can lure him away. He stays on the street; the canopy is the safer route.

Touch defaults to a gesture trial: drag the lower left to move; swipe up on the right to jump; swipe horizontally on the right to dash. Stop beside a glowing object and tap it to interact. Tap an item in the carried-loot row to drop that specific item. The pause menu contains the map, sound toggle, and a saved Buttons/Gestures option. Buttons retain the contextual hold action. Keyboard: arrows/A D, Space, X/Shift, hold E, Q to drop, M for a paused map, Escape to pause. The prototype has no hard countdown. Highest banked haul is the primary record; time breaks ties for the same haul. Records and recovered treasures save on this browser. No wallet is needed.

See [implementation and test limits](docs/ONE_MORE_THING.md). Automated routes establish feasibility, not whether players find the game fun.

## Borrowed Sunshine — original heist

Open **http://localhost:8080/play.html** for the illustrated heist. The bridge retracts and a shutter closes after pickup; return home via the upper maintenance route and a leftward dash crossing. It has a layered city, textured rooftops, eight character poses, touch controls, and pause/retry. Movement now has interpolated presentation, landing dust, dash trails, sparkle bursts, and original synthesized sound cues. Sound starts after pressing Play and can be muted with the music-note button; the preference is saved on this browser. `/movement.html` redirects here. The technical Canvas/Phaser comparison is preserved at `/renderer-lab.html`; both use the same movement simulation.

See [scene depth and background hierarchy](docs/SCENE_DEPTH.md) and [art implementation notes](docs/ART_IMPLEMENTATION.md) for asset briefs, provenance, and validation limits.

## Play

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Left/right arrows or A/D | Direction buttons |
| Jump | Space, W, or up arrow | Jump button |
| Dash | Shift or X | Dash button |
| Retry | R | Restart button |

Jump before a gap, then dash in the air. Dash adds distance, not invulnerability. Sparks are optional. Recover the Pocket Sun from its plinth, turn left, and bring it home to finish. The vault checkpoint supports practice retries after pickup; clean-heist and escape records are separate and browser-local. R restarts the whole heist. The original lab still uses an exit flag. The editor lets you place up to five traps in a short room and save the layout after completing it.

An earlier **Dojo** experiment remains available in the comparison tab. It uses deterministic fights and editable behaviour rules; Hideout is the current gameplay direction.

## What exists

- A persistent illustrated guest home, renamed locally, with recovered treasures, latest haul, personal records and earned keepsakes.
- A connected rooftop block with reactive security, optional thefts, a power tradeoff, recoverable noise decoys and voluntary banking.
- A complete two-phase heist with a retracted bridge, closed shutter, roof bypass, Sun carry cue, and home restoration.
- A vault checkpoint, clean-heist/practice records, and direction-aware camera.
- Portrait framing with a larger Chog, compact active HUD, and supported timber platforms.
- Three original scrolling raids, jump buffering, coyote time, and dash cooldown.
- Keyboard and touch-input handlers.
- High-contrast illustrated traps with static warning markers, plus illustrated bridge, shutter and Pocket Sun assets.
- Local trap editor with completion-gated saving.
- Replays of the player's own attempts.
- Browser-local personal bests and copyable feedback.
- World and art bible, supporting cast, opening story arc, and approved visual reference.
- Automated checks covering simulation, timing sweeps, camera framing, and DOM-mock interaction flows.

## What is planned

- Further animation cleanup, richer foreground structure, and consistent chapter art.
- More missions in **The Missing Light** after external playtests validate the first heist.
- Ambient soundscape, story payoff, and further in-game polish.
- Verified Chog ownership, owner-controlled shared hideouts, and limited guest permissions.

NFT integration, shared rooms, and wallet connections are **not implemented**. The new illustrated assets are a playable art pass, not a finished production animation pipeline. Current saves and statistics belong to the browser. Dojo has a cautious strategy that beats all sample opponents and is not evidence of lasting strategic depth.

## Known playtest issue

The unfair crossings have been shortened and given at least 200 world units of clear landing space before the next spike. Dash holds height briefly. Timing sweeps cover a range of jump positions and dash delays. These checks establish broader mechanical tolerance, not enjoyable touch feel: real-browser and device validation are still required.

## Project files

| Path | Purpose |
| --- | --- |
| `dist/engine.mjs` | Movement, collision, room data, and Dojo combat rules |
| `dist/app.mjs` | Rendering, controls, menus, editor, replay, and local progress |
| `dist/index.html` | Redirect to the illustrated home |
| `dist/home.html` / `dist/home.mjs` / `dist/home.css` | Illustrated guest home |
| `dist/home-model.mjs` / `dist/home-scene.mjs` | Saved home state and scene composition |
| `dist/lab.html` / `dist/style.css` | Original playtest interface |
| `tests/` | Automated checks |
| `dist/mischief.html` / `dist/mischief-play.mjs` / `dist/mischief.css` | Current rooftop heist UI and controls |
| `dist/mischief.mjs` / `dist/mischief-records.mjs` / `dist/mischief-visuals.mjs` | Reactive job, local banking, caretaker and object presentation |
| `dist/play.html` / `dist/play.mjs` / `dist/play.css` | Illustrated full-screen game |
| `dist/world-renderer.mjs` / `dist/assets/` | Layered scene and optimized raster assets |
| `dist/heist.mjs` / `dist/heist-records.mjs` | Two-phase mission, checkpoint and versioned local records |
| `dist/heist-visuals.mjs` | Mechanism states, Sun and home restoration |
| `docs/HEIST_SLICE.md` | Implemented mission, validation and limits |
| `dist/renderer-lab.html` / `dist/renderer-lab.mjs` | Technical renderer comparison |
| `dist/art.mjs` | Code-drawn mascot reference |
| `docs/MOVEMENT_SLICE.md` | Tuning changes, verification, and remaining validation |
| `docs/WORLD_AND_ART_BIBLE.md` | Proposed universe, art rules, and production plan |
| `docs/art-direction/rooftop-mischief.jpg` | Selected concept image |
| `scripts/serve.mjs` | Dependency-free local development server |

See `docs/PERSISTENT_HOME.md` for saved-state behaviour, migration, artwork provenance and ownership preparation. This guest home is browser-local; NFT ownership and shared homes are not yet connected.

## Lore and artwork

The new story, characters, and locations are proposed game lore, not official Chog canon. The visual concept uses Chog as a character reference. No licence to the underlying Chog brand or collection artwork is granted by this repository.

Official project: https://www.chog.xyz/ · Hackathon: https://chogathon.chog.xyz/

### Movement and pursuit pass

One More Thing now uses quick acceleration, sharp braking, forgiving roof lips, animated turns/landings and visible treasure plucks. The caretaker telegraphs pursuit and leads visible jumps; a dropped music box can redirect him after sight is broken. Gesture controls are unchanged. The 65 automated checks include both complete treasure routes and new movement/pursuit cases. See [MOVEMENT_FEEL.md](docs/MOVEMENT_FEEL.md) for scope and verification limits.

### Painted district pass

The first playable district now has a painted home facade and matching treasure/machinery art, substantial timber platforms, connected power hardware, clearer battery consequences and a quieter HUD. See [DISTRICT_ART.md](docs/DISTRICT_ART.md) for asset provenance, generation prompts, sizes and validation limits.

## Guild tournament rehearsal

Open `/guild.html` for your guild headquarters (linked from the hideout), `/tournament.html` to compete, and `/event-manage.html` for local rehearsal controls. Two example guilds can run local qualifiers, lock three-player squads, compete with fresh final scores and close a rehearsal with a trophy. Play actual One More Thing runs or explicitly fill other seats with labelled example scores. Scoring prioritises banked treasure, then exact game ticks; all three squad members must finish. Ordinary solo play remains available.

This is browser-local and unverified: no wallet connection, NFT founding, real membership, shared server standings or funded prize exists yet. See [the rehearsal guide](docs/GUILD_REHEARSAL.md) for the full test flow and implementation boundaries.
