# Scene depth and background hierarchy

16 October 2026. The shared painted renderer now treats the city and decorative houses as scenery behind the interactive plane. This applies to One More Thing and the original painted heist.

## Changes

- The city uses reduced saturation and contrast, slight defocus, and a restrained atmospheric veil. The clouds retain warm light, while the distant shadows shift toward the sky palette.
- The background is framed smaller and anchored to the gameplay floor. Portrait city height is 0.86 of the render height before aspect-ratio coverage constraints; this shows more of the skyline instead of a few oversized buildings.
- Background parallax is 0.10 of the camera movement, making the city read farther away.
- Decorative house art uses its own muted treatment and 0.70 opacity. Actual doorways, mechanisms, treasures, hazards, platforms and characters use their sharp original presentation.
- Chog's portrait illustration height in One More Thing increases from 94 to 100 world-render units. Physics and hitboxes are unchanged. Contact shadows under Chog and the caretaker give them more separation from the scenery.

## Rendering cost and fallback

`dist/scene-depth.mjs` grades each city/house source once into a cached surface. City grading is capped at 960 source pixels wide because fine detail is deliberately softened. Canvas filters are not repeatedly applied to full-screen tiles every frame. Cached surfaces are keyed by the source image through a WeakMap.

The renderer uses OffscreenCanvas when available, with an ordinary detached canvas as fallback. If a grading surface cannot be created, it draws the original source under the same atmospheric veil and uses the smaller framing. No replacement bitmap or additional image download was introduced. The raw illustration assets remain intact.

## Verification

The 58 existing automated checks pass, including both heists, gesture input and home saves. Native Canvas renders of home, canopy and depot views were compared at portrait and landscape dimensions. The renderer accepts a surface factory so native inspection exercises the same cached grading path.

These are scene renders, not physical-phone or live-browser screenshots. Browser filter support, first-frame cost and the final impression on the user's display still require device review. This pass changes visual hierarchy; it does not claim final production art quality.

## Caretaker torchlight — 16 October 2026

The previous 13%-opacity attention wedge is replaced by a clearly outlined, graduated amber light beam originating at the illustrated lantern. The lamp has a bright cream core and warm halo, with a more visible pool near the source. Alert pursuit shifts the beam to coral while the existing suspicion meter and state labels remain visible. Ray segments clip the drawn beam against the shutter and marked planter. A fixed number of simple rays is used; this does not add image assets or full-screen filter passes. Reduced motion suppresses the lamp's small walking bob.

This is a presentation change. Detection range, sight checks, suspicion, pursuit and collision are unchanged. As before, the light illustrates attention rather than serving as a pixel-perfect detection boundary. Native portrait/landscape scene renders were inspected; all 58 existing checks pass. Physical-phone brightness and live-browser appearance remain unverified.
