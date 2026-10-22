# Two-mission campaign

1. The Sun Vault: `/mischief.html?route=heist&renderer=pixel`.
2. The East Annex: `/mischief.html?route=annex&renderer=pixel`.

Finishing the Sun Vault with the Sun unlocks the Annex. Music is optional. The result screen prioritizes Next mission, with replay and home options. The home screen resumes the next unlocked mission and keeps replay links. Both completions save under `chog-campaign:v1` on this browser; timing records remain session-only. No tournament or guild records are created.

Progress writes immediately at extraction, before the result animation. Failed runs never unlock levels. Invalid storage defaults safely; replaying level one does not clear level two. If saving is unavailable, the win screen says so and supplies a local continuation URL. This is a convenience for solo progression, not anti-cheat, ownership verification or competitive evidence. Previous session-only wins cannot be reconstructed and are not silently awarded.

## Independent Annex start

The Annex starts at x3920/y276 on the eastern roof with the entry already open. It no longer repeats the cell fetch, installation or previous vault seals. A boundary at x3840 keeps the old approach outside this mission. The map and camera frame the annex area.

Release the yard seal at x4420/y310 and the high seal at x4700/y245. The optional music box sits at x4490/y310. Five new platforms provide upper crossings and lower recovery ledges. Take the Sun at x5050/y310; the upper shutter at x4860 closes after its warning. Drop to the service walk and cross two timed vents to the marked extraction door at x3920/y460. The same nearby-object interaction banks the Sun. No lift repair or return through the old level is required.

## Verification

Input-driven runs complete high and lower-ledged paths with and without music. Real-controller DOM checks cover a complete level-one-to-level-two sequence, save/reload, direct-link locking, missing-storage continuation, retry, extraction and the two-seal requirement. Home tests cover continue and replay states. These checks establish feasibility and persistence; phone feel and fresh browser visual review remain unverified.
