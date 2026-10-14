import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneLayout,sceneCamera,cameraBiasFor} from '../dist/scene-layout.mjs';
import {newHeist,HEIST} from '../dist/heist.mjs';

test('portrait framing preserves gap plus 80 units of landing on entry and escape',()=>{
 for(const [display,height] of [[320,1500],[360,1575],[412,1605],[500,1440]])for(const phase of ['entry','escape']){
  const s=newHeist();s.phase=phase;s.x=phase==='entry'?HEIST.bridge.x-80:HEIST.bridge.x+HEIST.bridge.w+80;
  const c=sceneCamera(s,display,900,height);
  if(phase==='entry')assert(c.x+900/c.zoom>=HEIST.bridge.x+HEIST.bridge.w+80);else assert(c.x<=HEIST.bridge.x-80);
 }
});
test('portrait camera keeps enlarged character below the HUD through bypass jumps',()=>{
 for(const [display,cssHeight] of [[320,430],[360,520],[360,630],[412,740],[500,800]]){
  const height=Math.max(430,Math.min(1900,Math.round(900*cssHeight/display))),s=newHeist();s.phase='escape';s.x=1820;
  for(const feet of [460,380,300,197]){s.y=feet-34;const l=sceneLayout(s,display,900,height),top=(l.groundY+(feet-460)*l.camera.zoom-l.characterHeight*l.camera.zoom)*cssHeight/height;assert(top>=101,JSON.stringify({display,cssHeight,feet,top}));}
  s.y=426;const floor=sceneLayout(s,display,900,height).groundY*cssHeight/height;assert(cssHeight-112-floor>=24);
 }
});
test('mobile subject gains presence while landscape keeps its existing scale',()=>{
 const s=newHeist(),phone=sceneLayout(s,360,900,1575),wide=sceneLayout(s,900,900,520);
 assert(phone.characterHeight*phone.camera.zoom*360/900>=56);assert.equal(wide.characterHeight,74);assert.equal(wide.camera.zoom,1.2);
 assert(cameraBiasFor('escape',360,900,1575)>cameraBiasFor('escape',900,900,520));
});
