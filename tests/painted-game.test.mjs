import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {artCamera,manifest} from '../dist/world-renderer.mjs';
import {MOVEMENT_ROOM,newRun} from '../dist/engine.mjs';

test('painted assets have valid atlas rectangles and stay below 1 MB together',()=>{
 let bytes=0;
 for(const m of Object.values(manifest)){
  bytes+=fs.statSync(new URL('../dist/'+m.url,import.meta.url)).size;
  for(const f of m.frames?Object.values(m.frames):m.frame?[m.frame]:[]){assert(f[0]>=0&&f[1]>=0&&f[2]>0&&f[3]>0);assert(f[0]+f[2]<=m.width);assert(f[1]+f[3]<=m.height);}
 }
 assert(bytes<1_000_000);
});
test('painted camera shows the gap and 80 units of landing at takeoff',()=>{
 for(const display of [360,600,900])for(const gap of MOVEMENT_ROOM.gaps){
  const run=newRun(MOVEMENT_ROOM);run.x=gap.x-80;const c=artCamera(run,display);
  assert(c.x+900/c.zoom>=gap.x+gap.w+80);assert(c.x<run.x);
 }
});
test('painted screen loads art, runs, pauses on blur, resumes and retries',async()=>{
 const html=fs.readFileSync(new URL('../dist/play.html',import.meta.url),'utf8'),nodes=new Map(),events=new Map();
 const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});
 function element(tag='div',attrs=''){
  const classes=new Set();return {tagName:tag.toUpperCase(),hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),textContent:'',value:0,setAttribute(k,v){this[k]=v;},classList:{toggle(k,force){const on=force??!classes.has(k);on?classes.add(k):classes.delete(k);return on;},contains:k=>classes.has(k)},getContext:()=>context,getBoundingClientRect:()=>({width:360,height:630}),focus(){document.activeElement=this;},setPointerCapture(){},click(){if(!this.disabled)return this.onclick?.();}};
 }
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g))nodes.set(m[3],element(m[1],m[2]));
 globalThis.document={hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id));return nodes.get(id);},body:element('body'),addEventListener:(t,cb)=>events.set('document:'+t,cb)};
 globalThis.window={addEventListener:(t,cb)=>events.set(t,cb)};globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=cb=>events.set('raf',cb);
 globalThis.Image=class{set src(v){const m=Object.values(manifest).find(m=>v.endsWith(m.url));this.width=m.width;this.height=m.height;queueMicrotask(()=>this.onload());}};
 const get=id=>nodes.get(id);assert(get('play').disabled);await import('../dist/play.mjs');await new Promise(resolve=>setImmediate(resolve));assert.equal(get('play').disabled,false);
 get('play').click();assert(get('overlay').hidden);get('right').onpointerdown({pointerId:1,preventDefault(){}});
 for(let i=0;i<20;i++)events.get('raf')(i*16.667);assert(get('distance').value>0);
 get('dash').onpointerdown({pointerId:2,preventDefault(){}});events.get('raf')(335);assert.match(get('dash-status').textContent,/\ds/);
 events.get('blur')();const time=get('time').textContent;for(let i=0;i<5;i++)events.get('raf')(400+i*16.667);assert.equal(get('time').textContent,time);assert.equal(get('overlay').hidden,false);
 get('play').click();assert(get('overlay').hidden);get('retry').click();events.get('raf')(500);assert(parseFloat(get('time').textContent)<.05);assert(get('distance').value<3);
 await get('focus').click();assert(document.body.classList.contains('focus'));
});
