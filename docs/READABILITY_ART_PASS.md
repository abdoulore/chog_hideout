# Readability and illustrated prop pass

14 October 2026. The illustrated heist keeps its existing geometry and movement rules.

## Hazard treatment

The previous small grey trap blended into the detailed terracotta roof. The replacement has brighter ivory faces, plum shadow outlines and a dark copper/burgundy mounting base. A static coral triangle with an exclamation mark identifies danger by shape as well as colour; it is visually distinct from the gold diamond sparks. A dark mounting plate separates the trap from the roof edge.

`spikeBounds()` supplies the unchanged 30 by 23 world-unit damage rectangle to both simulation and rendering. The actual spike sprite retains its prior 46 by 25 world-unit placement. The marker and base flanges are presentation cues, not additional collision or collectible objects. The marker stays static when reduced motion is enabled.

## Consistency corrections

The bridge and maintenance ledges now use an illustrated timber strip. The shutter uses painted copper/slate panels, bevels and brass rivets. The Pocket Sun is an illustrated brass lantern carried beside the hand rather than over the face. The existing home window receives a dark glass gradient before restoration. No route dimensions, jump timings, checkpoint rules or record versions changed.

## Delivered files

| File | Use |
| --- | --- |
| `dist/assets/burrows-trap-v2.webp` | High-contrast hazard replacement |
| `dist/assets/burrows-timber-v2.webp` | Bridge and maintenance ledges |
| `dist/assets/burrows-shutter-v2.webp` | Closed shutter and raised housing detail |
| `dist/assets/burrows-sun-v2.webp` | Pocket Sun on plinth, carried and returned |
| `dist/hazard-renderer.mjs` | Marker, mounting contrast and shared footprint |

Generated with the built-in OpenAI image-generation tool, then resized/compressed for delivery. Alpha bounds were inspected and recorded in the asset manifest; the eight runtime images together occupy about 834 KB. The trap was an edit of the existing props atlas; the other three were new generated assets using the established visual brief.

## Verification

Inspected the actual production renderer at 360 by 630 pixels and in landscape, including the high maintenance route, bridge and Sun pickup. All 30 automated gameplay/UI/asset checks pass, including continuous completion and the return traversal sweeps. A native Canvas render validates the scene, not mobile browser layout, device latency or a human detection rate. Real-phone readability remains a playtest check.

## Complete generation prompts

### trap

Use case: precise-object-edit. Asset type: transparent 2D platform game hazard sprite. Edit the referenced props atlas into ONE isolated replacement spike trap, removing every other item. Preserve the rich hand-painted storybook game style, warm top-left light, beveled surfaces and plum-black outlines. Redesign the trap to be instantly readable when drawn only 30 pixels wide against busy orange terracotta rooftops: three broad upright ivory-white steel triangular teeth with bright cream faces, deep aubergine side faces, thick very dark outline, strong silhouette. Mount them on a low dark burgundy iron rectangular base with two large copper rivets and a narrow coral warning band. Shape proportions approximately 2:1 width to height including base. Teeth occupy the central two thirds of the base width, so the outer base flanges look harmless. Strict front-on side-scroller elevation, horizontal baseline. No perspective floor, no environment, no lettering, no numbers, no large glow, no cast shadow outside object. ONE object centred and large, truly transparent background.

### plank

Use case: stylized-concept. Asset type: a single transparent painted 2D game platform strip. One long straight horizontal timber walkway, front-on side-scroller elevation. Rich polished storybook fantasy game illustration matching warm terracotta rooftop houses, lilac city depth and chunky hand-painted wooden props. Broad honey-brown timber fascia, wood grain, small iron and copper fasteners, deep plum shadows, warm cream-gold top bevel, carefully painted edge wear. Flat unbroken straight load-bearing top edge. Aspect ratio of object about 8:1. Minimal shallow underside, no deep hanging supports, no railings, no posts, no ropes, no building, no characters, no text. Full object isolated large with generous clean transparent margin. Real alpha transparency, no floor or external shadow. This is a modular narrow balcony/bridge strip that must stay readable at a very small in-game size.

### shutter

Use case: stylized-concept. Asset type: transparent 2D game obstacle sprite. A single tall narrow rectangular closed security shutter, front-on orthographic elevation, width:height about 3:8. Rich polished storybook fantasy game illustration matching warm terracotta roof houses, copper machines, plum shadows and golden afternoon lighting. The full rectangular body has layered warm copper and weathered slate-plum metal slats, chunky brass side rails, hand-painted bevels, large rivets, two small cream diagonal warning stripes near the lower panel. A tiny embossed sun-shaped mechanical emblem at centre, no letters or numbers. Every point inside the outer rectangle looks solid; square corners, no arch, no empty openings. Substantial outlined silhouette and beautifully painted material texture; no photorealism. No frame overhang, no top housing, no surrounding wall, no props, no chains, no characters, no environment, no text. One isolated object large, genuinely transparent background and no external cast shadow.

### sun

Use case: stylized-concept. Asset type: transparent 2D fantasy game quest-object sprite. ONE small Pocket Sun lantern, a squat rounded warm-brass hand lantern with a curved handle and a single glowing orb of afternoon sunlight inside golden glass. Rich polished storybook game illustration with bevelled copper ribs, warm honey highlights, plum shadow outlines, clear friendly chunky silhouette, cream-gold interior. Front-on side-scroller view, object width:height about 3:4, designed to be readable at 20 pixels tall. No filigree noise, no legs, no pedestal, no environment, no text, no other items, no giant glow cloud. Compact softly luminous glass within a sharp dark brass frame; preserve all glow inside the object except a very narrow rim. Real transparent background. One centred object, large with clean transparent margins.

