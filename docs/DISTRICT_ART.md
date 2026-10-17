# Painted district: first finished section

The playable home entrance, first canopy, battery gate and connected lift now share warm limestone, worn timber, copper and brass. This is an environment art pass; the existing character animation remains the procedural motion pass, not a new animation sheet.

## Integrated assets

Created with the built-in image-generation tool, then resized and encoded as WebP with alpha preserved. Source art was not recoloured or reconstructed by scripts. Atlas rectangles are recorded in dist/district-art.mjs. Generated images remain in their original location; these production copies are in the repository:

- `/workspace/sites/chog-playtest-lab/dist/assets/burrows-hideout-v2.webp` — 768 × 569, 119,060 bytes. Painted closed-door home facade.
- `/workspace/sites/chog-playtest-lab/dist/assets/burrows-district-props-v2.webp` — 800 × 800, 141,400 bytes. Battery, music box, planter and motor atlas.

Combined addition: 260,460 bytes, loaded only by the One More Thing mission. The existing base asset pack remains unchanged.

## Integration

The home sits on the same ground plane and has a centered entrance. Banking opens a clipped section of the wooden door, spills warm light, and eases Chog into the entrance before the result panel. Canopies now have thick timber faces, lit upper edges, metal straps, bolt heads and diagonal brackets, all below the collision top.

A copper conduit connects the battery socket, shutter relay and lift motor. Powered lamps glow amber; removing the battery darkens them and leaves the shutter visibly rolled up. The lift has tracks, cables, a painted motor and rotating winding wheels. Nearby battery and restore prompts explain the route tradeoff before acting. The disabled lift explains that the battery must be returned.

The planter and carried treasures use the painted atlas. Persistent lift, gate and cover labels are replaced by physical cues. Contextual controls, treasure values and alert warnings remain. HUD panels use quieter plum glass and brass edges; carried battery/music icons match their world art.

Distant buildings receive a restrained extra atmospheric veil and background houses recede. Player art and playable surfaces stay crisp. Movement, detection, treasure values, route geometry, saves and control bindings are unchanged.

## Validation

All 65 automated checks pass, including continuous one-item and full-haul routes, save/reload, gestures and old missions. Native Canvas reviews cover home, gate, canopy, depot, powered-off lift and homecoming at phone and landscape sizes. Atlas dimensions, alpha, frame bounds and file sizes were inspected. These are production-renderer checks, not real-browser screenshots. Physical-device CSS, touch feel and performance still need a phone playtest.

## Final generation prompts

### Home facade

Use case: stylized-concept. Asset type: one production game sprite for Chog Hideout, a warm painterly 2D side-scrolling rooftop heist. Create a charming small thief's hideout FACADE, straight-on orthographic elevation, isolated on truly transparent background. Single squat cream limestone cottage facade, warm terracotta tiled shallow roof, thick beautifully painted worn oak beams, small clusters of ivy confined to edges, one little round amber lit window on the left, the MAIN arched dark walnut wooden doorway exactly centered horizontally and extending to the flat baseline; brass ring handle, thin warm light under the door, tiny brass lantern beside door. Door closed, no glowing portal, no spiral. A small plain plum-purple cloth pennant near the window, no emblem or writing. Elegant handcrafted storybook game art, golden afternoon sunlight from upper left, cool plum shadows on right, tactile stone and wood, strong simple silhouette, crisply rendered usable foreground asset. The facade is wider than tall about 1.35:1, entirely inside image with 8% transparent padding. Keep door center at image center, bottom edge level. No characters, no scenery, no ground outside facade, no floor shadow, no text, no watermark. Rich controlled colors, no excessive ornament, no hazy lighting or white outline. Final asset will be scaled to about 300 pixels wide in a game.

### Prop atlas

Use case: stylized-concept. Asset type: one production transparent 2-by-2 prop sprite atlas for Chog Hideout, a warm illustrated 2D side-scrolling rooftop heist. Four isolated objects on a truly transparent square canvas in FOUR equally sized quadrants. Each prop centered inside its quadrant with large clear margins; NO prop crosses quadrant boundaries, NO background, no labels, no letters. Consistent straight-on side-scroller view, golden sunlight from upper left, cool plum shadows, rich hand-painted texture and crisp readable silhouettes. TOP LEFT: compact chunky aged-brass power battery cartridge, rounded cylinder-like rectangular body, teal inset window with amber lightning bolt, two copper contacts on top, small carrying loop, warm brass edge highlights; upright, baseline horizontal. TOP RIGHT: small burgundy and walnut wind-up music box with polished brass corner caps and brass crank on right, closed lid, delicate small brass musical-note ornament on top; no text. BOTTOM LEFT: wide rectangular terracotta planter in old timber cradle, densely filled with rounded sage-green leaves and a few small cream flowers, warm stone feet, bush forms an opaque dense rectangle silhouette for cover, width about 1.35 times height. BOTTOM RIGHT: compact old rooftop lift MOTOR housing, walnut rectangular mounting board with two brass cogwheels and copper cylindrical motor, teal enamel cap, clear large circular unlit indicator lens on upper right; a cohesive machine with no cables extending out. Each object richly shaded and beautifully painted like premium animated-film set props; restrained detail designed to remain readable at small scale. No characters, no scene, no cast shadows outside objects, no checkerboard drawn in image, no white outlines. Truly transparent canvas.
