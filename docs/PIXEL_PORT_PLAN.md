# Pixel presentation comparison

Status: first base-job comparison. Painted remains the default. Branch: pixel-renderer.

## Scope

Use `/mischief.html?renderer=pixel` for the existing One More Thing battery and lift encounter. This uses the real controller, physics, caretaker, records and gestures. Unsupported movement, loop and vault combinations retain painted rendering. No production default change is approved.

## Corrected decisions

- Canvas 2D with a native-resolution back buffer. No runtime framework or font dependency.
- Camera prioritizes visible width (360 units portrait, 480 landscape) before target height. Integer device-pixel scaling, whole-pixel camera and drawing positions. High-density portrait shows at least the approach and next platform. Actual-device readability remains a review gate.
- DOM interactions use the renderer camera via the shared layout interface.
- No fractional sprite squash. Use existing anchored poses and whole-pixel dash trails. More character cleanup remains before production approval.
- Torch reuses obstacle clipping, with a pixel-character lantern origin.
- Background grading applies only behind the gameplay layer.
- Preserve existing gesture controls, records and gameplay rules.

## Next stages

1. Phone comparison of the base job: movement, battery tradeoff, lift, hiding, chase, capture, banking and blocked storage.
2. Clean up hero frames and tune camera/background based on the comparison.
3. Convert Sun Vault and all remaining gameplay states, then menus and guild pages.
4. Obtain approval before changing the default. Keep painted fallback for one release.
5. Remove painted assets in a separate later change.

## Pipeline

`python tools/pixel-pipeline/build_assets.py --assets public/assets --out public/pixel --profile repo`

Prototype profile reproduces the 21 supplied PNGs and metadata exactly against the supplied source assets (verified during review). Repo profile resizes the home, planter, shutter, lift and city to gameplay scale. Generated PNGs are committed. Art remains derived from the existing assets. Run the existing test suite and pixel checks before publication.

## Verification limits

Automated state tests do not prove fun or real-device performance. The converted eight-pose Chog is not a finished hand-animated character. The comparison is deliberately limited to the base job; menus receive only a scoped frame treatment at this stage.
