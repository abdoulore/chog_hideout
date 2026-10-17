# The Sunloop: escape-route experiment

Play `/mischief.html?route=loop`. Compare with `/mischief.html?movement=double`.
The normal room and both movement comparisons remain available. This separate
playtest enables double jump and platform drop. No personal records, keepsakes,
guild attempts or leaderboard scores are written.

## The decision

Use the stepped rooftops, optional high perch, canopy and lift/dash crossing to
reach the Pocket Sun on the far rooftop. Taking it triggers the depot alarm:

- Street gate opens and the lift stops. The route home is now below the approach.
- Upper passage warns for 1.2 seconds, then a shutter blocks it. The shutter
  waits while the player's body overlaps its closing space; it never crushes
  or teleports the player. The street opening underneath remains passable.
- The caretaker heads to the street junction, based on the alarm, not hidden
  player coordinates. An alerted guard notices visible players more quickly.
  Cover still blocks sight and live pursuit requires seeing the player.
- Drop from the prize roof, use the planter to break sight, cross above the
  junction, then head home along the street.
- The low side ledge carries a music box worth two. Taking it needs a 1.1-second
  hold and makes noise. It can be taken on approach too; that choice brings its
  noise into the entry. Dropping it still creates a recoverable decoy.
- The Sun is required to exit; music alone does not finish this job. There is
  no loose battery in this variant. Maximum haul is five.

The music stop is optional. No new currency, progression layer or artificial
countdown-to-death is added. The comparison asks whether crossing above and
escaping below is more engaging than retracing the approach.

## Validation

Full routes use real movement/action inputs with no player teleports or guard
overrides. Both Sun-only and Sun+music routes win across three approach timings.
These rehearsed runs take roughly 11–14 seconds: this is intentionally a compact
mechanic experiment, not a completed 60–90-second heist. Unpractised completion
time and replay appeal have not been measured.

Tests also cover collision changes, closing-space safety, lower passage access,
failed straight-line escape, unsafe drop beside the guard, required Sun, no
repeat-alarm resets, real UI completion, reset and persistence isolation.
Existing normal-room, movement, guild and gameplay tests remain in the suite.
No browser visual QA or physical-phone playtest was available for this release.

## Phone playtest questions

- Does the pre-theft description make the change understandable before committing?
- Does the warning plus street arrow make the drop feel like your own decision?
- Does the street-junction guard feel readable, especially in portrait view?
- Is the music stop tempting enough to try after the first safe escape?
- Is a second attempt motivated by a different plan, rather than unclear failure?

Do not promote the route to the default game solely because automated runs pass.
