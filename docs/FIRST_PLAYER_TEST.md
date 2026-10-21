# Chog Hideout: first-player test
Prepared 21 October 2026. Baseline: v31, GitHub f9890f4be16fc4f73b223ad5d997920c66dd4a19.
Status: protocol prepared; no human sessions completed or findings claimed.

Game: https://chog-playtest-lab.fondbuddy6.chatgpt.site/mischief.html?route=loop

## Purpose
Find out whether an unfamiliar player can learn the controls, understand the theft and escape, explain a failure, and choose another attempt. Automated route tests establish feasibility, not fun.

## First round
Use five people who have not seen the game: ideally two occasional mobile players, two regular mobile players and one platformer player. This is a small qualitative test, not a statistically representative sample.
Allow about ten minutes each. Start in portrait with gestures. Record whether the device is the owner's shared phone or the player's own device.
The site is owner-private. For in-person sessions the owner opens the game on their own signed-in phone and remains present. Do not share credentials. Remote sessions require separately authorized access; this protocol does not change sharing or send invitations.

## Before each player
- Open the exact default depot URL above, not the compact room or normal game.
- Reload to clear session bests. Set gestures in Pause if a previous player changed controls.
- Set the same comfortable sound level for each session; record sound on/off.
- Return to the initial start screen. Check artwork has loaded and Play is available.
- Use an anonymous ID P1–P5. Ask permission before recording the screen or voice. Written notes alone are enough.
- Note device, browser, orientation and prior platformer experience. Do not clear all browser storage: guild/account state is unrelated.

## Moderator opening
Say: “Please try this game as you normally would. You can stop whenever you want. We are testing the game, not you.”
Do not explain the controls, Sun, music box, return route or where to go. The in-game instructions are part of what is being tested.

## First five minutes: observe
Start the clock when the player sees the start menu. Let them read or skip it.
Record times to first deliberate movement, first jump, first successful interaction, Sun pickup and first escape. Mark missing milestones as not reached, not zero.
Record each death: location, hazard, what the player seemed to expect, and whether they could explain it.
Watch for:
- Left drag mistaken for a tap; right swipe gestures conflicting with movement.
- Double jump attempted without lifting the thumb between swipes.
- Reaching the Sun but not knowing how to take it.
- Trying to retrace the roof after the alarm instead of dropping.
- Seeing a trap only after committing to a landing.
- Reaching home without recognizing the interaction prompt.
- Experiment comparison links pulling the player away from the tested route.
Do not diagnose intent as fact. Separate observed action from your interpretation.

If they ask for help, first ask “What are you trying to do?” If they remain blocked for 60 seconds, offer one minimal hint or let them stop. Record the exact hint and timestamp. Subsequent success is assisted, not unassisted. Do not force repeated frustration.

## Replay observation
After the first win, stay quiet and allow a natural decision. Record an unprompted retry only if they choose it before any replay question.
If they retry, note their stated or visible goal: faster same haul, both treasures, different route, or unclear. Do not count curiosity about a comparison link as another default-level attempt.
If they do not win, record voluntary retries and eventual stopping separately.
After five minutes, ask whether they want to continue; any later retry is prompted. Keep the whole session under ten minutes unless the player independently wants longer.

## Post-play questions
1. What were you trying to do?
2. What changed when you took the Sun?
3. What caused your last failure?
4. Which moment felt best? Which felt frustrating?
5. What, if anything, would you try differently next time?
6. Would you play again now? Why?
Avoid “Was it fun?” as the only question and avoid teaching the answer before asking.

## Observation sheet — duplicate for each player
- Player ID / device / browser / shared or own phone:
- Experience / sound / orientation:
- First move / first jump / first interaction / Sun / escape timestamps:
- Attempts / successful escapes:
- Deaths and causes:
- Exact assistance given and time:
- Could explain objective / alarm route / failure:
- Unprompted retry after win: yes / no / no win:
- Retry goal:
- Accidental menu navigation or control-mode change:
- Best moment, in their words:
- Main frustration, in their words:
- Observed facts:
- Moderator interpretation (separate):
- Technical issue, if any:

## Provisional decision rules
These are internal targets, not industry benchmarks.
- Aim for 4 of 5 to move and jump without coaching within one minute.
- Aim for 4 of 5 to explain the main objective.
- Aim for 3 of 5 to escape within five minutes without direct control/route hints.
- Aim for 4 of 5 to identify what caused their last death, when they died.
- Report unprompted replay as a count out of players who actually won; target at least 3 independent replays before calling replay motivation promising.
- Any repeatable input failure, unreadable mandatory hazard or progression blocker takes priority over those counts.
One frustrated player can reveal a real issue. Five positive sessions do not prove retention or release readiness.

## How results change the next build
- Controls misunderstood: improve a short safe opening and contextual gesture teaching.
- Treasure interaction missed: strengthen proximity/action affordance before adding more copy.
- Alarm route misunderstood: strengthen the shutter/drop/street cue at the moment it matters.
- Death cause unclear: correct warning visibility and cause feedback.
- Clear and playable, but no desire to retry: revise meaningful route/risk decisions before adding rewards.
- Replays happen but players chase only an arbitrary timer: ask whether route mastery itself feels satisfying.
Rank fixes by repeated observed blocks, implement the top two, then test with new people. Keep old and new results separate.

## Optional later comparison
Only after the baseline sessions, compare the compact route:
https://chog-playtest-lab.fondbuddy6.chatgpt.site/mischief.html?route=loop&layout=short
Counterbalance which route people try first in a separate comparison round. Ask which moments each route adds or removes; familiarity and differing session times make raw finish times incomparable.

## Current evidence boundary
v31 passed 139 automated tests and production build. No first-time human testing, phone listening evaluation or browser visual review has been completed by the agent. Source inspection suggests interaction discoverability, alarm-route comprehension and menu density are test hypotheses, not observed user failures.
