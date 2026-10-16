# One More Thing — playable gameplay hypothesis

15 October 2026. Current route: `/mischief.html`, linked from `/home.html`. The original `/play.html` mission remains available.

## Design purpose

Test whether observing a caretaker, changing a route by stealing, and voluntarily taking another risk is more interesting than following the original platforming corridor. The hypothesis is **“I could escape now, but I want one more thing.”** Code checks cannot prove fun, tension, repeat play, or human usability.

## Implemented rules

The fixed block is 1,720 world units wide. Home is on the left; a street shutter, supported upper canopy, powered lift, planter and three treasures create two main routes. All lower ground is safe; the new job has no hard timer or spike gauntlet. The heist now has brief acceleration, quick braking and roof-lip forgiveness. Jump height, coyote time, input buffer and dash limits remain shared with the original movement rules. See MOVEMENT_FEEL.md for the current profile.

| Interaction | Immediate result | Tradeoff |
| --- | --- | --- |
| Take lift battery | Street shutter opens | Moving lift stops; battery can be returned to the original socket |
| Take Pocket Sun | Sun joins haul and depot bell sounds | Caretaker can investigate the bell from farther away |
| Take music box | Adds two haul points | Repeated sound discloses its position; dropping it creates a recoverable decoy |
| Knock canopy pot | Pot falls, breaks and emits noise | One use per attempt |
| Hold home action with any treasure | Ends attempt and banks current haul | Remaining treasures stay behind for another attempt |
| Get caught | Ends attempt | Current haul is lost; earlier banked keepsakes remain |

Battery = 1 point, music box = 2, Sun = 3. Three treasures in a single escape = 6. There is no attempt quota, NFT gate, token payout, or competitive server verification.

Hold E or the contextual touch button to interact. Jump/dash interrupts the hold. One held press can perform only one action; the player must release before acting again. Q or Drop sheds the music box first if carried, otherwise the latest item. Dropped items land on an actual supporting surface and remain recoverable. The battery power state stays off when dropped; only restoring it to its socket turns power on.

## Caretaker

A deterministic street-level character patrols, investigates sound locations, becomes suspicious on sight, and chases after the suspicion meter fills. Initial sight requires roughly 0.95 seconds of continuous exposure. Distances, facing and height affect visibility. The shutter and marked planter occlude line of sight. Visible pursuit overrides sound distraction; making a noise does not magically erase a guard who is watching you. Breaking sight for several seconds moves pursuit into search and eventually patrol. Contact during alerted pursuit catches the player.

The caretaker cannot climb the canopy. Upper routing remains a refuge, but the caretaker now leads visible movement toward the predicted landing and pauses visibly before pursuit. It is a known simplification, not evidence of advanced navigation. The translucent wedge indicates facing/attention; it is not a pixel-perfect display of occluded vision. The actual suspicion bar and chase label are authoritative. Safe ground also means a missed upper jump is recoverable, although it may put the player near the caretaker.

## Saves and home

`chog-job:one-more-thing-v1` stores successful escape count, highest banked haul, fastest time with that haul, recovered treasure IDs, and the last haul. Lower-value speed runs cannot replace the time associated with the best haul. Nothing is awarded for an unfinished or caught attempt. Successful banking is processed once by the screen controller.

The home shows all recovered treasure types and the last successful haul. A banked Sun lights the existing hook; battery and music box appear in the illustrated room. Previous Borrowed Sunshine saves remain separate and intact. Guest saves are browser-local and untrusted. Shared homes, cross-device storage and NFT verification are not implemented.

## Presentation and art

The existing city, roofs, timber, shutter, Sun, Chog poses and home art are reused. Battery, music box, pot, planter and map are deterministic Canvas drawings. The caretaker uses one newly generated transparent sprite, mirrored by facing, with distance-based walking motion and a brief anticipation pose; this is not a full animated character sheet.

Project asset: `dist/assets/burrows-caretaker-v1.webp`, compressed to 280 × 257 with alpha. Generated using the built-in image-generation tool, then cropped/resized and encoded with Pillow. Existing assets were not replaced.

Final image prompt:

> Use case: stylized-concept. Asset type: transparent game character sprite for a polished 2D illustrated rooftop heist. Create ONE single full-body caretaker, a charming stocky anthropomorphic badger with cream muzzle and dark eye stripes, wearing a deep teal work coat, little brass cap and burgundy scarf, carrying a small brass lantern held low. Side profile facing RIGHT, readable silhouette, both feet on the same baseline, standing alert mid-step, slightly grumpy but endearing. Warm hand-painted storybook 2.5D game rendering, richly shaded with tactile fabric, warm amber highlights and crisp dark silhouette edges, matches a whimsical Mediterranean rooftop town at golden hour. Full character including hat, lantern, feet, nothing cropped. Isolated on genuinely transparent background, ample transparent margin. No scenery, no ground, no shadow plane, no text, no frame, no alternate poses or duplicate characters. This is a single production sprite, not a character sheet.

Original synthesized audio adds a pot crash, depot bell and quiet repeating music-box phrase. Audio waits for user interaction, supports mute, and stops on pause/blur. Visual noise rings communicate the same stimuli when muted. Reduced motion suppresses idle sprite movement and the pre-existing decorative particle effects.

## Verification and limits

Automated checks cover a complete battery-only street escape and a continuous all-three-treasure route using ordinary controls, with no position teleports or caretaker overrides. The all-three route uses the canopy, pot distraction, Sun theft, powered lift, music box, return crossing and final battery theft. Separate fixtures test suspicion, sight occlusion, losing pursuit, being caught, noise targeting, dropping/recovering the box, action cancellation and release latching, power restoration, save handling and home migration.

DOM-mock screen tests drive the actual controller through keyboard and captured-pointer events, win/bank exactly once, reload records, pause via map/blur, resume, replay, and report blocked saves or failed artwork. Native Canvas renders inspect home/canopy/depot views at portrait and landscape sizes. Portrait look-ahead exposes the upper crossing's landing and retains the character's screen size. Existing movement, heist, renderer and home tests remain in the suite.

No real browser or physical touch-device playtest was available in this environment. Native Canvas inspection does not validate CSS, mobile browser input, audio perception, difficulty balance or enjoyment. The full-haul feasibility route is not a player completion-time claim.

## First human playtest

Ask the player to start without explaining an optimal route. Observe whether they discover the hold action, understand the battery tradeoff and caretaker warning, and intentionally bank a first item. Then see whether they start another attempt or turn back for a second theft before banking. Capture where they were confused, whether a catch felt fair, and what they tried next. If every attempt uses the same safe route, revise the interactions and level before adding more content.

## Mobile action clarity fix — 16 October 2026

The action button now stays visibly gold and enabled throughout active play, including when no object is close. Its idle label is HOLD ACTION with an instruction to move next to a treasure. Nearby it changes to HOLD TO TAKE, HOLD TO KNOCK, HOLD TO RESTORE or HOLD TO GO HOME, with a filling progress indicator. The touch action stays above the movement row and accounts for the bottom safe area. Intro and world prompts use ACTION; E remains a keyboard shortcut. Long-press context menus are suppressed on the controls. The existing captured-pointer test now verifies discoverable idle/nearby labels, cancellation before completion, release and a completed hold. Physical-device CSS/input validation remains unavailable in this environment.

## Gesture trial — 16 October 2026

The current touch default is Gestures. The previous button controls remain selectable in Pause and save to `chog-controls:v1`. Keyboard controls work in either mode. This change applies to One More Thing; the original Borrowed Sunshine mission retains its button layout.

- Drag on the lower left half to move. The small thumb pad follows the initial touch position. A 9 CSS-pixel dead zone stops movement when the thumb recentres; release, cancellation, lost capture, blur, resize, mode change and pause clear held state.
- Tap the right side to jump on release. A tap permits at most 12 pixels of travel and 220 ms of contact. There is no timer waiting to decide whether to jump after release.
- Swipe horizontally on the right to dash once per contact. Threshold: 28 CSS pixels, horizontal movement more than 1.25 times vertical travel, within 260 ms. The swipe chooses dash direction even if the other thumb points the opposite way. A recognised swipe does not also jump. Vertical drags and long rests do neither.
- A screen-space tap marker appears on the nearby actionable treasure, pot, socket or home door. It projects from the same gameplay camera. Tap while standing still to begin the existing timed interaction. Moving, jumping, dashing, dropping loot, leaving reach or pausing cancels an unfinished action. One tap never performs a second action automatically.
- Tap a carried-loot icon to drop that exact item. The map, sound and control selector are inside Pause. Pause is the only permanent play-screen button; object markers and carried items are contextual.

Added recognizer and controller checks cover two-pointer movement plus jump/dash, no jump on swipe, no delayed tap timers, directional dash priority, cancellation/reset, blocked preference storage, projected targets, tap-to-steal, tap-to-bank, targeted dropping, and cancelling a theft by moving away. Existing continuous full-haul feasibility routes and old button/keyboard flows remain covered.

This is a trial for device playtesting. Tests validate event handling and simulation; no physical phone or live browser CSS/input validation was available. Tap-to-jump deliberately fires on release, so finger contact duration still contributes to perceived response time. Real-device jump-to-dash timing and thumb reach remain the acceptance gate before committing to these controls.

## Movement and pursuit revision

See [MOVEMENT_FEEL.md](MOVEMENT_FEEL.md) for acceleration/braking, lip assistance, continuous pose animation, theft reactions, interception, music-box escape behaviour, and validation limits.
