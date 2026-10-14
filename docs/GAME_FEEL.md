# Game feel pass

The illustrated `/play.html` run now has original procedural sound and presentation feedback. Physics, collision boxes, jump windows, gap widths, and the authoritative timer are unchanged.

- **Movement:** interpolate the visible character position between fixed simulation steps; choose running frames from distance travelled. Small jump stretch, landing squash, contact shadow, idle breath, and a brief crouched landing pose add weight.
- **Jump and landing:** airy rising note at takeoff, a soft thud at touchdown, and warm rooftop dust.
- **Dash:** filtered air rush, restrained purple burst, and illustrated afterimages. No invulnerability or altered dash timing.
- **Sparks:** gold particles and a rotating set of bright chimes, awarded from actual new collection events.
- **Failure:** quiet descending cue, a tiny impact shake, and a 0.3-second presentation beat before retry. The simulation stops immediately on death.
- **Exit:** warm doorway response, gold burst, and a four-note flourish. Results appear after 0.65 seconds; the completion timer has already stopped.

`feedback.mjs` observes simulation transitions without mutating gameplay state. Particles are capped at 100, expire quickly, and reset for every attempt. Reduced-motion preferences disable particles, shake, breathing, stretch, and squash. Essential state remains readable from poses, the HUD, and the result screen.

`sound.mjs` creates Web Audio nodes only after an explicit Play/Resume or sound-button gesture. There are no audio downloads, background music loops, or externally licensed sound files. Mute stops pending voices and is saved locally. Leaving the page or pausing stops voices and suspends the audio context. Missing or denied audio degrades to silent play.

## Verification and limits

Automated checks cover event detection, single-award pickup sounds, particle lifetime/reset, reduced motion, simulation independence, audio unlocking, mute/pause, unavailable audio, and existing UI/gameplay checks. Native Canvas snapshots inspect the actual renderer with particles and changed poses. These checks do not establish audible mix quality, browser autoplay compatibility, or mobile latency; those require a real-browser/device playtest.
