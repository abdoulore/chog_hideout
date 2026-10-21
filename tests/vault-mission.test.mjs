import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,nearbyAction} from '../public/mischief.mjs';
import {vaultHazards,ventState,VENTS} from '../public/vault-mission.mjs';
import {vaultEscape} from './helpers/vault-driver.mjs';
for(const restore of [false,true])for(const high of [false,true])test(`vault mission completes with ${restore?'restored lift':'street escape'} and ${high?'high':'low'} entry`,()=>{
 const s=newMischief({vaultMission:true});vaultEscape(()=>s,i=>stepMischief(s,i),{restore,high});assert.equal(s.status,'won');assert(s.vaultOpen&&s.loopAlarm&&s.loot.includes('sun'));assert.equal(s.powerRestored,restore);
});
test('vault cannot be looted before cell installation; cell cannot be banked alone',()=>{
 const s=newMischief({vaultMission:true});s.x=3920;s.y=276;s.ground=true;assert.equal(nearbyAction(s),null);assert(s.room.solids.some(p=>p.kind==='vault'));s.x=100;s.y=426;s.loot=['battery'];s.items.battery.state='carried';assert.equal(nearbyAction(s),null);
});

test('optional music still makes it home on both escape choices',()=>{
 for(const restore of [false,true]){const s=newMischief({vaultMission:true});vaultEscape(()=>s,i=>stepMischief(s,i),{restore,music:true});assert.equal(s.status,'won');assert(s.loot.includes('music'));}
});

 test('steam has a full warning beat, safe gaps, and matching collision volume',()=>{
 const v=VENTS[0];assert.equal(ventState(2.3,v).phase,'safe');assert.equal(ventState(2.4,v).phase,'warning');assert.equal(ventState(3.4,v).phase,'active');
 const s=newMischief({vaultMission:true});s.x=2820;s.y=426;s.time=2.8;vaultHazards(s);assert.equal(s.status,'playing');s.time=3.6;s.y=316;vaultHazards(s);assert.equal(s.status,'playing');s.y=317;vaultHazards(s);assert.equal(s.deathReason,'steam');
 });
 test('a missed or dropped power cell remains recoverable and mission reset clears seals',()=>{
 const s=newMischief({vaultMission:true});s.x=1800;s.y=351;s.ground=true;s.items.battery.state='carried';s.loot=['battery'];stepMischief(s,{drop:true});assert.equal(s.items.battery.state,'world');assert(s.items.battery.x>1700);assert.equal(s.powerRestored,false);const fresh=newMischief({vaultMission:true});assert.deepEqual(fresh.relays,[]);assert.equal(fresh.vaultOpen,false);
 });
