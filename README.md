# Chog Hideout

A browser-playable platforming prototype for a colourful Chog adventure. Jump rooftop traps, dash across gaps, escape short raids, and experiment with a small hideout editor.

The chosen production art direction is **Rooftop Mischief**. Its illustrated world and story are documented alongside the working gameplay experiment.

![Rooftop Mischief visual target](docs/art-direction/rooftop-mischief.png)

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
- Seven automated checks covering simulation and DOM-mock interaction flows.

## What is planned

- Finished character animation and layered Rooftop Mischief environments.
- The opening chapter, **The Missing Light**.
- Sound, ambience, story payoff, and polished in-game UI.
- Verified Chog ownership, owner-controlled shared hideouts, and limited guest permissions.

NFT integration, shared rooms, wallet connections, and the illustrated production art are **not implemented**. Current saves and statistics belong to the browser. Dojo has a cautious strategy that beats all sample opponents and is not evidence of lasting strategic depth.

## Known playtest issue

A wide gap followed closely by spikes is too unforgiving on touch controls. The next movement pass should improve landing space and validate a range of timings. Scripted completions prove possibility, not enjoyable difficulty. Real-browser layout and touch feel still need hands-on validation; DOM mocks are not browser tests.

## Project files

| Path | Purpose |
| --- | --- |
| `dist/engine.mjs` | Movement, collision, room data, and Dojo combat rules |
| `dist/app.mjs` | Rendering, controls, menus, editor, replay, and local progress |
| `dist/index.html` / `dist/style.css` | Playtest interface |
| `tests/` | Automated checks |
| `docs/WORLD_AND_ART_BIBLE.md` | Proposed universe, art rules, and production plan |
| `docs/art-direction/rooftop-mischief.png` | Selected concept image |
| `scripts/serve.mjs` | Dependency-free local development server |

## Lore and artwork

The new story, characters, and locations are proposed game lore, not official Chog canon. The visual concept uses Chog as a character reference. No licence to the underlying Chog brand or collection artwork is granted by this repository.

Official project: https://www.chog.xyz/ · Hackathon: https://chogathon.chog.xyz/
