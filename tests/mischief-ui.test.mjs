import {PIXEL_KEYS} from '../public/pixel-renderer/model.mjs';
import {vaultEscape} from './helpers/vault-driver.mjs';
import {depotEscape} from './helpers/depot-driver.mjs';
import test from 'node:test';
import {loopEscape,approachSun} from './helpers/loop-driver.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountMischief} from '../public/mischief-play.mjs';
import {freshTrial,saveTrial,loadTrial,TRIAL_KEY} from '../public/guild-trial.mjs';
import {MISCHIEF_KEY} from '../public/mischief-records.mjs';
import {driver,batteryRoute,allTreasuresRoute} from './helpers/mischief-driver.mjs';
function setup({store,search='',artLoader=async()=>({city:{width:1400,height:788},roof:{},props:{},chog:{},sun:{},timber:{},shutter:{},caretaker:{}})}={}){
 const nodes=new Map(),events=new Map(),map=new Map();let doc;
 const pixelArtLoader=async()=>Object.fromEntries(PIXEL_KEYS.map(key=>{const b=fs.readFileSync('public/pixel/'+key+'.png');return [key,{width:b.readUInt32BE(16),height:b.readUInt32BE(20)}];}));
 const gradient=()=>({addColorStop(){}}),ctx=new Proxy({canvas:{ownerDocument:{createElement:()=>({getContext:()=>ctx})}},createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});
 function element(tag,attrs=''){const classes=new Set();return {tagName:tag.toUpperCase(),hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),textContent:'',value:0,style:{},classList:{toggle(k,on){const yes=on??!classes.has(k);yes?classes.add(k):classes.delete(k);},contains:k=>classes.has(k)},setAttribute(k,v){this[k]=v;},getContext:()=>ctx,getBoundingClientRect:()=>({width:360,height:720}),focus(){doc.activeElement=this;},setPointerCapture(){},click(){if(!this.disabled)this.onclick?.();}};}
 const html=fs.readFileSync(new URL('../public/mischief.html',import.meta.url),'utf8');for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g))nodes.set(m[3],element(m[1],m[2]));
 const surface=prefix=>({addEventListener:(t,fn)=>events.set(prefix+t,fn),removeEventListener:t=>events.delete(prefix+t)});doc={...surface('doc:'),hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id),id);return nodes.get(id);},body:element('body')};const audio={muted:false,plays:[],setMuted(v){this.muted=v;},pause(){},async unlock(){return true;},play(e){this.plays.push(e);}};
 const storage=store||{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)},app=mountMischief({doc,events:surface(''),store:storage,raf:cb=>events.set('raf',cb),media:()=>({matches:true}),artLoader,pixelArtLoader,audio,search});let clock=0;
 const key=k=>({key:k,repeat:false,preventDefault(){}});function advance(){clock+=1000/120+.0001;events.get('raf')(clock);}function step(command={}){for(const k of ['ArrowLeft','ArrowRight','e'])events.get('keyup')(key(k));for(const [id,k] of [['left','ArrowLeft'],['right','ArrowRight'],['jump',' '],['dash','x'],['interact','e'],['drop','q'],['down','ArrowDown']])if(command[id])events.get('keydown')(key(k));advance();}
 return {app,doc,audio,events,map,advance,get:id=>nodes.get(id),step,storage};
}

test('live screen supports touch hold, safe banking, one save, replay, map pause, blur and resume',async()=>{const ui=setup();await ui.app.ready;const {app,get,step}=ui;assert.equal(get('play').disabled,false);assert.equal(get('title').textContent,'One More Thing.');get('play').click();assert(ui.doc.body.classList.contains('playing'));step();assert.equal(get('interact').disabled,false);assert.equal(get('action-label').textContent,'HOLD ACTION');assert.doesNotMatch(get('action-detail').textContent,/Hold E/);const d=driver(()=>app.run,step);d.go(430);assert.equal(get('action-label').textContent,'HOLD TO TAKE');assert.match(get('action-detail').textContent,/lift battery/);
 get('interact').onpointerdown({preventDefault(){},pointerId:1});for(let i=0;i<20;i++)ui.advance();get('interact').onpointercancel();ui.advance();assert.deepEqual(app.run.loot,[]);get('interact').onpointerdown({preventDefault(){},pointerId:2});for(let i=0;i<100;i++){// Run frames while the captured pointer is held, without synthesizing a key release.
 ui.advance();}
 get('interact').onpointerup();assert.deepEqual(app.run.loot,['battery']);assert.equal(app.run.powered,false);assert.equal(ui.audio.plays.filter(c=>c==='take-battery').length,1);assert.equal(ui.audio.plays.filter(c=>c==='pickup').length,0);
 // Continue through the regular keyboard path; an elapsed-frame clamp keeps focus changes bounded.
 d.go(110);d.act();assert.equal(app.run.status,'won');assert.equal(JSON.parse(ui.map.get(MISCHIEF_KEY)).escapes,1);d.wait(1);for(let i=0;i<100;i++)step();assert.equal(get('return-home').hidden,false);assert.equal(get('overlay').hidden,false);assert.equal(JSON.parse(ui.map.get(MISCHIEF_KEY)).escapes,1);assert.match(get('title').textContent,/Home/);
 get('play').click();assert.deepEqual(app.run.loot,[]);get('map').click();assert.equal(app.paused,true);assert.equal(get('map-panel').hidden,false);const frozen=app.run.time;for(let i=0;i<30;i++)step({right:true});assert.equal(app.run.time,frozen);get('close-map').click();assert.equal(app.paused,false);step({right:true});ui.events.get('blur')();assert.equal(app.paused,true);assert.equal(get('overlay').hidden,false);get('play').click();assert.equal(app.paused,false);assert.equal(app.records.escapes,1);app.destroy();});

test('complete three-treasure route runs through the actual screen and survives a reload into saved records',async()=>{const ui=setup();await ui.app.ready;ui.get('play').click();const d=driver(()=>ui.app.run,ui.step);allTreasuresRoute(d,()=>ui.app.run,ui.step);assert.equal(ui.app.run.status,'won');assert.equal(ui.app.records.bestValue,6);assert(ui.audio.plays.includes('music'));const next=setup({store:ui.storage});await next.app.ready;assert.equal(next.app.records.bestValue,6);assert.equal(next.app.records.treasures.length,3);ui.app.destroy();next.app.destroy();});

test('blocked saving and missing artwork are reported without pretending a haul was saved',async()=>{const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},ui=setup({store:blocked});await ui.app.ready;ui.get('play').click();batteryRoute(driver(()=>ui.app.run,ui.step));for(let i=0;i<100;i++)ui.step();assert.match(ui.get('records').textContent,/Saving unavailable/);assert.equal(ui.get('return-home').hidden,false);ui.app.destroy();const failed=setup({artLoader:async()=>{throw Error('offline');}});await failed.app.ready;assert.equal(failed.get('asset-error').hidden,false);assert.equal(failed.get('play').disabled,true);failed.app.destroy();});

test('gesture trial moves with one thumb, swipes up to jump and sideways to dash with the other, then cancels cleanly',async()=>{const ui=setup();await ui.app.ready;ui.get('play').click();assert.equal(ui.app.controlMode,'gestures');assert(ui.doc.body.classList.contains('gesture-mode'));const canvas=ui.get('canvas'),e=(id,x,y,t)=>({pointerId:id,clientX:x,clientY:y,timeStamp:t,pointerType:'touch',preventDefault(){},currentTarget:canvas});canvas.onpointerdown(e(1,60,650,0));canvas.onpointermove(e(1,100,650,30));for(let i=0;i<20;i++)ui.advance();assert(ui.app.run.x>90);canvas.onpointerdown(e(2,270,630,200));ui.advance();assert.equal(ui.app.run.ground,true);canvas.onpointermove(e(2,275,603,240));ui.advance();assert(ui.app.run.vy<0);canvas.onpointerup(e(2,275,590,250));const dashes=ui.app.run.dashes;canvas.onpointerdown(e(3,270,630,260));canvas.onpointermove(e(3,310,630,310));ui.advance();assert.equal(ui.app.run.dashes,dashes+1);assert.equal(ui.app.run.facing,1);canvas.onpointerup(e(3,320,630,330));canvas.onpointercancel(e(1,100,650,350));for(let i=0;i<70;i++)ui.advance();const x=ui.app.run.x;for(let i=0;i<20;i++)ui.advance();assert.equal(ui.app.run.x,x);ui.app.start();canvas.onpointerdown(e(4,60,650,500));canvas.onpointermove(e(4,100,650,520));canvas.onpointerdown(e(5,290,630,530));canvas.onpointermove(e(5,250,630,570));ui.advance();assert.equal(ui.app.run.facing,-1);assert(ui.app.run.vx<0);assert.equal(ui.app.run.ground,true);ui.events.get('blur')();assert.equal(ui.app.paused,true);ui.app.destroy();});

test('tapping a nearby object performs one steal, tapping the door banks, and button mode persists',async()=>{const ui=setup();await ui.app.ready;ui.get('play').click();const d=driver(()=>ui.app.run,ui.step);d.go(430);ui.step();assert.equal(ui.get('world-action').hidden,false);assert.equal(ui.get('world-action-label').textContent,'TAKE');ui.get('world-action').click();for(let i=0;i<150;i++)ui.advance();assert.deepEqual(ui.app.run.loot,['battery']);assert.equal(ui.app.run.powered,false);d.go(110);ui.step();assert.equal(ui.get('world-action-label').textContent,'GO HOME');ui.get('world-action').click();for(let i=0;i<90;i++)ui.advance();assert.equal(ui.app.run.status,'won');assert.equal(ui.app.records.escapes,1);ui.get('control-mode').onchange({target:{value:'buttons'}});assert.equal(ui.app.controlMode,'buttons');assert.equal(ui.doc.body.classList.contains('gesture-mode'),false);const next=setup({store:ui.storage});await next.app.ready;assert.equal(next.app.controlMode,'buttons');ui.app.destroy();next.app.destroy();});

test('tapping a carried item drops that exact item and moving away cancels an unfinished object action',async()=>{const ui=setup();await ui.app.ready;ui.get('play').click();const d=driver(()=>ui.app.run,ui.step);d.go(430);ui.step();ui.get('world-action').click();for(let i=0;i<15;i++)ui.advance();ui.step({left:true});for(let i=0;i<50;i++)ui.advance();assert.deepEqual(ui.app.run.loot,[]);const s=ui.app.run;s.loot=['sun','music'];s.items.sun.state='carried';s.items.music.state='carried';ui.step();assert.equal(ui.get('drop-sun').hidden,false);ui.get('drop-sun').click();ui.advance();assert.deepEqual(s.loot,['music']);assert.equal(s.items.sun.state,'world');assert.equal(s.items.music.state,'carried');ui.app.destroy();});


test('a real game escape records exactly one qualifier and returns an attributed result',async()=>{
 const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};saveTrial(store,freshTrial('integrated-event'));
 const ui=setup({store,search:'?trial=guild&event=integrated-event&seat=lantern-1&round=qualifiers'});await ui.app.ready;
 assert.equal(loadTrial(store).state.attempts.length,0);assert.equal(ui.get('trial-return').hidden,false);ui.get('play').click();assert.equal(loadTrial(store).state.attempts.length,1);
 batteryRoute(driver(()=>ui.app.run,ui.step));for(let i=0;i<100;i++)ui.step();const a=loadTrial(store).state.attempts[0];assert.equal(a.status,'banked');assert.equal(a.player,'lantern-1');assert.equal(a.value,1);assert.equal(a.ticks,Math.round(ui.app.run.time*120));assert.match(ui.get('trial-info').textContent,/Player rank 1/);assert.equal(loadTrial(store).state.attempts.length,1);ui.app.destroy();
});
test('retries and navigation abandon rehearsal attempts, while ordinary play never writes the event',async()=>{
 const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};saveTrial(store,freshTrial('integrated-event'));
 const ui=setup({store,search:'?trial=guild&event=integrated-event&seat=lantern-1&round=qualifiers'});await ui.app.ready;ui.app.start();ui.step({right:true});ui.app.start();let attempts=loadTrial(store).state.attempts;assert.deepEqual(attempts.map(a=>a.status),['abandoned','active']);ui.events.get('pagehide')();assert.equal(loadTrial(store).state.attempts[1].status,'abandoned');ui.app.destroy();
 const before=store.getItem(TRIAL_KEY),solo=setup({store});await solo.app.ready;solo.app.start();batteryRoute(driver(()=>solo.app.run,solo.step));solo.app.destroy();assert.equal(store.getItem(TRIAL_KEY),before);
});

test('double-jump playtest accepts two distinct upward swipes and cannot write personal or tournament results',async()=>{
 const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};saveTrial(store,freshTrial('jump-event'));const original=store.getItem(TRIAL_KEY);
 const ui=setup({store,search:'?movement=double&trial=guild&event=jump-event&seat=lantern-1&round=qualifiers'});await ui.app.ready;assert.equal(ui.get('jump-trial-panel').hidden,false);assert.match(ui.get('jump-trial-switch').href,/movement=single/);ui.app.start();
 const canvas=ui.get('canvas'),e=(id,x,y,t)=>({pointerId:id,clientX:x,clientY:y,timeStamp:t,pointerType:'touch',preventDefault(){},currentTarget:canvas});
 canvas.onpointerdown(e(1,270,630,0));canvas.onpointermove(e(1,270,600,40));ui.advance();canvas.onpointerup(e(1,270,590,60));for(let i=0;i<25;i++)ui.advance();
 canvas.onpointerdown(e(2,270,630,220));canvas.onpointermove(e(2,270,600,260));ui.advance();canvas.onpointerup(e(2,270,590,280));assert.equal(ui.app.run.airJumps,1);assert.match(ui.get('jump-trial-status').textContent,/USED/);
 for(let i=0;i<120;i++)ui.advance();assert.equal(ui.app.run.airJumpUsed,false);ui.app.start();batteryRoute(driver(()=>ui.app.run,ui.step));for(let i=0;i<100;i++)ui.step();assert.equal(ui.app.run.status,'won');assert.equal(map.has(MISCHIEF_KEY),false);assert.equal(store.getItem(TRIAL_KEY),original);assert.equal(ui.get('return-home').hidden,true);assert.match(ui.get('records').textContent,/No records/);ui.app.destroy();
 const single=setup({search:'?movement=single'});await single.app.ready;assert.equal(single.app.run.room.doubleJump,false);assert(single.app.run.room.platforms.some(p=>p.x===190));assert.match(single.get('jump-trial-switch').href,/movement=double/);single.app.destroy();
});

test('swipe down, keyboard and alternate button all drop through platforms without dropping carried loot',async()=>{
 const ui=setup({search:'?movement=double'});await ui.app.ready;ui.app.start();const roof=()=>Object.assign(ui.app.run,{x:340,y:351,ground:true,vx:0,vy:0,downHeld:false,dropThrough:[],loot:['music']});roof();ui.advance();assert.equal(ui.get('gesture-down-status').hidden,false);
 const canvas=ui.get('canvas'),e=(id,x,y,t)=>({pointerId:id,clientX:x,clientY:y,timeStamp:t,pointerType:'touch',preventDefault(){},currentTarget:canvas});canvas.onpointerdown(e(1,270,550,0));canvas.onpointermove(e(1,270,585,50));ui.advance();canvas.onpointerup(e(1,270,600,80));assert.equal(ui.app.run.platformDrops,1);assert.deepEqual(ui.app.run.loot,['music']);assert(!ui.app.run.ground);assert.equal(ui.get('gesture-down-status').hidden,true);
 for(let i=0;i<100;i++)ui.advance();roof();ui.advance();ui.events.get('keydown')({key:'ArrowDown',repeat:false,preventDefault(){}});ui.advance();assert.equal(ui.app.run.platformDrops,2);
 for(let i=0;i<100;i++)ui.advance();roof();ui.app.setControlMode('buttons');ui.advance();assert.equal(ui.get('down').hidden,false);assert.equal(ui.get('down').disabled,false);ui.get('down').onpointerdown({pointerId:2,preventDefault(){}});ui.advance();assert.equal(ui.app.run.platformDrops,3);assert.deepEqual(ui.app.run.loot,['music']);
 ui.app.pause();const y=ui.app.run.y;canvas.onpointerdown(e(3,270,550,300));canvas.onpointerup(e(3,270,590,350));ui.advance();assert.equal(ui.app.run.y,y);ui.app.destroy();
 const normal=setup();await normal.app.ready;assert.equal(normal.get('down').hidden,true);normal.app.destroy();
});


test('loop room plays through the real controller, explains its route and keeps results isolated',async()=>{
 const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};saveTrial(store,freshTrial('loop-event'));const saved=store.getItem(TRIAL_KEY);
 const ui=setup({store,search:'?route=loop&layout=short&trial=guild&event=loop-event&seat=lantern-1&round=qualifiers'});await ui.app.ready;
 assert.equal(ui.get('title').textContent,'The Sunloop.');assert.equal(ui.get('loop-trial-panel').hidden,false);assert.equal(ui.get('jump-trial-panel').hidden,true);assert.equal(ui.app.run.room.doubleJump,true);assert.match(ui.get('map-note-roofs').textContent,/Drop to the street/);
 ui.app.start();loopEscape(()=>ui.app.run,ui.step,{music:true});for(let i=0;i<100;i++)ui.step();assert.equal(ui.app.run.status,'won');assert.equal(ui.get('title').textContent,'One more, and out.');assert.equal(ui.get('haul-value').textContent,'5 / 5');assert.match(ui.get('records').textContent,/Loop escape playtest/);assert.equal(store.getItem(TRIAL_KEY),saved);assert.equal(map.has(MISCHIEF_KEY),false);
 ui.app.start();assert.equal(ui.app.run.loopAlarm,false);assert.equal(ui.app.run.loopGateClosed,false);assert.deepEqual(ui.app.run.loot,[]);ui.app.destroy();
});


test('capture screen reports the actual street capture and reset clears it',async()=>{
 const ui=setup({search:'?route=loop&layout=short'});await ui.app.ready;ui.app.start();const d=approachSun(()=>ui.app.run,ui.step);ui.step({down:true});d.wait(.5);for(let i=0;i<400&&ui.app.run.status==='playing';i++)ui.step({left:true});assert.equal(ui.app.run.status,'dead');assert.equal(ui.app.run.capture.cause,'street');for(let i=0;i<100;i++)ui.step();assert.match(ui.get('message').textContent,/street level/);assert.equal(ui.get('guard-direction').hidden,true);ui.app.start();assert.equal(ui.app.run.capture,undefined);ui.app.destroy();
});


test('default Sunloop opens the depot level, completes through the controller and offers the compact comparison',async()=>{
 const ui=setup({search:'?route=loop'});await ui.app.ready;assert.equal(ui.app.run.loopExtended,true);assert.equal(ui.app.run.room.width,2660);assert.match(ui.get('message').textContent,/service walk/);assert.match(ui.get('loop-layout-switch').href,/layout=short/);ui.app.start();depotEscape(()=>ui.app.run,ui.step,{music:true});for(let i=0;i<100;i++)ui.step();assert.equal(ui.app.run.status,'won');assert.equal(ui.get('haul-value').textContent,'5 / 5');assert.equal(ui.map.has(MISCHIEF_KEY),false);ui.app.openMap();assert.equal(ui.get('map-panel').hidden,false);ui.app.destroy();
});

test('Sunloop results compare separate haul goals across retries without saving records',async()=>{
 const ui=setup({search:'?route=loop'});await ui.app.ready;assert.equal(ui.get('loop-goals').hidden,false);
 ui.app.start();depotEscape(()=>ui.app.run,ui.step);for(let i=0;i<100;i++)ui.step();assert.match(ui.get('message').textContent,/First time set/);assert.match(ui.get('message').textContent,/Next goal:.*music/);
 ui.app.start();depotEscape(()=>ui.app.run,ui.step,{music:true});for(let i=0;i<100;i++)ui.step();assert.match(ui.get('message').textContent,/First time set/);assert.match(ui.get('records').textContent,/Sun only: [\d.]+s.*Sun \+ music: [\d.]+s/);assert.equal(ui.map.has(MISCHIEF_KEY),false);ui.app.destroy();
});

 test('full vault mission completes through the controller and remains isolated from records',async()=>{
 const ui=setup({search:'?route=heist'});await ui.app.ready;assert.equal(ui.app.run.vaultMission,true);assert.match(ui.get('title').textContent,/Sun Vault/);ui.app.start();vaultEscape(()=>ui.app.run,ui.step,{restore:true,music:true});for(let i=0;i<100;i++)ui.step();assert.equal(ui.app.run.status,'won');assert.equal(ui.app.run.relays.length,2);assert.match(ui.get('message').textContent,/restored the lift/);assert.equal(ui.map.has(MISCHIEF_KEY),false);ui.app.openMap();assert.equal(ui.get('map-panel').hidden,false);ui.app.destroy();
 });

test('tapping install stops a resting movement thumb and installs the cell once',async()=>{
 const ui=setup({search:'?route=heist'});await ui.app.ready;ui.app.start();const s=ui.app.run;Object.assign(s,{x:2005,y:276,ground:true,loot:['battery'],powered:false});s.items.battery.state='carried';ui.step();assert(ui.get('world-action').classList.contains('floating-install'));assert.equal(ui.get('world-action-label').textContent,'INSTALL CELL');
 const canvas=ui.get('canvas'),e=(id,x,y,t)=>({pointerId:id,clientX:x,clientY:y,timeStamp:t,pointerType:'touch',preventDefault(){},currentTarget:canvas});canvas.onpointerdown(e(1,60,650,0));canvas.onpointermove(e(1,100,650,30));ui.get('world-action').click();for(let i=0;i<110;i++)ui.advance();assert.equal(s.vaultOpen,true);assert.equal(s.items.battery.state,'vault');assert(!s.loot.includes('battery'));assert.equal(ui.get('world-action').classList.contains('floating-install'),false);ui.app.destroy();
});

 test('pixel comparison plays battery tradeoff and safe banking through the real controller',async()=>{const ui=setup({search:'?renderer=pixel'});await ui.app.ready;assert.equal(ui.get('play').disabled,false);assert(ui.doc.body.classList.contains('pixel'));ui.app.start();const d=driver(()=>ui.app.run,ui.step);d.go(430);ui.step();assert.equal(ui.get('world-action').hidden,false);ui.get('world-action').click();for(let i=0;i<150;i++)ui.advance();assert.equal(ui.app.run.powered,false);assert.deepEqual(ui.app.run.loot,['battery']);d.go(110);d.act();assert.equal(ui.app.run.status,'won');assert.equal(ui.app.records.escapes,1);ui.app.destroy();});
 test('pixel comparison reports blocked saving and draws chase and capture',async()=>{const ui=setup({search:'?renderer=pixel',store:{getItem(){return null;},setItem(){throw Error('blocked');}}});await ui.app.ready;ui.app.start();batteryRoute(driver(()=>ui.app.run,ui.step));for(let i=0;i<100;i++)ui.step();assert.match(ui.get('records').textContent,/Saving unavailable/);ui.app.start();Object.assign(ui.app.run,{x:ui.app.run.caretaker.x,y:426,ground:true});Object.assign(ui.app.run.caretaker,{mode:'chase',notice:0,suspicion:1});for(let i=0;i<160;i++)ui.step();assert.equal(ui.app.run.status,'dead');assert.equal(ui.get('overlay').hidden,false);ui.app.start();assert.equal(ui.app.run.powered,true);assert.deepEqual(ui.app.run.loot,[]);ui.app.destroy();});
