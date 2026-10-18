# Sunloop depot level

Default experiment: `/mischief.html?route=loop`.
Compact reference: `/mischief.html?route=loop&layout=short`.
Both retain double jump, dash and platform drop. No wallet, score submission or
new control is introduced. The normal game is still unchanged.

## Authored sequence

1. Existing home, stepped roofs, flowerpot, caretaker and lift establish the
   approach and offer the existing distraction/route choices.
2. The depot wing extends the world from 1720 to 2660 units. A narrow high
   perch at x1660/y245 and a wider lower ledge at x1630/y385 offer distinct
   approaches. A missed high landing can recover on the lower ledge.
3. A central roof at x1900/y310 leads to the far prize roof at x2280/y310.
   Jump/dash crosses directly; the x2130/y385 ledge offers another foothold.
4. The Sun at x2400/y310 triggers the familiar alarm. The upper shutter now
   stands at x2220, so it closes behind the prize wing while preserving the
   street opening below. Its warning and overlap protection remain unchanged.
5. Escape left along the service walk. Two always-visible spike traps at slots
   35 and 39 use the existing warning signs and real collision footprints.
   Jump them or use supporting ledges. Dash grants no trap immunity.
6. The caretaker investigates the junction for longer to account for the new
   approach distance. Optional music remains on the side ledge near that junction,
   so taking it still creates a meaningful interruption and noise during escape.
7. Bank the Sun, with or without music, at the original home door.

The map scales to the actual room width and marks the traps and relocated gate.
Objectives call out approach, depot route choice, theft and the service walk.
Trap failures explain the actual hazard instead of claiming a guard capture.
Dropped loot clamps to the current room size rather than the original boundary.

## Validation and limits

Input-driven routes complete the high and lower approaches, with and without
music, at two approach timings (eight runs). Tests also cover the real UI route,
map access, persistence isolation, spike failure, low-ledge recovery, far-wing
loot recovery, and portrait visibility of the crossing and hazard positions.

Rehearsed successful runs take approximately 19–21 seconds. This is longer than
the compact 11–14-second experiment, not a claim of a finished 60–90-second level.
We have not measured first-time player duration or enjoyment. No physical phone
or browser visual QA was available. Existing illustrated assets are reused.

Next playtest: Is the depot route choice useful? Are the traps visible early
enough to plan? Does the service-walk escape add tension without feeling like
padding? Compare the compact room before adding more encounters or length.
