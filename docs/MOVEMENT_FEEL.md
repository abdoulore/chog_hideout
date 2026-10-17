# Movement and pursuit pass

The change addresses the stiff stop/start movement and largely reactive street pursuit in One More Thing. The goal is immediate control, visible weight, and a reason to choose an escape route after being spotted.

## Movement

- Direction input moves Chog on the first 120 Hz step. Starting from rest reaches 265 world units/second in about 50 ms; reversal reaches full opposite speed within 75 ms.
- Braking stops normal running within five world units. No slippery ground or long animation lock.
- Dash keeps its immediate 720 speed, 0.18-second duration and one-second cooldown. Opposite-direction swipes still override the other thumb.
- A moving airborne player can catch a roof lip missed by up to 12 vertical units, within 18 units of its edge, near the jump apex. Low jumps and solid shutters cannot be bypassed.
- Jump height, coyote time and buffered jumps remain intact. The original timed raids retain their physics profile.
- The subsequent 17 October control refinement maps upward swipes to jump immediately at the recognition threshold. Sideways swipes dash; one contact triggers one action. Variable-height jumping remains outside this pass.

## Presentation

The eight existing illustrated poses are retained. Continuous stride compression, lift, lean, turn planting, landing compression, takeoff stretch and braking dust fill the gaps between poses. Footstep distance matches the run cycle. This is procedural animation over the existing art, not a newly drawn eight-frame run cycle or a skeletal rig.

A narrow ledge recovery eases the displayed body up while collision immediately rests safely on the platform. Tiny direction changes do not instantly swing the look-ahead camera, and looking toward an object to steal it does not turn the camera.

Theft turns Chog toward the item, adds a tug and object wobble, then carries the stolen item along a short arc into the haul. No animation locks the controls. Reduced motion removes deformation, bobbing and flight effects.

The caretaker's walking motion advances only when moving. The light follows the same body transform as the lantern, preserving its bright beam.

## Pursuit and counterplay

- Filling suspicion begins a 0.55-second visible warning before movement/capture. Noise investigation has a 0.35-second reaction pause.
- While the player is visible above street level, the caretaker predicts the street landing from position and velocity (prediction capped at 0.75 seconds). He moves to intercept at the existing pursuit speed.
- Breaking sight stops live target updates. He searches the last known position or expected landing, then returns to patrol.
- After at least 0.6 seconds without sight, an audible dropped music box can redirect pursuit into investigation. Carried music cannot grant that escape.
- Labels distinguish the warning, interception, pursuit and sound investigation. Existing suspicion and occlusion remain in use.

The caretaker still cannot climb; rooftops remain safe from physical capture until the player descends. The beam communicates attention rather than the exact mathematical sight boundary. These remain prototype limitations.

## Validation

65 automated checks pass, including one-treasure banking and an unbroken three-treasure route through the real controller, no teleports or guard overrides. The full-haul scripted route completes in approximately 21 seconds; this is a feasibility result, not a target human completion time.

New checks cover first-step response, stopping distance, reversal, immediate directional dashing, cooldown, near-miss ledges versus low jumps/solid walls, coyote time, queued jumps, warning timing, interception, decoy redirection after loss of sight, one pickup reaction and reduced-motion transforms. Existing saves, retry, pause/blur, two-thumb gestures and old missions continue to pass.

Native Canvas renders inspect the production drawing code at phone and wide sizes, plus movement and theft states. Real browser, physical phone, audio feel and human enjoyment remain unverified in this environment.

## Phone playtest

Use the opening safe street and first canopy to run, reverse, jump and dash. Then steal one item and return. On a second attempt, deliberately attract the caretaker, take a roof and watch his landing choice; break sight and leave the playing music box as bait. Judge whether turns feel prompt, ledges feel fair, the warning is understandable, and a second approach is appealing. More scenery or collectibles should wait for that feedback.

## Sound and feedback refinement — 17 October 2026

One More Thing now uses separate stone, timber and lift-metal landing cues. Fall speed scales the landing squash, dust and sound weight without changing physics. Battery, Pocket Sun and music box each have one pickup signature and a brief matching collection ring. The original generic pickup callback is removed from the mission controller to avoid duplicate cues.

Entering caretaker chase plays a two-note recognition cue once, stops existing audio voices and suppresses incidental footsteps/music for 650 ms. A warm screen-edge warning lasts 1.1 seconds, and a clear exclamation badge appears during the existing 550 ms caretaker reaction window. Neither cue changes detection timing or pauses gameplay. Reduced motion keeps the warning steady and suppresses particle motion; mute, pause and unavailable audio remain supported.

Event, audio lifecycle and controller checks cover material landings, one cue per pickup/recognition, priority, reduced motion, mute and pause. Actual speaker balance and phone presentation require device listening/playtesting; these are synthesized effects, with no added audio downloads.
