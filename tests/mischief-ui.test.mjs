import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountMischief} from '../dist/mischief-play.mjs';
import {MISCHIEF_KEY} from '../dist/mischief-records.mjs';
import {driver,batteryRoute,allTreasuresRoute} from './helpers/mischief-driver.mjs';
function setup({store,artLoader=async()=>({city:{width:1400,height:788},roof:{},props:{},chog:{},sun:{},timber:{},shutter:{},caretaker:{}})}={}){
 const nodes=new Map(),events=new Map(),map=new Map();let doc;
 const gradient=()=>({addColorStop(){}}),ctx=new Proxy({createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});
 function element(tag,attrs=''){const classes=new Set();return {tagName:tag.toUpperCase(),hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),textContent:'',value:0,style:{},classList:{toggle(k,on){const yes=on??!classes.has(k);yes?classes.add(k):classes.delete(k);},contains:k=>classes.has(k)},setAttribute(k,v){this[k]=v;},getContext:()=>ctx,getBoundingClientRect:()=>({width:360,height:720}),focus(){doc.activeElement=this;},setPointerCapture(){},click(){if(!this.disabled)this.onclick?.();}};}
 const html=fs.readFileSync(new URL('../dist/mischief.html',import.meta.url),'utf8');for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g))nodes.set(m[3],element(m[1],m[2]));
 const surface=prefix=>({addEventListener:(t,fn)=>events.set(prefix+t,fn),removeEventListener:t=>events.delete(prefix+t)});doc={...surface('doc:'),hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id),id);return nodes.get(id);},body:element('body')};const audio={muted:false,plays:[],setMuted(v){this.muted=v;},pause(){},async unlock(){return true;},play(e){this.plays.push(e);}};
 const storage=store||{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)},app=mountMischief({doc,events:surface(''),store:storage,raf:cb=>events.set('raf',cb),media:()=>({matches:true}),artLoader,audio});let clock=0;
 const key=k=>({key:k,repeat:false,preventDefault(){}});function advance(){clock+=1000/120+.0001;events.get('raf')(clock);}function step(command={}){for(const k of ['ArrowLeft','ArrowRight','e'])events.get('keyup')(key(k));for(const [id,k] of [['left','ArrowLeft'],['right','ArrowRight'],['jump',' '],['dash','x'],['interact','e'],['drop','q']])if(command[id])events.get('keydown')(key(k));advance();}
 return {app,doc,audio,events,map,advance,get:id=>nodes.get(id),step,storage};
}

test('live screen supports touch hold, safe banking, one save, replay, map pause, blur and resume',async()=>{const ui=setup();await ui.app.ready;const {app,get,step}=ui;assert.equal(get('play').disabled,false);assert.equal(get('title').textContent,'One More Thing.');get('play').click();assert(ui.doc.body.classList.contains('playing'));const d=driver(()=>app.run,step);d.go(430);
 get('interact').onpointerdown({preventDefault(){},pointerId:1});for(let i=0;i<100;i++){// Run frames while the captured pointer is held, without synthesizing a key release.
 ui.advance();}
 get('interact').onpointerup();assert.deepEqual(app.run.loot,['battery']);assert.equal(app.run.powered,false);
 // Continue through the regular keyboard path; an elapsed-frame clamp keeps focus changes bounded.
 d.go(110);d.act();assert.equal(app.run.status,'won');assert.equal(JSON.parse(ui.map.get(MISCHIEF_KEY)).escapes,1);d.wait(1);for(let i=0;i<100;i++)step();assert.equal(get('return-home').hidden,false);assert.equal(get('overlay').hidden,false);assert.equal(JSON.parse(ui.map.get(MISCHIEF_KEY)).escapes,1);assert.match(get('title').textContent,/Home/);
 get('play').click();assert.deepEqual(app.run.loot,[]);get('map').click();assert.equal(app.paused,true);assert.equal(get('map-panel').hidden,false);const frozen=app.run.time;for(let i=0;i<30;i++)step({right:true});assert.equal(app.run.time,frozen);get('close-map').click();assert.equal(app.paused,false);step({right:true});ui.events.get('blur')();assert.equal(app.paused,true);assert.equal(get('overlay').hidden,false);get('play').click();assert.equal(app.paused,false);assert.equal(app.records.escapes,1);app.destroy();});

test('complete three-treasure route runs through the actual screen and survives a reload into saved records',async()=>{const ui=setup();await ui.app.ready;ui.get('play').click();const d=driver(()=>ui.app.run,ui.step);allTreasuresRoute(d,()=>ui.app.run,ui.step);assert.equal(ui.app.run.status,'won');assert.equal(ui.app.records.bestValue,6);assert(ui.audio.plays.includes('music'));const next=setup({store:ui.storage});await next.app.ready;assert.equal(next.app.records.bestValue,6);assert.equal(next.app.records.treasures.length,3);ui.app.destroy();next.app.destroy();});

test('blocked saving and missing artwork are reported without pretending a haul was saved',async()=>{const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},ui=setup({store:blocked});await ui.app.ready;ui.get('play').click();batteryRoute(driver(()=>ui.app.run,ui.step));for(let i=0;i<100;i++)ui.step();assert.match(ui.get('records').textContent,/Saving unavailable/);assert.equal(ui.get('return-home').hidden,false);ui.app.destroy();const failed=setup({artLoader:async()=>{throw Error('offline');}});await failed.app.ready;assert.equal(failed.get('asset-error').hidden,false);assert.equal(failed.get('play').disabled,true);failed.app.destroy();});
