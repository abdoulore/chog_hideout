# Movement slice 03

## Purpose

Resolve the unfair landing reported during the phone playtest, establish a repeatable character/camera scale, and compare a small Phaser scene with the existing Canvas path before migrating the game.

## Play

Run `npm run dev`, then open `/play.html` for the illustrated run, or `/renderer-lab.html` for the framework comparison. Use the renderer selector to compare Canvas with the Phaser experiment. The baseline remains available if the framework download fails. Focus view reduces the surrounding interface without depending on browser fullscreen or orientation-lock support.

## Tuning

- Wide authored gaps reduced from 240 to 220 world units.
- At least 200 world units between each wide gap's far edge and the next spike.
- Dash lasts 0.18 seconds at 720 units/second, with a 1-second cooldown.
- Vertical integration briefly pauses during dash. It grants distance and time to read a landing, not hazard immunity.
- Jump buffering is 0.14 seconds; coyote time is 0.12 seconds.
- A shared camera helper keeps the crossing and initial safe landing visible before committing, on the tested camera widths.
- Room IDs changed so old best times are not compared with the revised movement rules.

## Character and art boundary

The technical renderer comparison retains its code-drawn mascot. The main `/play.html` route now uses a separate illustrated mascot sheet and layered city, rooftop, and prop assets. Neither character is a verified Genesis token. See `ART_IMPLEMENTATION.md` for the art pass and its limits.

## Phaser boundary

The experiment pins Phaser 3.90.0 and loads it from jsDelivr on demand. It uses Phaser scenes, sprite/canvas textures, graphics objects, scaling, and a camera. Canvas and Phaser share the authoritative fixed-step simulation and DOM controls. This isolates rendering and camera integration; it does not validate a migration to Arcade Physics or compare separate input systems. Renderer choice does not alter movement rules.

No full migration decision has been made. Real-browser WebGL/Canvas compatibility, framework lifecycle, download behaviour, performance, and touch feel need device validation.

## Verification

- All authored raids, including the focused slice, complete under a deterministic movement controller.
- Six wide crossings accept all 35 sampled combinations of jump position and dash delay: 210 successful crossing trials.
- Jump starts sampled 20–80 world units before the edge; dash delays sampled at 0.06–0.42 seconds after takeoff.
- Camera checks cover 360, 600, and 900-pixel display-width inputs.
- Additional checks cover cooldown, restart state, hazard damage during dash, single-award collectibles, editor gating, pause/retry, and framework-load failure fallback.
- DOM mocks exercise interface logic; they do not render a browser or prove touch responsiveness.

The sampling demonstrates a wider mechanical tolerance than the original narrow trajectory. It is not a measured completion rate or a claim that all possible timings are safe.

## Next device check

1. Play Canvas in portrait and landscape. Try early and later dashes deliberately.
2. Check simultaneous movement/jump/dash, readable landing space, and restart speed.
3. Switch to Phaser, repeat the same route, and note camera/scale differences or rendering failures.
4. Choose a renderer only after those observations. Compare against the illustrated `/play.html` route and review animation consistency and foreground readability.
