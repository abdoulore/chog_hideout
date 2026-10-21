# The Sun Vault — playable mission pass

Entry: `/mischief.html?route=heist`, now the main Hideout button. Original Sunloop remains `/mischief.html?route=loop`. Both are isolated playtests with no tournament submissions, permanent records or rewards.

## Playable sequence
1. Cross the original district. The moving lift is powered. Rooftops and existing cover offer ways through the caretaker's district.
2. Take the power cell at x1500 on the depot roof. It opens the street shutter and stops the lift. Carry it through the high perches or lower recovery ledges.
3. Install the cell in the vault socket at x2030. The full-height vault barrier at x2220 opens. The Sun cannot be taken before installation.
4. Enter the new steam hall: six additional platforms, two brass security relays at different heights, and two timed steam vents. Release both seals before taking the Sun at x3930. World width is now4300.
5. Taking the Sun sounds the alarm and closes the upper passage after its warning. Drop into the lower hall and time the vents, or use upper platforms to bypass their plumes. Steam has a2.4s clear interval,1s amber warning, then1.4s active interval. The two vents have different phases. No dash immunity.
6. At the vault socket, choose: leave the cell and take the trapped street, or recover the cell and reinstall it at x1500. Restoring power brings the lift back and closes the original street gate, requiring a rooftop return.
7. Pass the caretaker, optionally take the music box or use it as a decoy, and bank the Sun at home. The cell is equipment and does not add haul value.

Controls are unchanged. New interactions use the same nearby tap/hold action. Objectives, physical socket labels, seal states, vent warnings, map and failure explanation reflect the mission. Dropped cell and Sun remain recoverable. Seals reset on retry. Restoring power is optional, not a mandatory fetch-back step.

## Verification
148 tests pass, including full continuous input-driven escapes using high/lower depot approaches and both power choices, optional music on both escapes, actual controller completion, locked Sun, vent warning/collision boundaries, reset and persistence isolation. Tests do not teleport or disable guards for the full routes. Isolated boundary tests explicitly arrange states.

Observed practiced simulation times: approximately36–40seconds. The earlier2–3minute first-clear aim is not measured or proven; do not present it as achieved. This adds encounters and route consequences, not a finished multi-minute campaign. Browser start menu and opening gameplay view checked at desktop dimensions. Full mobile visual/gesture feel and human enjoyment still need validation.

Known design questions: Does restoring the lift feel worth its extra effort? Are the two seals interesting traversal targets or errands? Does the timed lower escape feel different enough from the entry? Keep those questions ahead of more progression or menu work.
