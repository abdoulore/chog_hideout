# Feedback polish

Second jump now has a lighter, higher sound than ground takeoff. Dash recovery produces one quiet two-note cue plus a brief highlight on the existing button or gesture label. Neither adds a control or changes movement timing. Recovery cues are suppressed during recognition and escape sounds.

Escape glow now appears at the Mischief home door (x110), rather than incorrectly at the far edge of the level. The escape chord silences existing music-box voices before playing, with a soft lower harmony under its four-note finish. Existing result delay and instant-retry behavior are preserved.

Reduced motion keeps the existing suppression of particles, shake and flips; the new readiness highlight is static. Audio still requires user unlock, obeys mute, and stops on pause.

Validation: 139 tests, including single recovery transition, no recovery after capture, distinct airborne jump cue, and audio priority. Build checked during packaging. No physical-phone listening or visual QA was available; perceived loudness and clarity still need that check.
