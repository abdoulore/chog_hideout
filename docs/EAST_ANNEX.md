# Campaign progression

1. The Sun Vault: `/mischief.html?route=heist&renderer=pixel`.
2. The East Annex: `/mischief.html?route=annex&renderer=pixel`.
3. The Lantern Run: `/mischief.html?route=lantern&renderer=pixel` (see LANTERN_RUN.md).

Finishing the Sun Vault with the Sun unlocks the Annex. Finishing the Annex unlocks the Lantern Run. Music is optional. The result screen prioritizes Next mission, with replay and home options. The home screen resumes the next unlocked mission and keeps replay links. All three completions save under `chog-campaign:v1` on this browser; timing records remain session-only. No tournament or guild records are created.

Progress writes immediately at extraction, before the result animation. Failed runs never unlock levels. Invalid storage defaults safely; replaying level one does not clear level two. If saving is unavailable, the win screen says so and supplies a local continuation URL. This is a convenience for solo progression, not anti-cheat, ownership verification or competitive evidence. Previous session-only wins cannot be reconstructed and are not silently awarded.

## Independent Annex start

The Annex starts at x3920/y276 on the eastern roof with the entry already open. It no longer repeats the cell fetch, installation or previous vault seals. A boundary at x3840 keeps the old approach outside this mission. The map and camera frame the annex area.

Release the yard seal at x4420/y310 and the high seal at x5500/y245. The optional music box sits at x4750/y170. The platforms provide upper crossings and lower recovery ledges. Take the Sun at x5750/y310; the upper shutter at x5580 closes after its warning. Drop to the service walk and cross the timed steam yard to the marked extraction door at x3920/y460. The same nearby-object interaction banks the Sun. No lift repair or return through the old level is required.

## Verification

Input-driven runs complete high and lower-ledged paths with and without music. Real-controller DOM checks cover a complete level-one-to-level-two sequence, save/reload, direct-link locking, missing-storage continuation, retry, extraction and the two-seal requirement. Home tests cover continue and replay states. These checks establish feasibility and persistence; phone feel and fresh browser visual review remain unverified.

## Encounter completion pass

The Annex now extends to x6050. Its Sun is at x5750, with the second seal on the tower at x5500/y245. The alarm shutter moved to x5580. New tower and lower recovery platforms create a longer outbound route and a steam crossing before the return to the yard. A third vent sits at x5400. The first vent moved into the platform gap at x4320; planter cover at x4440 is outside its damage band.

A local caretaker patrols x4420–4780 and can pursue within x4100–5200. The bell calls him toward the yard at x4420. Detection and the drawn torch beam use the same relocated planter cover. His alert warning lasts 0.55 seconds, including after the alarm. Investigation targets stay inside his reachable bounds. The flowerpot at x4490/y310 makes a local distraction. Optional music moved to a high detour at x4750/y170; carrying or dropping it affects the actual guard's hearing.

Objectives now start at 01 and distinguish seals, Sun pickup, the shutter drop, steam crossing, caretaker encounter and extraction. The new guard/cover/pot configuration applies only to the Annex; Lantern Run explicitly resets it.

Input-driven tests complete the extended route with and without music, via the lower ledge variant and at several delayed starts. Additional checks establish local patrol, capture, real cover occlusion and the flowerpot noise location. Automated routes take roughly 20–25 seconds, not a prediction of first-time player duration. This remains a short mission; the added encounters increase decisions rather than establishing campaign-length content. Fresh phone feel and visual review remain unverified.
