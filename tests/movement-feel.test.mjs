import test from 'node:test';
import assert from 'node:assert/strict';
import {newRun,stepRun,MOVEMENT_ROOM,FLOOR,STEP} from '../dist/engine.mjs';
import {newMischief,stepMischief,landingTarget} from '../dist/mischief.mjs';
import {chogPose} from '../dist/chog-motion.mjs';
import {createFeedback,snapshot} from '../dist/feedback.mjs';
const advance=(s,input,n)=>{for(let i=0;i<n;i++)stepMischief(s,input);};

test('starts respond in the first step, reach speed quickly, brake within five units and reverse promptly',()=>{
 const s=newMischief(),x=s.x;stepMischief(s,{right:true});assert(s.x>x);assert(s.vx>0&&s.vx<265);
 advance(s,{right:true},8);assert.equal(s.vx,265);const stoppedAt=s.x;advance(s,{},5);assert.equal(s.vx,0);assert(s.x-stoppedAt<5);
 advance(s,{right:true},8);advance(s,{left:true},9);assert.equal(s.vx,-265);assert.equal(s.facing,-1);
 const old=newRun(MOVEMENT_ROOM);stepRun(old,{right:true});assert.equal(old.vx,265);
});

test('dash direction and speed are immediate even while reversing; cooldown prevents repeated firing',()=>{
 const s=newMischief();advance(s,{right:true},8);stepMischief(s,{left:true,dash:true});assert.equal(s.vx,-720);assert.equal(s.dashes,1);
 advance(s,{left:true,dash:true},24);assert.equal(s.dashes,1);assert.equal(s.vx,-265);
});

test('a roof lip narrowly missed can be caught, but a low jump and closed shutter cannot be bypassed',()=>{
 function nearLip(miss){const s=newMischief();s.x=272;s.y=385+miss-34;s.ground=false;s.vy=25;s.vx=265;s.coyote=0;return s;}
 const near=nearLip(7);stepMischief(near,{right:true});assert.equal(near.ground,true);assert.equal(near.y+34,385);assert(near.ledgeCatch>0);
 const low=nearLip(20);stepMischief(low,{right:true});assert.equal(low.ground,false);assert(low.y+34>385);
 const wall=newMischief();wall.x=540;advance(wall,{right:true,dash:true},40);assert(wall.x+28<=570);assert.equal(wall.y+34,FLOOR);
});

test('coyote and pre-landing jump buffer survive the movement profile',()=>{
 const late=newMischief();late.ground=false;late.coyote=.08;late.y=427;late.vy=15;stepMischief(late,{jump:true});assert(late.vy<0);
 const queued=newMischief();queued.y=418;queued.vy=200;queued.ground=false;queued.coyote=0;stepMischief(queued,{jump:true});advance(queued,{},10);assert(queued.vy<0);assert(queued.y<418);
});

test('the caretaker telegraphs a pursuit and leads visible airborne motion',()=>{
 const s=newMischief();s.x=1300;s.y=276;s.vx=265;s.ground=false;s.caretaker.x=1190;s.caretaker.facing=1;s.caretaker.suspicion=.999;
 const origin=s.caretaker.x;stepMischief(s,{right:true});assert.equal(s.caretaker.mode,'chase');assert(s.caretaker.notice>.5);assert.equal(s.caretaker.x,origin);assert(s.caretaker.target>s.x+50);assert.equal(s.caretaker.roofWatch,true);
 assert(landingTarget(s)>s.x);advance(s,{right:true},30);assert.equal(s.caretaker.x,origin);advance(s,{right:true},40);assert(s.caretaker.x>origin);
});

test('breaking sight stops live target updates; dropped music can then redirect pursuit',()=>{
 const s=newMischief();s.x=1000;s.caretaker.x=1220;s.caretaker.facing=-1;s.caretaker.mode='chase';s.caretaker.suspicion=1;s.caretaker.search=3.2;s.caretaker.lastSeen=1100;s.caretaker.target=1100;
 s.items.music.state='world';s.items.music.x=1430;s.items.music.y=FLOOR;s.items.music.playing=true;s.musicAt=0;
 advance(s,{},80);assert.equal(s.caretaker.visible,false);assert.equal(s.caretaker.mode,'investigate');assert.equal(s.caretaker.target,1430);assert.notEqual(s.caretaker.target,s.x);
});

test('taking an item produces a single physical pickup reaction; reduced motion removes deformation',()=>{
 const s=newMischief(),f=createFeedback();s.x=430;let pulses=0;
 for(let i=0;i<100;i++){const before=snapshot(s);stepMischief(s,{interact:true});f.observe(before,s);if(f.state.pluck===.35)pulses++;f.update(STEP);}
 assert.equal(pulses,1);assert.deepEqual(s.loot,['battery']);
 const moving={...s,vx:265,action:null};const pose=chogPose(moving,{stride:1,turn:.08,land:.08},true);assert.deepEqual({...pose,frame:0},{frame:0,x:0,y:0,angle:0,sx:1,sy:1});
 const lively=chogPose(moving,{stride:1,turn:.08});assert(lively.y<0);assert.notEqual(lively.angle,0);
});
