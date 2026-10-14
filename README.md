# Chog Hideout

A browser-playable platforming prototype for a colourful Chog adventure. Jump rooftop traps, dash across gaps, escape short raids, and experiment with a small hideout editor.

The chosen production art direction is **Rooftop Mischief**. Its illustrated world and story are documented alongside the working gameplay experiment.

![Rooftop Mischief visual target](docs/art-direction/rooftop-mischief.jpg)

*Concept art target. The current playable prototype uses simple placeholder graphics.*

## Run locally

Requires Node.js 20 or newer. No dependencies or installation step are needed.

```bash
npm run dev
```

Open **http://localhost:8080**. Alternatively, serve `dist/` with a static HTTP server. The files in `dist/` are the editable, buildless application source.

```bash
npm test
```

## Movement slice

Open **http://localhost:8080/movement.html** for a focused raid with a purple mascot reference, calibrated camera framing, touch controls, pause/retry, and a Canvas/Phaser renderer comparison. Phaser 3.90.0 is loaded on demand from jsDelivr; the Canvas baseline stays available if that download fails. Both renderers share the same physics. This is a bounded framework experiment, not a full migration or finished NFT character.

## Play

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Left/right arrows or A/D | Direction buttons |
| Jump | Space, W, or up arrow | Jump button |
| Dash | Shift or X | Dash button |
| Retry | R | Restart button |

Jump before a gap, then dash in the air. Dash adds distance, not invulnerability. Coins are optional; reach the exit flag to finish. The editor lets you place up to five traps in a short room and save the layout after completing it.

An earlier **Dojo** experiment remains available in the comparison tab. It uses deterministic fights and editable behaviour rules; Hideout is the current gameplay direction.

## What exists

- Three scrolling raids, jump buffering, coyote time, and dash cooldown.
- Keyboard and touch-input handlers.
- Local trap editor with completion-gated saving.
- Replays of the player's own attempts.
- Browser-local personal bests and copyable feedback.
- World and art bible, supporting cast, opening story arc, and approved visual reference.
- Automated checks covering simulation, timing sweeps, camera framing, and DOM-mock interaction flows.

## What is planned

- Finished character animation and layered Rooftop Mischief environments.
- The opening chapter, **The Missing Light**.
- Sound, ambience, story payoff, and polished in-game UI.
- Verified Chog ownership, owner-controlled shared hideouts, and limited guest permissions.

NFT integration, shared rooms, wallet connections, and the illustrated production art are **not implemented**. Current saves and statistics belong to the browser. Dojo has a cautious strategy that beats all sample opponents and is not evidence of lasting strategic depth.

## Known playtest issue

The unfair crossings have been shortened and given at least 200 world units of clear landing space before the next spike. Dash holds height briefly. Timing sweeps cover a range of jump positions and dash delays. These checks establish broader mechanical tolerance, not enjoyable touch feel: real-browser and device validation are still required.

## Project files

| Path | Purpose |
| --- | --- |
| `dist/engine.mjs` | Movement, collision, room data, and Dojo combat rules |
| `dist/app.mjs` | Rendering, controls, menus, editor, replay, and local progress |
| `dist/index.html` / `dist/style.css` | Playtest interface |
| `tests/` | Automated checks |
| `dist/movement.html` / `dist/movement.mjs` | Focused movement and renderer comparison |
| `dist/art.mjs` | Code-drawn mascot reference |
| `docs/MOVEMENT_SLICE.md` | Tuning changes, verification, and remaining validation |
| `docs/WORLD_AND_ART_BIBLE.md` | Proposed universe, art rules, and production plan |
| `docs/art-direction/rooftop-mischief.jpg` | Selected concept image |
| `scripts/serve.mjs` | Dependency-free local development server |

## Lore and artwork

The new story, characters, and locations are proposed game lore, not official Chog canon. The visual concept uses Chog as a character reference. No licence to the underlying Chog brand or collection artwork is granted by this repository.

Official project: https://www.chog.xyz/ · Hackathon: https://chogathon.chog.xyz/
