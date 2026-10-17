import test from 'node:test';
import assert from 'node:assert/strict';
import {newHeist,stepHeist,retryEscape,HEIST,HEIST_ROOMS,missionProgress} from '../public/heist.mjs';
import {STEP,FLOOR} from '../public/engine.mjs';
import {artCamera} from '../public/world-renderer.mjs';
import {emptyRecords,recordFinish,readRecords,writeRecords,RECORD_KEY} from '../public/heist-records.mjs';
import {controlHeist} from './helpers/heist-controller.mjs';
function escape(){const s=newHeist();s.x=HEIST.vault;stepHeist(s,{});assert.equal(s.phase,'escape');return retryEscape(s);}
function finish(s,plan={}){for(let i=0;i<8000&&s.status==='playing';i++)stepHeist(s,controlHeist(s,plan));return s;}

test('continuous heist returns home with Sun through both roof steps',()=>{
 const s=newHeist(),levels=new Set();for(let i=0;i<8000&&s.status==='playing';i++){stepHeist(s,controlHeist(s));if(s.phase==='escape'&&s.ground)levels.add(s.y+34);}
 assert.equal(s.status,'won');assert.equal(s.clean,true);assert(s.hasSun&&s.checkpoint);assert(levels.has(380)&&levels.has(300));assert(s.escapeTime>0&&s.escapeTime<s.time);assert.equal(missionProgress(s),100);
 const before=JSON.stringify(s);stepHeist(s,{right:true,jump:true,dash:true});assert.equal(JSON.stringify(s),before);
});
test('vault and home triggers require the correct grounded objective state',()=>{
 const s=newHeist();s.x=2800;stepHeist(s,{});assert.equal(s.status,'playing');assert.equal(s.hasSun,false);
 s.x=HEIST.vault;s.y=370;s.ground=false;stepHeist(s,{});assert.equal(s.phase,'entry');s.x=100;s.y=426;s.ground=true;stepHeist(s,{});assert.equal(s.status,'playing');
 s.x=HEIST.vault;s.y=426;s.ground=true;stepHeist(s,{});assert.equal(s.phase,'escape');assert(s.hasSun);const cp=JSON.stringify(s.checkpoint);stepHeist(s,{});assert.equal(JSON.stringify(s.checkpoint),cp);
});
test('bridge is supported on entry and lethal to walk across after pickup',()=>{
 const s=newHeist();s.x=835;for(let i=0;i<150;i++)stepHeist(s,{right:true});assert.equal(s.status,'playing');assert(s.x>1100);assert(s.ground);
 const r=escape();r.x=1180;for(let i=0;i<250&&r.status==='playing';i++)stepHeist(r,{left:true});assert.equal(r.deathReason,'gap');
});
test('shutter blocks walking and dashing from either side; bypass tolerates 16 takeoff combinations',()=>{
 for(const side of ['left','right']){const r=escape();r.x=side==='left'?1805:1690;r.facing=side==='left'?-1:1;for(let i=0;i<60;i++)stepHeist(r,{[side]:true,dash:i===0});assert(side==='left'?r.x>=1790:r.x+28<=1730);assert.equal(r.status,'playing');}
 for(const low of [2160,2180,2210,2240])for(const high of [1930,1960,1980,2010]){const r=finish(escape(),{low,high});assert.equal(r.status,'won',JSON.stringify({low,high,x:r.x,y:r.y,why:r.deathReason}));}
});
test('leftward dash crossing accepts 35 sampled takeoffs and delays',()=>{
 for(const distance of [20,35,50,65,80])for(const delay of [.06,.12,.18,.24,.30,.36,.42]){
  const r=escape();r.x=1100+distance;let dashed=false,landed=false;
  for(let i=0;i<240&&r.status==='playing';i++){const dash=!dashed&&i*STEP>=delay;if(dash)dashed=true;stepHeist(r,{left:true,jump:i===0,dash});if(i>10&&r.ground){landed=true;break;}}
  assert(landed&&r.x<880&&r.status==='playing',JSON.stringify({distance,delay,x:r.x,why:r.deathReason}));
 }
});
test('escape checkpoint resets movement, timer, effects history, collection and clean eligibility',()=>{
 const s=escape(),checkpoint=[...s.checkpoint.collected];s.collected.push(0);s.coins=7;s.x=1900;s.vx=-720;s.vy=100;s.dashCooldown=.7;s.dashTime=.1;s.time=90;s.escapeTime=20;s.status='dead';s.trail.push({x:1});
 const r=retryEscape(s);assert.equal(r.x,HEIST.vault);assert.equal(r.y,FLOOR-34);assert(r.ground&&r.hasSun&&!r.clean);assert.equal(r.phase,'escape');assert.equal(r.room,HEIST_ROOMS.escape);assert.equal(r.time,0);assert.equal(r.escapeTime,0);assert.equal(r.dashCooldown,0);assert.equal(r.dashTime,0);assert.equal(r.vx,0);assert.equal(r.vy,0);assert.equal(r.trail.length,0);assert.deepEqual(r.collected,checkpoint);
 r.checkpoint.collected.push(99);assert(!s.checkpoint.collected.includes(99));assert.equal(newHeist().clean,true);
});
test('camera exposes the required landing when travelling in either direction',()=>{
 for(const display of [360,600,900])for(const direction of ['entry','escape']){const s=newHeist();s.phase=direction;s.x=direction==='entry'?800:1180;const c=artCamera(s,display),right=c.x+900/c.zoom;if(direction==='entry')assert(right>=1180);else assert(c.x<=800);}
});
test('local clean and escape records remain separate and tolerate damaged storage',()=>{
 const clean=finish(newHeist()),practice=finish(escape());let r=recordFinish(emptyRecords(),practice);assert(r.completed);assert.equal(r.bestClean,null);assert.equal(r.bestEscape,practice.escapeTime);r=recordFinish(r,clean);assert.equal(r.bestClean,clean.time);
 assert.deepEqual(recordFinish(r,newHeist()),r);const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};assert(writeRecords(storage,r));assert.deepEqual(readRecords(storage),r);store.set(RECORD_KEY,'oops');assert.deepEqual(readRecords(storage),emptyRecords());assert.equal(writeRecords({setItem(){throw Error();}},r),false);
});
