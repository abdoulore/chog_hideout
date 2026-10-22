# Live guild competitions

22 October 2026. `/compete.html` uses persistent server events and authenticated player accounts. The original `/tournament.html` remains a separate local rehearsal.

A verified current Chog NFT guild master creates an event for one of the three missions, lasting 1–72 hours. Each guild master enters a fixed squad of one or three existing members. Players can belong to only one squad per event. Ordinary members need their signed-in account but no wallet. Ownership is checked again for protected guild-master actions.

Each player gets ten starts, including abandoned or failed attempts. A start reserves a server token. A successful run submits compact input frames; the server runs the same deterministic simulation and computes haul and ticks itself. Five minutes of simulation and a fifteen-minute submission window are enforced. Expiry, membership, event cancellation and duplicate submission are checked. The server stores accepted inputs and scores.

A guild ranks only when every squad member finishes. Each member's best haul, then fastest time, counts; guild totals rank the same way. Exact ties share the trophy. Reading a closed event finalizes and saves its trophy, so no scheduler is required. Trophies are in-game records only: no cash, token, NFT transfer, entry fee or funded payout.

Replay checking rejects impossible scores but does not prove human input. Automation and optimized input scripts remain possible. This release is not suitable for funded competitive prizes without additional anti-abuse review and operational controls. A game rules change must increment the ruleset; open events on older rulesets refuse new attempts.

Automated tests use real cryptographic signatures, a mocked ownership RPC and SQLite emulating D1. They cover multiple users/guilds, locked squads, attempt caps, transfer of ownership, replay validation, ties, persisted awards and submission retries. Real NFT-holder signing, a second account joining, and mobile wallet-browser operation still require a live user check. Site access remains owner-private; release does not change its audience.
