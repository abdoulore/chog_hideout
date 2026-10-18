import test from 'node:test';
import assert from 'node:assert/strict';
import {newMischief} from '../public/mischief.mjs';
import {guardScreenDirection,captureExplanation} from '../public/mischief-target.mjs';
import {sceneLayout} from '../public/scene-layout.mjs';

test('guard edge warning follows actual portrait camera view, not world distance',()=>{
 const s=newMischief({loopTrial:true});s.x=1000;
 const opts={width:900,height:1800,displayWidth:360,cameraBias:.2};
 s.caretaker.x=870;assert.equal(guardScreenDirection(s,opts),-1,'nearby guard behind camera still needs a warning');
 s.caretaker.x=1300;assert.equal(guardScreenDirection(s,opts),0,'visible distant guard does not need an off-screen arrow');
 s.caretaker.x=1150;assert.equal(guardScreenDirection(s,{...opts,cameraBias:.8}),1,'turning left exposes danger on the other edge');
});
test('shutter warning height stays in the usable view in portrait and landscape',()=>{
 for(const [displayWidth,width,height,displayHeight] of [[360,900,1800,720],[800,900,506,450]]){
  const s=newMischief({loopTrial:true});s.x=1270;s.y=276;
  const l=sceneLayout(s,displayWidth,width,height);const y=(l.groundY+(260-460)*l.camera.zoom)*displayHeight/height;
  assert(y>100&&y<displayHeight-100,`warning should be clear of top and bottom controls: ${y}`);
 }
});
test('capture advice distinguishes dropping, aerial contact and street contact without inventing a cause',()=>{
 assert.match(captureExplanation({capture:{cause:'drop'}}),/dropped within/);
 assert.match(captureExplanation({capture:{cause:'air'}}),/jump passed too close/);
 assert.match(captureExplanation({capture:{cause:'street'}}),/street level/);
 assert.doesNotMatch(captureExplanation({}),/dropped|street level|jump passed/);
});
