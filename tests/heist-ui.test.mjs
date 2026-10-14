import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import manifest from '../dist/asset-manifest.mjs';
import {newHeist,stepHeist,retryEscape} from '../dist/heist.mjs';
import {RECORD_KEY} from '../dist/heist-records.mjs';
import {STEP} from '../dist/engine.mjs';
import {controlHeist} from './helpers/heist-controller.mjs';

test('heist UI completes, saves a clean record, retries escape, and restarts whole mission',async()=>{
 const html=fs.readFileSync(new URL('../dist/play.html',import.meta.url),'utf8'),nodes=new Map(),events=new Map(),saved=new Map();
 const gradient=()=>({addColorStop(){}}),ctx=new Proxy({createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});
 function element(tag='div',attrs=''){const classes=new Set();return {tagName:tag.toUpperCase(),hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),textContent:'',value:0,setAttribute(k,v){this[k]=v;},classList:{toggle(k,force){const on=force??!classes.has(k);on?classes.add(k):classes.delete(k);},contains:k=>classes.has(k)},getContext:()=>ctx,getBoundingClientRect:()=>({width:360,height:630}),focus(){document.activeElement=this;},setPointerCapture(){},click(){if(!this.disabled)return this.onclick?.();}};}
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g))nodes.set(m[3],element(m[1],m[2]));
 globalThis.document={hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id));return nodes.get(id);},body:element('body'),addEventListener:(t,cb)=>events.set('doc:'+t,cb)};
 globalThis.window={addEventListener:(t,cb)=>events.set(t,cb)};globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=cb=>events.set('raf',cb);globalThis.Image=class{set src(v){const m=Object.values(manifest).find(m=>v.endsWith(m.url));this.width=m.width;this.height=m.height;queueMicrotask(()=>this.onload());}};
 await import('../dist/play.mjs');await new Promise(resolve=>setImmediate(resolve));const get=id=>nodes.get(id);assert.equal(get('title').textContent,'Borrowed Sunshine.');get('play').click();
 let clock=0,acc=0,shadow=newHeist(),input={};const key=k=>({key:k,repeat:false,preventDefault(){}});
 function tick(command={}){events.get('keyup')(key('ArrowLeft'));events.get('keyup')(key('ArrowRight'));input.left=!!command.left;input.right=!!command.right;for(const [name,k] of [['left','ArrowLeft'],['right','ArrowRight'],['jump',' '],['dash','x']])if(command[name]){events.get('keydown')(key(k));input[name]=true;}
  const oldClock=clock;clock+=1000/60;events.get('raf')(clock);acc+=Math.min((clock-oldClock)/1000,.05);while(acc>=STEP){stepHeist(shadow,input);input.jump=false;input.dash=false;acc-=STEP;if(shadow.status!=='playing'){acc=0;break;}}
 }
 for(let i=0;i<3000&&shadow.status==='playing';i++)tick(controlHeist(shadow));assert.equal(shadow.status,'won');assert(JSON.parse(saved.get(RECORD_KEY)).completed);for(let i=0;i<45;i++)tick();assert.equal(get('title').textContent,'Home, a little brighter.');assert.equal(get('kicker').textContent,'A CLEAN HEIST');assert.equal(get('overlay').hidden,false);const record=JSON.parse(saved.get(RECORD_KEY));assert(record.bestClean>0&&record.completed);assert.equal(get('distance').value,100);
 get('practice').click();shadow=retryEscape(shadow);acc=0;input={};tick();assert.match(get('time').textContent,/PRACTICE ESCAPE/);assert.equal(get('overlay').hidden,true);
 for(let i=0;i<200&&shadow.status==='playing';i++)tick({left:true});assert.equal(shadow.status,'dead');for(let i=0;i<22;i++)tick();assert.equal(get('play').textContent,'Retry escape →');assert.equal(get('whole-run').hidden,false);assert.deepEqual(JSON.parse(saved.get(RECORD_KEY)),record);
 get('play').click();shadow=retryEscape(shadow);acc=0;input={};tick();assert.equal(get('overlay').hidden,true);assert.match(get('time').textContent,/PRACTICE ESCAPE/);events.get('blur')();const frozen=get('time').textContent;for(let i=0;i<10;i++){clock+=16.667;events.get('raf')(clock);}assert.equal(get('time').textContent,frozen);assert.equal(get('pause-actions').hidden,false);
 get('retry').click();clock+=16.667;events.get('raf')(clock);assert.match(get('objective').textContent,/RECOVER/);assert.match(get('time').textContent,/HEIST/);assert.equal(get('whole-run').hidden,true);
});
