# Double jump playtest

Compare `/mischief.html?movement=double` and `/mischief.html?movement=single`.
Normal `/mischief.html` is unchanged. Both comparison modes share a high perch
near home and all existing heist routes, loot consequences and caretaker logic.
These runs never save personal records, keepsakes or tournament attempts, even
if a tournament query is appended. Links are available from Home and Pause.

## Rules

- Ground jump: existing 555 upward velocity. Air jump: 440, once per flight.
- Swipe up, release, then swipe up again while airborne. Space or the existing
  Jump button works twice too. Holding a jump does not auto-fire the air jump.
- Walking off a ledge retains one recovery jump after coyote time.
- Landing on a real surface or assisted ledge restores the air jump.
- Air jump cancels an active dash without restoring dash cooldown.
- Smaller midair flip, particles and jump sound acknowledge the second input.
  Reduced motion removes the flip and particles. A text indicator remains.
- High perch at x190–260/y310 is unreachable directly from the street with a
  single jump. The existing x300/y385 roof remains the slower accessible route.
  Jump + dash from the perch reaches the canopy while preserving the air jump.

## What is verified

Automated simulation checks reachability, one-use limit, landing reset, coyote
recovery, dash cooldown and feedback. UI tests exercise two actual gesture
sequences and prove comparison runs cannot alter personal/tournament records.
The existing complete three-treasure route remains covered by regression tests.

## Decision still to make on a phone

Compare both versions: Does a second swipe feel comfortable while steering?
Does recovery reduce frustrating misses? Does the high route create choices?
Can the player stay above the caretaker too easily? Does the flip obscure the
landing? Do not promote the mechanic to default until these are playtested.
No physical-device or browser visual QA has been performed for this change.
