import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief} from '../public/mischief.mjs';
import {stepRun,STEP,MOVE,FLOOR} from '../public/engine.mjs';
import {createFeedback,snapshot} from '../public/feedback.mjs';
import {chogPose} from '../public/chog-motion.mjs';
const tick=(s,input={},n=1)=>{for(let i=0;i<n;i++)stepRun(s,input);};

test('air jump is opt-in, weaker, once per flight, edge triggered, and recharged only by landing',()=>{
 const normal=newMischief();tick(normal,{jump:true});tick(normal,{},30);tick(normal,{jump:true});assert.equal(normal.airJumps,0);
 const s=newMischief({movementTrial:'double'});tick(s,{jump:true},30);assert.equal(s.airJumps,0);tick(s);tick(s,{jump:true});assert.equal(s.airJumps,1);assert.equal(s.vy,-MOVE.airJump+MOVE.gravity*STEP);assert(s.airJumpUsed);
 tick(s,{},10);const vy=s.vy;tick(s,{jump:true});assert(s.vy>vy);assert.equal(s.airJumps,1);
 tick(s,{},150);assert(s.ground);assert.equal(s.airJumpUsed,false);tick(s,{jump:true});tick(s,{},20);tick(s,{jump:true});assert.equal(s.airJumps,2);
});
test('walking off a roof retains one recovery jump; jumping out of dash does not reset its cooldown',()=>{
 const s=newMischief({movementTrial:'double'});s.x=462;s.y=351;s.ground=false;s.coyote=0;tick(s,{},20);tick(s,{jump:true});assert.equal(s.airJumps,1);
 const d=newMischief({movementTrial:'double'});tick(d,{jump:true});tick(d,{},20);tick(d,{dash:true});const cooldown=d.dashCooldown;tick(d,{jump:true});assert.equal(d.airJumps,1);assert.equal(d.dashTime,0);assert(d.dashCooldown>0&&d.dashCooldown<cooldown);tick(d,{dash:true});assert.equal(d.dashes,1);
});
test('high perch is physically reachable with a timed air jump but not a street single jump; layout survives simulation',()=>{
 const single=newMischief({movementTrial:'single'}),double=newMischief({movementTrial:'double'});
 for(const s of [single,double]){s.x=210;tick(s,{jump:true});tick(s,{},42);tick(s,{jump:true});let landed=false;for(let i=0;i<120;i++){tick(s);if(s.ground&&s.y+34===310)landed=true;}assert.equal(landed,s===double);}
 stepMischief(double);assert(double.room.doubleJump);assert(double.room.platforms.some(p=>p.x===190&&p.y===310));
 const d=newMischief({movementTrial:'double'});d.x=230;d.y=276;d.ground=true;tick(d,{right:true,jump:true});tick(d,{right:true},20);tick(d,{right:true,dash:true});let crossed=false;for(let i=0;i<100;i++){tick(d,{right:true});if(d.ground&&d.x>500&&d.y+34===310)crossed=true;}assert(crossed,'jump + dash crosses from the perch to the canopy');assert.equal(d.airJumps,0,'dash crossing preserves air jump');
});
test('air jump during ascent produces one feedback event; reduced motion suppresses the flip',()=>{
 const s=newMischief({movementTrial:'double'});tick(s,{jump:true});tick(s,{},20);const before=snapshot(s);tick(s,{jump:true});const fx=createFeedback({random:()=>.5});assert.deepEqual(fx.observe(before,s),['air-jump']);assert(fx.state.particles.length>0);tick(s,{},10);assert(Math.abs(chogPose(s).angle)>1);assert.equal(chogPose(s,{},true).angle,0);
});
