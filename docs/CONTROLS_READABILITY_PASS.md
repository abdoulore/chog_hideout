# Controls and danger readability: first pass

## Changes

- A right-thumb contact no longer becomes permanently inactive after 320 ms.
  A late movement sample re-anchors the stroke; subsequent deliberate movement
  can jump, dash or drop without a forced finger lift. A slow drift or a single
  late sample cannot fire an action. Direction locks after the first action.
- Off-screen guard arrows use the camera projection instead of a fixed
  240-world-unit distance. The arrow appears at the appropriate screen edge
  and disappears during pause, map view and completed runs.
- Capture stores whether contact followed a platform drop, occurred in the air
  or happened at street level. The result screen gives relevant recovery advice.
  A brief contact outline shows the player and caretaker positions before results.
- The alarm-shutter label sits beside the playable roof at y260 instead of y96.
  Projection checks cover portrait and landscape HUD/control clearance.

## Verification

128 automated tests pass, including resting-thumb strokes, cancellation,
camera-relative guard cues, capture results and full escape routes. Existing
jump, dash, drop, persistence and guild regressions remain passing.
No browser visual or physical-phone QA was available. Input simulation and
projection checks do not establish touch comfort or perceived fairness.

## Next phone check

In the Sunloop, hold the left thumb to move, rest the right thumb, then swipe up.
Repeat with a second jump, a sideways dash, and a downward platform drop. Check
whether the gesture fires when intended and whether a guard approaching behind
is signalled. Try portrait and landscape. Report a missed input or an unclear
capture before increasing level complexity. This pass does not mark controls
as finally locked or promote the experiment into the default game.
