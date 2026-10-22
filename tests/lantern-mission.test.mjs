import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,nearbyAction} from '../public/mischief.mjs';
import {vaultObjective} from '../public/vault-mission.mjs';
import {lanternEscape} from './helpers/lantern-driver.mjs';
for(const music of [false,true])test(`Lantern Run completes forward with music=${music}`,()=>{const s=newMischief({lanternMission:true});lanternEscape(()=>s,i=>stepMischief(s,i),{music});assert.equal(s.status,'won');assert(s.powerRestored);assert(s.x>5100);assert.equal(s.loot.includes('music'),music);assert(s.loot.includes('sun'));assert(!s.loot.includes('battery'));});
test('Lantern exit requires Sun and installed cell; dropped items remain the objective',()=>{const s=newMischief({lanternMission:true});s.x=5190;s.y=426;s.ground=true;s.loot=['sun'];assert.equal(nearbyAction(s),null);s.powerRestored=true;assert.equal(nearbyAction(s).id,'home');s.loot=[];assert.equal(nearbyAction(s),null);s.items.sun.x=4300;assert.match(vaultObjective(s),/TAKE THE SUN · ←/);s.loot=['sun'];s.powerRestored=false;s.items.battery.x=4900;assert.match(vaultObjective(s),/EXIT CELL · ←/);s.loot.push('battery');s.x=5150;s.y=276;assert.equal(nearbyAction(s).id,'power-exit');});
