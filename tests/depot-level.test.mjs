import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,lootValue,nearbyAction,jobObjective} from '../public/mischief.mjs';
import {sceneLayout} from '../public/scene-layout.mjs';
import {loopGate} from '../public/loop-escape.mjs';
import {captureExplanation} from '../public/mischief-target.mjs';
import {depotApproach,depotEscape} from './helpers/depot-driver.mjs';
const tick=(s,input={},n=1)=>{for(let i=0;i<n&&s.status==='playing';i++)stepMischief(s,input);};
const fresh=()=>newMischief({loopTrial:true,extendedLoop:true});

test('high and lower approaches both escape, with and without optional music, across approach timings',()=>{
 for(const high of [false,true])for(const music of [false,true])for(const pause of [0,.3]){const s=fresh();depotEscape(()=>s,i=>stepMischief(s,i),{high,music,pause});assert.equal(s.status,'won');assert.equal(lootValue(s),music?5:3);assert(s.loopReturnStarted&&s.loopGateClosed);assert(s.time>17&&s.time<30);assert(s.platformDrops>0);}
});
test('service walk traps are real hazards and failure advice identifies them',()=>{
 const s=fresh(),d=depotApproach(()=>s,i=>stepMischief(s,i));tick(s,{down:true});d.wait(.5);tick(s,{left:true},400);assert.equal(s.status,'dead');assert.equal(s.deathReason,'spikes');assert.match(captureExplanation(s),/marked spike trap/);assert(!s.banked);
});
test('a missed high perch lands on its lower recovery ledge',()=>{
 const s=fresh();Object.assign(s,{x:1690,y:276,vy:80,ground:false});tick(s,{},80);assert.equal(s.status,'playing');assert(s.ground);assert.equal(s.y+34,385);
});
test('far-wing drops remain nearby and recoverable instead of teleporting to the old world boundary',()=>{
 const s=fresh();s.x=2390;s.y=276;s.ground=true;s.loot=['sun'];s.items.sun.state='carried';tick(s,{drop:true});assert(s.items.sun.x>2300);assert.equal(s.items.sun.y,310);assert.equal(s.items.sun.state,'world');tick(s,{},40);assert.equal(nearbyAction(s)?.id,'sun');tick(s,{interact:true},90);assert(s.loot.includes('sun'));assert.equal(loopGate(s).x,2220);
});
test('depot crossing, landing and trap warnings fit portrait look-ahead, and objectives follow the stage',()=>{
 const s=fresh();s.x=2030;s.y=276;s.cameraBias=.2;const l=sceneLayout(s,360,900,1800);assert(l.camera.x+900/l.camera.zoom>=2360);assert.match(jobObjective(s),/HIGH ROOFS/);
 s.loopAlarm=true;s.loopWarning=0;s.loot=['sun'];s.x=2070;s.y=426;s.cameraBias=.8;const r=sceneLayout(s,360,900,1800);assert(r.camera.x<1760,'both service-walk hazard positions fit the leftward view');assert.match(jobObjective(s),/JUMP THE TRAPS/);
 const short=newMischief({loopTrial:true});assert.equal(short.room.width,1720);assert.equal(short.room.spikes.length,0);assert.equal(short.items.sun.x,1370);
});
