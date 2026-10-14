# Illustrated art pass — Rooftop Mischief

The main playable route is `/play.html`. The old `/movement.html` address redirects there. The technical renderer comparison remains at `/renderer-lab.html`.

## Art direction and generation briefs

Four raster assets were generated with OpenAI image generation on 14 October 2026, using the approved Rooftop Mischief concept and Chog mascot reference. They are reusable scene components rather than a screenshot background with controls painted into it.

| Asset | Brief and role |
| --- | --- |
| `burrows-city-v1.jpg` | Wide illustrated fantasy rooftop city; terracotta roofs, warm cream stone, lilac distance, golden clouds, climbing greenery, small purple banners. No UI, lettering, characters, hazards, or flat gameplay lane. Slow parallax background. |
| `burrows-roof-v1.webp` | Transparent horizontal platform strip; chunky terracotta roof tiles, warm highlights, stone and timber underside. Straight readable top plane, no characters or text. Repeated and clipped against physical platform geometry. |
| `burrows-props-v1.webp` | Transparent atlas of separate rooftop house, glowing golden exit doorway, low metal spike trap, and golden diamond spark. Warm illustrated material treatment consistent with the concept. Individual measured frames avoid neighboring props. |
| `burrows-chog-v1.webp` | Transparent 4 by 2 pose sheet of one consistent purple Chog mascot, side-facing right: idle, three running poses, jump, fall, dash, landing. Cream face, pink accents, spiky silhouette, warm painted finish; no labels or scene background. |

The generated originals were inspected, resized, and compressed into delivery assets. `asset-manifest.mjs` and `assets/manifest.json` record atlas rectangles. All four delivery images together are below 1 MB. Large source images are not required at runtime.

## Implementation

`world-renderer.mjs` renders the real fixed-step simulation using separate assets. Character poses are chosen from motion state, mirrored with facing, and anchored at the feet. Camera framing retains the gap plus at least 80 world units of safe landing at the sampled takeoff position on mobile and desktop. The top HUD, pause menu, progress indicator, and touch controls are DOM elements over the canvas. The main route has no framework download dependency.

This is a first illustrated art pass. The mascot is not an NFT-specific avatar. Generated pose sheets still need animation cleanup; foreground walls use simple shaded structure beneath the illustrated roof. Sound, story scenes, ownership verification, and player-owned hideouts remain future work.

## Verification

- Actual production rendering code and compressed assets were rendered with a native Canvas implementation in portrait, landscape, start, and airborne dash states and visually inspected.
- Automated tests validate atlas bounds, asset budget, camera landing visibility, loading gate, movement, dash cooldown UI, pause on blur, resume, and retry.
- The existing physics timing sweeps and renderer fallback checks remain in the suite.
- DOM mocks and native Canvas frames are not browser/device tests. Browser layout, fullscreen support, touch feel, and frame rate still require real-device playtesting.

The artwork and story are proposed Chog game work, not official collection canon or a grant of rights to the Chog brand.
