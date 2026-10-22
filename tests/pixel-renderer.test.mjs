import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {pixelLayout} from '../public/pixel-renderer/camera.mjs';
import {actorFrames,PIXEL_KEYS} from '../public/pixel-renderer/model.mjs';
import {newMischief} from '../public/mischief.mjs';
import {projectTarget} from '../public/mischief-target.mjs';
test('pixel camera keeps portrait approach and landing visible at integer device scale',()=>{
 for(const [w,h,dpr] of [[390,844,3],[360,740,1],[844,390,3],[1280,720,1]]){
 const run={...newMischief(),x:420,pixelRenderer:true,cameraBias:.2};const l=pixelLayout(run,w*dpr,h*dpr);
 assert(Number.isInteger(l.camera.zoom));assert(Number.isInteger(l.camera.x));assert(l.nativeW>=360);
 assert(l.camera.x<run.x);assert(l.camera.x+l.nativeW>580);
 const p=projectTarget(run,{id:'battery'},{width:w*dpr,height:h*dpr,displayWidth:w,displayHeight:h,cameraBias:.2});
 assert.equal(p.x,(444-l.camera.x)*l.camera.zoom/dpr);assert(p.y>0&&p.y<h);
 }
});
test('pixel actor poses distinguish alert chase search and airborne frames',()=>{const s=newMischief();s.caretaker.mode='chase';s.caretaker.notice=0;assert(actorFrames(s).care>=9);s.caretaker.notice=.4;assert.equal(actorFrames(s).care,8);s.caretaker.notice=0;s.caretaker.mode='search';s.caretaker.moving=false;assert([6,7].includes(actorFrames(s).care));s.ground=false;s.vy=-100;assert.equal(actorFrames(s).chog,4);s.vy=100;assert.equal(actorFrames(s).chog,5);});
test('pixel assets fit frames and stay within budget',()=>{let size=0;for(const name of readdirSync('public/pixel'))size+=statSync('public/pixel/'+name).size;assert(size<400*1024);for(const key of PIXEL_KEYS){const b=readFileSync('public/pixel/'+key+'.png');assert(b.readUInt32BE(16)>0);if(key==='chog')assert.equal(b.readUInt32BE(16),48*8);if(key==='care')assert.equal(b.readUInt32BE(16),48*13);if(key==='planter')assert(b.readUInt32BE(20)>=80);}});

test('encounter cues distinguish missing cells, returnable cells and actual guard warnings',async()=>{const {encounterCues,pixelMotion}=await import('../public/pixel-renderer/model.mjs');const s=newMischief();assert.equal(encounterCues(s).socket,'CELL CONNECTED');s.powered=false;assert.equal(encounterCues(s).socket,'CELL MISSING');s.loot=['battery'];assert.equal(encounterCues(s).socket,'RETURN CELL');s.caretaker.mode='chase';s.caretaker.notice=.3;assert.equal(encounterCues(s).guard,'! SPOTTED');s.caretaker.notice=0;s.caretaker.roofWatch=true;assert.equal(encounterCues(s).guard,'! WATCHING LANDING');s.x=1110;s.y=426;s.caretaker.visible=false;assert.equal(encounterCues(s).cover,'SIGHT BLOCKED');s.caretaker.visible=true;assert.equal(encounterCues(s).cover,null);assert.deepEqual(pixelMotion(s,{},true),{x:0,y:0});});
test('pixel vault distinguishes source, install, retrieve and restored states',async()=>{const {vaultCues}=await import('../public/pixel-renderer/vault.mjs');const s=newMischief({vaultMission:true});assert.equal(vaultCues(s).destination,'INSTALL CELL');s.loot=['battery'];assert.equal(vaultCues(s).source,'CELL TAKEN');s.vaultOpen=true;s.items.battery.state='vault';assert.equal(vaultCues(s).destination,'CELL INSTALLED');s.loopAlarm=true;assert.equal(vaultCues(s).destination,'RETRIEVE CELL');s.loopGateClosed=true;assert.match(vaultCues(s).door,/EXIT BELOW/);s.powerRestored=true;assert.equal(vaultCues(s).source,'LIFT RESTORED');});
