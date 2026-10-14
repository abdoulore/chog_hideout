import test from 'node:test';
import assert from 'node:assert/strict';
import {ROOMS,newRun,stepRun,STEP,simulateFight,cameraFrame,MOVEMENT_ROOM} from '../dist/engine.mjs';

test('all authored rooms can be completed with the published movement rules',()=>{
 for(const room of [...ROOMS,MOVEMENT_ROOM]){const s=newRun(room);for(let i=0;i<12000&&s.status==='playing';i++){const near=room.spikes.some(slot=>slot*50-s.x>15&&slot*50-s.x<80);const nearGap=room.gaps.some(g=>g.x-s.x>15&&g.x-s.x<45);const dash=room.gaps.some(g=>g.w>200&&s.x>g.x+5&&s.x<g.x+150&&!s.ground&&s.y<400)&&s.dashCooldown===0;stepRun(s,{right:true,jump:s.ground&&(near||nearGap),dash},STEP);}assert.equal(s.status,'won',room.name);assert(s.coins>0);}
});
test('wide gaps require an airborne dash; dash spam respects cooldown and restart clears it',()=>{
 const room={width:1400,platforms:[],orbs:[],spikes:[],gaps:[{x:500,w:240}]};
 const cross=dash=>{const s=newRun(room);s.x=459;for(let i=0;i<700&&s.status==='playing';i++)stepRun(s,{right:true,jump:i===0,dash:dash&&s.x>505&&s.x<650&&s.dashCooldown===0});return s;};
 assert.equal(cross(false).status,'dead');assert.equal(cross(false).deathReason,'gap');assert.equal(cross(true).status,'won');
 const s=newRun({width:5000,platforms:[],orbs:[],spikes:[]});for(let i=0;i<100;i++)stepRun(s,{right:true,dash:true});assert.equal(s.dashes,1);assert(s.dashCooldown>0);assert.equal(newRun(room).dashCooldown,0);
});
test('walking into spikes fails; completed runs do not keep accumulating time',()=>{
 for(const room of [...ROOMS,MOVEMENT_ROOM]){const s=newRun(room);for(let i=0;i<1000&&s.status==='playing';i++)stepRun(s,{right:true});assert.equal(s.status,'dead');const time=s.time;stepRun(s,{right:true,jump:true});assert.equal(s.time,time);}
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

// A sweep catches the narrow successful trajectory that hid the original mobile fairness defect.
test('all wide crossings accept 35 different jump positions/timings and retain recovery space',()=>{
 for(const room of [...ROOMS,MOVEMENT_ROOM])for(const gap of room.gaps.filter(g=>g.w>200)){
  const landing=gap.x+gap.w;const nextSpike=Math.min(...room.spikes.filter(n=>n*50>=landing).map(n=>n*50+10));assert(nextSpike-landing>=200);
  for(const offset of [-80,-65,-50,-35,-20])for(const delay of [.06,.12,.18,.24,.3,.36,.42]){
   const s=newRun(room);s.x=gap.x+offset;let safe=false;
   for(let i=0;i<250&&s.status==='playing';i++){stepRun(s,{right:true,jump:i===0,dash:i===Math.round(delay/STEP)});if(i>10&&s.ground&&s.x+14>=landing){safe=true;break;}}
   assert(safe,`${room.name} gap ${gap.x}, offset ${offset}, dash ${delay}`);
  }
 }
});
test('camera keeps the gap and first safe landing visible before committing on mobile and desktop',()=>{
 for(const room of [...ROOMS,MOVEMENT_ROOM])for(const gap of room.gaps.filter(g=>g.w>200))for(const width of [360,600,900]){
  const s=newRun(room);s.x=gap.x-80;const c=cameraFrame(s,width),right=c.x+900/c.zoom;
  assert(c.x<=s.x);assert(right>=gap.x+gap.w+80);assert(c.x>=0);assert(right<=room.width+.001);
 }
});
test('dash briefly holds height and cannot grant spike immunity',()=>{
 const s=newRun({width:2000,platforms:[],spikes:[],orbs:[]});s.y=300;s.vy=80;s.ground=false;stepRun(s,{right:true,dash:true});const y=s.y;for(let i=0;i<10;i++)stepRun(s,{right:true});assert.equal(s.y,y);
 const trap=newRun({width:2000,platforms:[],spikes:[3],orbs:[]});trap.x=125;for(let i=0;i<20&&trap.status==='playing';i++)stepRun(trap,{right:true,dash:i===0});assert.equal(trap.status,'dead');assert.equal(trap.deathReason,'spikes');
});
test('collectibles are awarded once per run',()=>{
 const s=newRun({width:2000,platforms:[],spikes:[],orbs:[{x:70,y:443}]});for(let i=0;i<30;i++)stepRun(s,{});assert.equal(s.coins,1);
});
