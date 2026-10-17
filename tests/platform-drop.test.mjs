import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief,stepMischief} from '../public/mischief.mjs';
import {canDropPlatform,stepRun,FLOOR} from '../public/engine.mjs';
import {createGestureInput} from '../public/gesture-input.mjs';
const tick=(s,input={},n=1)=>{for(let i=0;i<n;i++)stepRun(s,input);};
function onRoof(mode='double'){const s=newMischief({movementTrial:mode});Object.assign(s,{x:340,y:351,ground:true});return s;}

test('platform drop is opt-in, leaves loot alone, ignores only the supporting roof, and lands below',()=>{
 const s=onRoof();s.loot=['battery'];s.room.platforms.push({x:300,y:425,w:160,h:12});assert(canDropPlatform(s));tick(s,{down:true});assert(!s.ground);assert(s.vy>0);assert.equal(s.platformDrops,1);assert.equal(s.coyote,0);assert.deepEqual(s.loot,['battery']);tick(s,{down:true},80);assert(s.ground);assert.equal(s.y+34,425);assert.equal(s.platformDrops,1,'holding down must not drop through the next platform');tick(s);tick(s,{down:true});tick(s,{},100);assert.equal(s.y+34,FLOOR);
 const normal=onRoof(null);tick(normal,{down:true},40);assert.equal(normal.y+34,385);assert.equal(normal.platformDrops,0);
});
test('solid ground, shutter tops and airborne swipes do not drop; the shutter still blocks a falling player',()=>{
 const s=newMischief({movementTrial:'double'});tick(s,{down:true},30);assert(s.ground);assert.equal(s.y+34,FLOOR);assert.equal(s.platformDrops,0);
 tick(s);tick(s,{jump:true});const normal=structuredClone(s);tick(s,{down:true},12);tick(normal,{},12);assert.equal(s.y,normal.y);assert.equal(s.vy,normal.vy,'no fast fall yet');
 const gate=onRoof();gate.x=575;gate.y=276;tick(gate,{down:true});tick(gate,{},50);assert.equal(gate.y+34,330);assert(!canDropPlatform(gate));tick(gate,{down:true},50);assert.equal(gate.y+34,330);
});
test('moving lift drops do not reattach; ledge assist cannot catch the deliberately ignored lip',()=>{
 const lift=onRoof();lift.x=1050;lift.y=lift.liftY-34;stepMischief(lift,{down:true});assert(!lift.ground);for(let i=0;i<80;i++)stepMischief(lift);assert.equal(lift.y+34,FLOOR);assert.equal(lift.platformDrops,1);
 const edge=onRoof();edge.x=280;tick(edge,{down:true,right:true});assert(!edge.ground);assert.equal(edge.ledgeCatch,0);tick(edge,{right:true},8);assert(edge.y+34>385);
});
test('dropping cancels a buffered jump and dash without refreshing cooldown, and air recovery remains available',()=>{
 const s=onRoof();s.jumpBuffer=.1;s.dashTime=.15;s.dashCooldown=.8;s.airJumpUsed=false;tick(s,{down:true});assert.equal(s.jumpBuffer,0);assert.equal(s.dashTime,0);assert(s.dashCooldown>0);assert.equal(s.airJumps,0);tick(s);tick(s,{jump:true});assert.equal(s.airJumps,1);assert(s.vy<0);
});
test('downward gesture fires once, locks direction, and ignores slow/ambiguous/cancelled motions',()=>{
 const actions=[],g=createGestureInput({bounds:()=>({width:360,height:720}),onDown:()=>actions.push('down'),onJump:()=>actions.push('jump'),onDash:()=>actions.push('dash')});const e=(id,x,y,t)=>({pointerId:id,clientX:x,clientY:y,timeStamp:t,preventDefault(){}});
 g.down(e(1,270,550,0));g.move(e(1,272,580,40));g.move(e(1,320,590,60));g.up(e(1,320,620,80));assert.deepEqual(actions,['down']);
 g.down(e(2,270,550,100));g.move(e(2,300,580,140));g.cancel(e(2,300,590,150));g.down(e(3,270,550,200));g.move(e(3,270,600,600));g.up(e(3,270,600,620));assert.deepEqual(actions,['down']);
 g.down(e(4,270,550,700));g.move(e(4,270,520,730));g.up(e(4,270,600,800));assert.deepEqual(actions,['down','jump']);
});
