import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountGuildHall} from '../dist/guild-hall.mjs';
import {mountHeadquarters} from '../dist/guild-headquarters.mjs';
import {mountGuildManagement} from '../dist/guild-manage.mjs';
import {loadTrial,beginAttempt,finishAttempt,saveTrial} from '../dist/guild-trial.mjs';
const routes={hq:['guild.html',mountHeadquarters],event:['tournament.html',mountGuildHall],manage:['event-manage.html',mountGuildManagement]};
function memory(){const data=new Map();return {getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};}
function fixture(route='event',storage=memory(),search=''){
 const nodes=new Map(),events=new Map(),[file,mount]=routes[route],html=fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8');
 for(const m of html.matchAll(/\bid="([^"]+)"/g)){const classes=new Set();nodes.set(m[1],{hidden:false,disabled:false,textContent:'',innerHTML:'',value:'',classList:{toggle(k,v){v?classes.add(k):classes.delete(k);}},setAttribute(k,v){this[k]=v;},showModal(){this.open=true;},close(){this.open=false;}});}
 const doc={getElementById:id=>{assert(nodes.has(id),'Missing '+id+' on '+file);return nodes.get(id);}},surface={addEventListener:(k,v)=>events.set(k,v),removeEventListener:k=>events.delete(k)},app=mount({doc,storage,events:surface,search});
 return {app,get:id=>nodes.get(id),events,storage,html,back(){events.get('pageshow')();}};
}
function play(q,id,value=6,ticks=3000){const s=loadTrial(q.storage).state,r=beginAttempt(s,id,s.phase);assert(saveTrial(q.storage,finishAttempt(r.state,r.attempt.id,{status:'banked',value,ticks})));q.events.get('storage')();}
test('three routes share qualification, locked squads, finals and trophy after returning',()=>{
 const store=memory(),hq=fixture('hq',store),event=fixture('event',store),manage=fixture('manage',store);
 assert.equal(hq.get('guild-name').textContent,'Lantern Company');assert.equal(hq.get('hq-enter').href,'tournament.html');
 assert(!hq.get('enter-run'));assert(!hq.get('advance-round'));assert(!hq.get('standings-content'));assert(!event.get('reset-trial'));assert(!event.get('guild-cards'));
 assert.equal(manage.get('advance-round').disabled,true);assert.match(event.get('enter-run').href,/trial=guild/);
 play(event,'lantern-1');manage.back();manage.get('fill-examples').onclick();assert.equal(manage.get('advance-round').disabled,false);hq.back();assert.match(hq.get('guild-cards').innerHTML,/Example result/);
 manage.get('advance-round').onclick();event.back();assert.equal(event.app.state.phase,'finals');assert.match(event.get('enter-run').href,/round=finals/);assert.equal(manage.get('advance-round').disabled,true);
 manage.get('fill-examples').onclick();play(event,'lantern-1');manage.back();assert.equal(manage.get('advance-round').disabled,false);
 event.get('view-guilds').onclick();assert.match(event.get('standings-content').innerHTML,/Includes example scores/);manage.get('advance-round').onclick();event.back();hq.back();
 assert.equal(event.app.state.phase,'complete');assert.match(hq.get('guild-cards').innerHTML,/Burrows rehearsal trophy/);assert.equal(hq.get('hq-enter').href,'tournament.html#standings');assert.equal(event.get('enter-run').href,'#standings');assert.match(event.get('enter-run').textContent,/results/);
 for(const q of [hq,event,manage]){q.app.destroy();assert.equal(q.events.size,0);}
});
test('seat switching persists across pages and reset preserves solo records',()=>{
 const store=memory(),hq=fixture('hq',store),event=fixture('event',store),manage=fixture('manage',store);store.setItem('chog-home:v1','keep me');
 hq.get('player-seat').onchange({target:{value:'copper-2'}});event.back();manage.back();assert.match(event.get('enter-run').href,/seat=copper-2/);assert.equal(manage.get('guild-name').textContent,'Copper Assembly');assert.doesNotMatch(hq.get('guild-cards').innerHTML,/Lantern Company/);
 const id=event.app.state.id;manage.get('reset-trial').onclick();assert(manage.get('reset-dialog').open);assert.equal(loadTrial(store).state.id,id);manage.get('confirm-reset').onclick();event.back();hq.back();
 assert.notEqual(event.app.state.id,id);assert.equal(event.app.state.seat,'lantern-1');assert.equal(store.getItem('chog-home:v1'),'keep me');assert.equal(manage.get('reset-dialog').open,false);
 [hq,event,manage].forEach(q=>q.app.destroy());
});
test('blocked persistence remains blocked after pageshow on all three routes',()=>{
 const store={getItem(){return null;},setItem(){throw Error();}};
 for(const route of Object.keys(routes)){const q=fixture(route,store);q.back();assert.match(q.get('hall-notice').textContent,/unavailable/);if(route==='event')assert.equal(q.get('enter-run')['aria-disabled'],'true');if(route==='manage'){assert.equal(q.get('advance-round').disabled,true);assert.equal(q.get('fill-examples').disabled,true);}q.app.destroy();}
});
test('tournament shows cutoff targets, real rank changes and deep-linked guild standings',()=>{
 const store=memory(),q=fixture('event',store),manage=fixture('manage',store);assert.match(q.get('goal-title').textContent,/name on the board/);manage.get('fill-examples').onclick();q.back();assert.match(q.get('goal-copy').textContent,/under 37.000s/);assert.match(q.get('goal-copy').textContent,/example score/);
 play(q,'lantern-1',1,4800);assert.equal(q.get('your-rank').textContent,'#4');play(q,'lantern-1',6,3600);assert.match(q.get('recent-title').textContent,/#4 to #1/);assert.equal(q.get('your-best').textContent,'6 / 6');assert.match(q.get('squad-slots').innerHTML,/YOU/);assert.equal(q.get('round-next').hidden,false);
 const deep=fixture('event',store,'?board=guilds');assert.equal(deep.get('view-guilds')['aria-pressed'],'true');assert.match(deep.get('standings-content').innerHTML,/guild-score-row/);
 [q,manage,deep].forEach(q=>q.app.destroy());
});
test('navigation sends game results to competition and keeps management on its own route',()=>{
 const game=fs.readFileSync(new URL('../dist/mischief.html',import.meta.url),'utf8');assert.match(game,/href="tournament.html#standings"/);
 for(const [route] of Object.entries(routes)){const q=fixture(route);assert.match(q.html,/aria-label="Mobile navigation"/);assert.match(q.html,/href="event-manage.html"/);if(route!=='manage')assert.doesNotMatch(q.html,/id="reset-dialog"|id="fill-examples"/);q.app.destroy();}
});
