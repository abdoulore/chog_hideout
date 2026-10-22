import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,nearbyAction} from '../public/mischief.mjs';
import {missionRelays,missionVents,vaultHazards,vaultObjective} from '../public/vault-mission.mjs';
import {actionTarget} from '../public/mischief-target.mjs';
import {vaultEscape} from './helpers/vault-driver.mjs';
for(const restore of [false,true])for(const music of [false,true])test(`annex completes with restore=${restore}, music=${music}`,()=>{
 const s=newMischief({annexMission:true});vaultEscape(()=>s,i=>stepMischief(s,i),{restore,music,annexLow:music});assert.equal(s.status,'won');assert.equal(s.relays.length,3);assert.equal(s.powerRestored,restore);assert.equal(s.loot.includes('music'),music);assert(s.loot.includes('sun'));
});
test('annex third seal is required, targeted and shown in guidance',()=>{
 const s=newMischief({annexMission:true});s.vaultOpen=true;s.relays=['relay-west','relay-east'];s.x=5040;s.y=276;s.ground=true;assert.equal(nearbyAction(s),null);assert.match(vaultObjective(s),/ANNEX SEAL · 2\/3/);s.x=4690;s.y=211;const a=nearbyAction(s);assert.equal(a.id,'relay-annex');assert.deepEqual(actionTarget(s,a),{x:4700,y:215,label:'RELEASE SEAL'});assert.equal(missionRelays(newMischief({vaultMission:true})).length,2);
});
test('annex vents damage only inside the telegraphed band and reset cleanly',()=>{
 const s=newMischief({annexMission:true});s.x=4280;s.y=426;s.time=2.6;vaultHazards(s);assert.equal(s.deathReason,'steam');const fresh=newMischief({annexMission:true});assert.equal(fresh.status,'playing');assert.deepEqual(fresh.relays,[]);assert.equal(missionVents(fresh).length,4);
});
