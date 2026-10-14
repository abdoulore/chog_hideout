# Borrowed Sunshine — first playable heist

The main route `/play.html` now implements an entry → pickup → changed escape → home loop. This is an authored solo mission using the existing Rooftop Mischief artwork and movement rules. New mechanisms use first-pass code-drawn art aligned to the actual collision geometry.

## Mission

Your home's round window is dark. Cross the roofs and the extended pulley bridge, pass the open maintenance passage, and recover the Pocket Sun from the depot plinth. Grounded arrival in the marked plinth zone picks it up automatically. The objective turns left, the Sun is visibly carried, the bridge retracts, and a tall shutter closes the lower passage.

On return, jump onto the low maintenance ledge, then the upper ledge above the shutter. Continue left, jump/dash the missing bridge, and return to the home roof. The window lights and the Sun appears beside it. Reaching the far right alone does not finish the mission; home without the Sun cannot finish it either.

There is no countdown, enemy AI, resource loss, ownership integration, or public ranking in this slice. Sparks remain optional. Original lab raids and the renderer comparison retain their own modes.

## Geometry and readability

- World width: 2,850 units. Home extraction: grounded at x ≤ 140 while carrying the Sun.
- Bridge gap: x 880–1,100. An entry-only platform supports it; escape removes that platform.
- Shutter: x 1,730–1,790, y 300–460. Closed only in escape, with real top and side collision.
- Maintenance bypass: lower ledge y 380, upper ledge y 300. Both are visible on entry and usable in either phase.
- Pickup is grounded on the depot floor, with the character centre inside x 2,635–2,745. Geometry changes occur far from the avatar.
- Camera look-ahead blends toward the left after pickup. Vertical framing follows high jumps when needed on short landscape viewports.
- Pickup notice is placed in the lower control region, away from the central jump route. Persistent HUD objectives remain available after it fades.

## Recovery and records

Before pickup, failure retries from home. After pickup, the primary retry restores a safe vault checkpoint with the Sun and escape geometry. It resets position, facing, velocity, cooldown, input, visual feedback, camera interpolation, timer, and collected state to the checkpoint policy. “Restart whole heist” remains available.

A clean heist begins at home and completes both phases without a restore. Practice escape timing starts from the vault. Records are separated under `chog-heist:borrowed-sunshine-v1`, so old one-way results cannot compete with them. A practice completion earns the homecoming and can improve the escape record, but cannot set a clean-heist record.

Completion is saved immediately when extraction succeeds, before the presentation delay. Storage failure does not block play and is reported on the results screen. Browser-local records are editable client data, not verified competitive results.

## Implementation

- `heist.mjs`: phase-specific room data, objective triggers, extraction, checkpoint restore, progress, and objective text.
- `engine.mjs`: unchanged movement constants, optional solid wall/underside/top collision, and a mission-aware boundary that leaves one-way lab wins intact.
- `heist-records.mjs`: validated versioned local persistence and separate clean/escape records.
- `heist-visuals.mjs`: shared-geometry bridge, shutter, maintenance ledges, Pocket Sun, and home window states.
- `play.mjs`: turn-aware camera presentation, mission UI, checkpoint retry, immediate completion persistence, and integration with feedback/sound.

## Verification

The automated suite covers a continuous clean heist, both bypass ledges, objective trigger boundaries, bridge support/removal, shutter collision from both sides including dash, checkpoint isolation/reset, directional camera framing, records, damaged storage, and a full DOM-mock flow through completion and retry.

The leftward dash crossing succeeds for all 35 sampled combinations of five takeoff distances (20–80 units beyond the edge) and seven dash delays (0.06–0.42 seconds). Sixteen sampled combinations of lower/upper bypass takeoff positions complete the escape. Existing one-way raid sweeps remain in the suite. These checks establish sampled mechanical tolerance, not a human success rate.

A scripted controller completes one clean run in about 18.73 seconds. This is a feasibility probe, not a target player time or speedrun record. Do not add empty travel solely to meet the design document's provisional timing estimates.

The actual production renderer was inspected with native Canvas output in seven real mission states, including portrait, landscape, and a short landscape frame at the upper bypass. DOM mocks and native frames do not constitute browser/device testing. Audio latency, multi-touch comfort, browser layout, frame rate and the human playtest gate remain unverified.

## Next gate

Observe uncoached players: do they understand the turnaround, see the roof bypass, identify why they failed, and choose another attempt after completion? Revise those problems before adding another mission or shared hideout authoring. NFT integration still requires a real supported collection/token and server-enforced current-owner permissions; it is not implemented by this slice.
