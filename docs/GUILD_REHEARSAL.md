# Guild competition rehearsal

17 October 2026. This is step 1 of the guild integration, not an NFT or real-money tournament implementation.

## Try it

Open `/guild.html` from the home navigation or mission card. Lantern Company and Copper Assembly are two fictional example guilds, each with four local player seats. Neither has a linked founding NFT. Select a seat, enter a qualifier, and press Play in the game to consume an attempt. A banked escape posts that seat's result. Return using Guild Hall & standings.

To rehearse alone, play the selected seat and then open **Test the flow on your own**. **Fill empty seats with examples** supplies labelled fixture scores for the other seats, leaving the selected seat untouched. It preserves existing banked scores. It does not simulate real users or validate play. You can instead switch seats and play all runs yourself on the same browser.

Once three players per guild have qualified, **Lock squads & start final** ends qualifying and selects the top three from each guild. Final scores start empty. Switch to any selected squad member, play final attempts, and compare player/guild boards. Fill other seats with example scores if desired. Both squads need three escapes before **Close rehearsal & award trophy** becomes available. Closing freezes entry and awards a local illustrated trophy, including joint winners on an exact team tie. Reset requires confirmation and affects only rehearsal data.

## Scoring

- The game is One More Thing, version `one-more-thing-guild-v1`.
- Battery = 1, music box = 2, Pocket Sun = 3. Only successful banking counts.
- Each player's best result is ordered by treasure value descending, then simulation ticks ascending (120 ticks per second). Display uses three decimal places; ranking uses integer ticks.
- Equal scores/times share a competition rank. A tie across the third qualifier slot blocks locking until another run resolves it.
- Guild score sums the three roster members' best final treasure values and then their times. All three must bank a result before the guild qualifies for placement. Incomplete totals remain provisional.
- Ten local attempts per player per round is a trial setting. Pressing Play starts an attempt; retrying, navigation or a superseding run abandons the old attempt and consumes it. Example fixtures do not consume playable attempts.
- This is a manually advanced rehearsal with no clock deadline, network recovery, real prize or token reward. Pausing stops simulation time. These are not final official-event policies.

## Implementation

`guild-trial.mjs` owns serialisable, game-independent round state and ranking. `guild-hall.mjs` renders headquarters, selection, boards and rehearsal organiser controls. `guild-session.mjs` connects explicit tournament URLs to the existing mission controller. Ordinary solo URLs never write rehearsal results. Real game runs still update their usual solo progression.

State uses `chog-guild-rehearsal:v1` in localStorage. It is browser-local, editable and unverified. Identity is a selected local seat, not an authenticated person. Cross-tab storage events refresh the hall; only one active local attempt is supported. Starting another abandons the previous attempt. Old event links, closed rounds, reserves and exhausted attempt budgets cannot start a recorded run through the normal UI. Score submission is one-time for an active attempt. Corrupt/blocked storage surfaces an error, and no successful save is claimed.

Headquarters reuse the existing home and city illustrations with distinct brass/plum and copper/teal crests. No new downloaded art, fonts or external dependencies are added.

## Verification

Model and DOM-controller checks cover score order, exact ties, squad selection, fresh finals, incomplete teams, equal guild placement, closure, example provenance, consumed attempts, stale links, blocked saves, explicit reset, home links and ordinary solo isolation. The actual game controller is exercised through a full battery escape into one recorded qualifier, with retry and navigation abandonment checks.

No supported browser-control skill was available. DOM mocks check interactions and text but do not establish visual layout or physical touch quality. Phone visual/input playtesting remains necessary.

## Next gates

1. Confirm the official collection; implement wallet authentication, current-owner authority and persistent membership.
2. Move event state and attempt issuance to a server. Validate game input replays against a pinned simulation and ruleset, publish result-review procedures and handle disconnect recovery.
3. Lock real-event rules, roster and prize beneficiaries. Add confirmed funding and reviewed payouts only after this competition path works.

The platform should keep guild/event concepts separate from game simulation, while shipping only Hideout as the first supported game. No external-game integration, guild founding, invitations, verified leaderboard or prize distribution is claimed by this rehearsal.
