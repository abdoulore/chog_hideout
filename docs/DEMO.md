# Chog Hideout — demo walkthrough

## Opening

“Chog Hideout is a rooftop heist game where you steal the light, escape with your haul and compete for your guild. Chog holders lead the crews; anyone can enjoy the solo campaign.”

## 1. Show the game

Open `/home.html`, then start the Sun Vault. Show a jump, a double jump and a dash. Approach an interactive object and use the contextual action. Recover the power cell, explain its relationship to the vault and show the choice between street and lift escape.

“The interesting decision is what route to take and how much to risk. Movement, machinery and optional treasure all affect the escape.”

Continue into the East Annex to show the caretaker and distraction, then introduce the Lantern Run as the forward-moving third mission. Campaign completion unlocks these in sequence.

## 2. Explain the NFT utility

Open `/guild.html`.

“A Chog Genesis NFT anchors a guild on Monad. Its holder verifies ownership with a signed message, founds the guild and invites players. Members join with their player account. If the NFT changes owners, the new holder can claim leadership while the guild keeps its identity.”

For an interactive hosted demonstration, use a signed-in holder account and its on-chain token ID. Ordinary guild members use their own signed-in player accounts.

## 3. Show the competition

Open `/compete.html`. From a verified guild-master account, create an event, choose the mission and squad size, then lock the selected guild members. Open the event attempt from a selected member's account and complete the mission.

“Each player has ten attempts. The server replays the inputs to calculate haul and time. Every squad member must finish. The winning guild earns a saved trophy, and exact ties share it.”

Refresh the event page to show the verified score in the shared standings. Finalized events display the saved trophy result.

## Closing

“Come for the heist. Stay for your crew. Chog Hideout gives players a game to master and Chog holders a community to lead.”

## Reproduce the server flow locally

```bash
node --test tests/guild-server.test.mjs tests/competition-server.test.mjs tests/competition-session.test.mjs
```

These tests exercise authenticated accounts, signed wallet challenges, controlled ownership responses, multiple guilds, squad entry, replay checking and saved awards. Gameplay itself can be shown directly with `npm run solo`.
