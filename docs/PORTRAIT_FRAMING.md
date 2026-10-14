# Portrait framing and platform structure

15 October 2026. Presentation changes following the phone screenshot review.

## Composition

`scene-layout.mjs` centralises camera and scene layout. Tall mobile viewports place the ground at 65% of the canvas height rather than 73%, crop more sky from the background and give more room to town architecture. Portrait world zoom changes from 1.7 to 1.85, and the illustrated standing pose is 82 world units tall rather than 74. Together this gives Chog about 21% more apparent height on a 360-pixel-wide portrait display. Landscape retains its existing character scale.

Mobile look-ahead shifts toward 20% of the view on entry and 80% on escape to preserve the required crossing and at least 80 world units of safe landing. The vault turn blends the change; resizing resets the bias to match the new viewport. High jumps adjust vertical framing enough to keep the enlarged character below the compact HUD on sampled short portrait viewports.

The title and brand introduction recede into a smaller district heading when play starts. Objective, timer, sparks, sound and pause remain available. Intro/pause/results restore the larger heading; reduced-motion preferences suppress the heading transition.

## Platforms

The illustrated timber decks have a deeper front edge. Raised platforms gain diagonal corbels and lower-opacity rear support posts, so they read as supported structures. Their top edges retain the same collision height and width. Supports remain behind the character and do not add collision to the one-way decks. Bridge, shutter, checkpoint and jump/dash rules are unchanged.

## Verification

- The actual production scene renderer was inspected at 360 by 630 output pixels, plus upper-bypass portrait, short landscape and bridge states.
- Automated checks cover portrait landing visibility in both directions across four display sizes, HUD/head clearance across five viewport sizes and four vertical positions, control clearance on level ground, and preserved landscape scale.
- The DOM-mock completion/retry flow checks the active HUD state alongside the existing game and record behaviour.
- All 33 automated checks pass. Native Canvas scene rendering and DOM mocks do not constitute a browser layout or real-device touch test; the next phone screenshot/playtest remains useful validation.
