import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,nearbyAction} from '../public/mischief.mjs';
import {missionRelays,missionVents,vaultHazards,vaultObjective} from '../public/vault-mission.mjs';
import {actionTarget} from '../public/mischief-target.mjs';
import {annexEscape} from './helpers/annex-driver.mjs';
for(const low of [false,true])for(const music of [false,true])test(`standalone annex completes with lower ledge=${low}, music=${music}`,()=>{
 const s=newMischief({annexMission:true});assert.equal(s.x,3920);assert(s.vaultOpen);annexEscape(()=>s,i=>stepMischief(s,i),{low,music});assert.equal(s.status,'won');assert.equal(s.relays.length,2);assert.equal(s.powerRestored,false);assert.equal(s.loot.includes('music'),music);assert(s.loot.includes('sun'));assert(s.x>3800);
});
test('annex seals gate loot; exit needs Sun; guidance and targets match new mission',()=>{
 const s=newMischief({annexMission:true});s.relays=['relay-yard'];s.x=5740;s.y=276;assert.equal(nearbyAction(s),null);assert.match(vaultObjective(s),/TOWER SEAL · 1\/2/);s.x=5490;s.y=211;const a=nearbyAction(s);assert.equal(a.id,'relay-annex');assert.deepEqual(actionTarget(s,a),{x:5500,y:215,label:'RELEASE SEAL'});s.x=3910;s.y=426;s.loot=['music'];assert.equal(nearbyAction(s),null);s.loot=['sun'];s.loopAlarm=true;assert.equal(nearbyAction(s).id,'home');assert.match(vaultObjective(s),/EXTRACT/);assert.equal(actionTarget(s,{id:'home'}).x,3920);assert.equal(missionRelays(newMischief({vaultMission:true})).length,2);
});
test('annex vents and boundary work and retry resets all seals',()=>{
 const s=newMischief({annexMission:true});for(let i=0;i<150;i++)stepMischief(s,{left:true});assert(s.x>=3880);s.x=4330;s.y=426;s.time=2.6;vaultHazards(s);assert.equal(s.deathReason,'steam');const fresh=newMischief({annexMission:true});assert.equal(fresh.status,'playing');assert.deepEqual(fresh.relays,[]);assert.equal(missionVents(fresh).length,3);
});

test('Annex caretaker patrols the playable yard, cover blocks sight and exposed players can be caught',async()=>{
 const {canSee}=await import('../public/mischief.mjs');const s=newMischief({annexMission:true});for(let i=0;i<300;i++)stepMischief(s,{});assert(s.caretaker.x>=4100&&s.caretaker.x<=5200);Object.assign(s,{x:4390,y:426,ground:true});Object.assign(s.caretaker,{x:4550,y:426,facing:-1});assert.equal(canSee(s),false);s.x=4510;Object.assign(s.caretaker,{target:4510,mode:'investigate',wait:2});assert.equal(canSee(s),true);for(let i=0;i<300&&s.status==='playing';i++)stepMischief(s,{});assert.equal(s.deathReason,'caught');
});
test('Annex flowerpot is reachable and distracts the local caretaker',()=>{const s=newMischief({annexMission:true});Object.assign(s,{x:4480,y:276,ground:true});Object.assign(s.caretaker,{x:4650,facing:1});assert.equal(nearbyAction(s).id,'pot');for(let i=0;i<100;i++)stepMischief(s,{interact:true});assert.equal(s.pot,'broken');assert(s.noise.some(n=>n.kind==='pot'&&n.x===4645));assert(s.caretaker.target>4000);});
for(const delay of [1.6,2.4,4])test(`Annex approach and full-haul escape tolerate a ${delay}s later start`,()=>{const s=newMischief({annexMission:true});annexEscape(()=>s,i=>stepMischief(s,i),{music:true,delay});assert.equal(s.status,'won');});
