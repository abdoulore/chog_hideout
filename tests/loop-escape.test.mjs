import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief,nearbyAction,lootValue,jobObjective} from '../public/mischief.mjs';
import {LOOP_GATE,LOOP_WARNING,ringLoopAlarm} from '../public/loop-escape.mjs';
import {approachSun,loopEscape} from './helpers/loop-driver.mjs';
const ticks=(s,n,input={})=>{for(let i=0;i<n&&s.status==='playing';i++)stepMischief(s,input);};

test('both complete escape choices work using real controls, including varied approach timing',()=>{
 for(const music of [false,true])for(const pause of [0,.2,.5]){const s=newMischief({loopTrial:true});loopEscape(()=>s,i=>stepMischief(s,i),{music,pause});assert.equal(s.status,'won');assert(s.loopReturnStarted);assert(s.loopGateClosed);assert.equal(lootValue(s),music?5:3);assert(s.platformDrops>=1);assert(s.dashes>=2);assert(!s.loot.includes('battery'));assert(s.time<25);}
});
test('alarm changes geometry after a warning, never closes on the player, and preserves the lower opening',()=>{
 const s=newMischief({loopTrial:true});assert(s.room.solids.some(p=>p.kind==='shutter'));ringLoopAlarm(s);assert.equal(s.loopWarning,LOOP_WARNING);s.x=LOOP_GATE.x;s.y=276;s.ground=true;s.loopWarning=0;ticks(s,1);assert.equal(s.loopGateClosed,false);assert.equal(s.status,'playing');
 s.x=1300;ticks(s,1);assert(s.loopGateClosed);assert(s.room.solids.some(p=>p.kind==='alarm-shutter'));assert(!s.room.solids.some(p=>p.kind==='shutter'));s.x=1230;s.y=276;s.vy=0;s.ground=true;ticks(s,15,{left:true});assert(s.x>=LOOP_GATE.x+LOOP_GATE.w,'upper gate blocks passage');
 s.x=1230;s.y=426;s.ground=true;s.vx=0;ticks(s,35,{left:true});assert(s.x<LOOP_GATE.x,'lower passage remains open');
});
test('alarm sends guard to a known junction; walking into him or dropping beside him loses the run',()=>{
 const walk=newMischief({loopTrial:true}),d=approachSun(()=>walk,i=>stepMischief(walk,i));assert.equal(walk.caretaker.target,1000);stepMischief(walk,{down:true});d.wait(.5);ticks(walk,300,{left:true});assert.equal(walk.status,'dead');assert.equal(walk.deathReason,'caught');assert.equal(walk.banked,false);
 const greed=newMischief({loopTrial:true}),step=i=>stepMischief(greed,i),g=approachSun(()=>greed,step);step({down:true});g.wait(.5);g.go(1140);g.go(890,{jump:true,dash:true});g.settle();g.wait(1.2,{interact:true});step({});assert(greed.loot.includes('music'));step({down:true});g.wait(1);assert.equal(greed.status,'dead');
});
test('Sun is required to exit; repeated pickup cannot reopen the shutter or duplicate the music box',()=>{
 const s=newMischief({loopTrial:true});s.x=110;s.loot=['music'];s.items.music.state='carried';assert.equal(nearbyAction(s),null);ringLoopAlarm(s);assert.equal(s.items.music.state,'carried');s.loopWarning=0;s.loopGateClosed=true;assert.equal(ringLoopAlarm(s),false);assert(s.loopGateClosed);assert.match(jobObjective(s),/RECOVER THE SUN/);s.loot.push('sun');assert.equal(nearbyAction(s).id,'home');
 const regular=newMischief();assert(!regular.loopTrial);assert.equal(regular.items.sun.y,460);assert.equal(regular.items.battery.state,'world');
});
