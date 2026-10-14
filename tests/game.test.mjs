import test from 'node:test';
import assert from 'node:assert/strict';
import {ROOMS,newRun,stepRun,STEP,simulateFight} from '../dist/engine.mjs';

test('all authored rooms can be completed with the published movement rules',()=>{
 for(const room of ROOMS){const s=newRun(room);for(let i=0;i<12000&&s.status==='playing';i++){const near=room.spikes.some(slot=>slot*50-s.x>15&&slot*50-s.x<80);const nearGap=room.gaps.some(g=>g.x-s.x>15&&g.x-s.x<45);const dash=room.gaps.some(g=>g.w>200&&s.x>g.x+5&&s.x<g.x+150&&!s.ground&&s.y<400)&&s.dashCooldown===0;stepRun(s,{right:true,jump:s.ground&&(near||nearGap),dash},STEP);}assert.equal(s.status,'won',room.name);assert.equal(s.coins,room.orbs.length);}
});
test('wide gaps require an airborne dash; dash spam respects cooldown and restart clears it',()=>{
 const room={width:1400,platforms:[],orbs:[],spikes:[],gaps:[{x:500,w:240}]};
 const cross=dash=>{const s=newRun(room);s.x=459;for(let i=0;i<700&&s.status==='playing';i++)stepRun(s,{right:true,jump:i===0,dash:dash&&s.x>505&&s.x<650&&s.dashCooldown===0});return s;};
 assert.equal(cross(false).status,'dead');assert.equal(cross(false).deathReason,'gap');assert.equal(cross(true).status,'won');
 const s=newRun({width:5000,platforms:[],orbs:[],spikes:[]});for(let i=0;i<100;i++)stepRun(s,{right:true,dash:true});assert.equal(s.dashes,1);assert(s.dashCooldown>0);assert.equal(newRun(room).dashCooldown,0);
});
test('walking into spikes fails; completed runs do not keep accumulating time',()=>{
 for(const room of ROOMS){const s=newRun(room);for(let i=0;i<1000&&s.status==='playing';i++)stepRun(s,{right:true});assert.equal(s.status,'dead');const time=s.time;stepRun(s,{right:true,jump:true});assert.equal(s.time,time);}
});
test('custom layouts use the same collision and completion rules',()=>{
 const s=newRun({name:'Custom',platforms:[],orbs:[],spikes:[4,8,12]});for(let i=0;i<2400&&s.status==='playing';i++){const near=s.room.spikes.some(slot=>slot*50-s.x>15&&slot*50-s.x<80);stepRun(s,{right:true,jump:s.ground&&near});}assert.equal(s.status,'won');
});
test('charger lesson: stamina management reduces waste; guarding changes the outcome',()=>{
 const reckless=simulateFight({threshold:-1,response:'strike',fallback:'strike'});
 const recover=simulateFight({threshold:3,response:'strike',fallback:'strike'});
 const guard=simulateFight({threshold:3,response:'guard',fallback:'strike'});
 assert.equal(reckless.result,'loss');assert(reckless.exhausted>0);assert.equal(recover.exhausted,0);assert.equal(guard.result,'win');assert(guard.blocked>0);
});
test('every opponent has a reachable win and all 144 configurations preserve legal state',()=>{
 for(const o of ['charger','turtle','switch']){let wins=0;for(const threshold of [-1,1,3,5])for(const response of ['strike','guard','recover'])for(const fallback of ['strike','guard','recover','patient']){const s=simulateFight({threshold,response,fallback},o);if(s.result==='win')wins++;assert(s.frames.length<=24);for(const f of s.frames){for(const p of [f.p,f.e]){assert(p.hp>=0);assert(p.stamina>=0&&p.stamina<=9);}}assert.deepEqual(s,simulateFight({threshold,response,fallback},o));}assert(wins>0,o);}
});
