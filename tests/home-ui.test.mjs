import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountHome} from '../public/home.mjs';
import {emptyJob,writeJob} from '../public/mischief-records.mjs';
import {emptyRecords,recordFinish,writeRecords} from '../public/heist-records.mjs';
function setup(storage,loadArt=async()=>({room:{},sun:{},chog:{},props:{}})){
 const html=fs.readFileSync(new URL('../public/home.html',import.meta.url),'utf8'),nodes=new Map(),listeners=new Map();const context=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});let doc;
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const classes=new Set();nodes.set(m[3],{hidden:/\bhidden\b/.test(m[2]),textContent:'',value:'',open:false,classList:{toggle(k,on){on?classes.add(k):classes.delete(k);},contains:k=>classes.has(k)},setAttribute(k,v){this[k]=v;},getContext:()=>context,focus(){doc.activeElement=this;},showModal(){this.open=true;},close(){this.open=false;},click(){this.onclick?.();}});}
 doc={title:'',hidden:false,getElementById:id=>{assert(nodes.has(id),id);return nodes.get(id);}};const events={addEventListener:(t,cb)=>listeners.set(t,cb),removeEventListener:t=>listeners.delete(t)};const app=mountHome({doc,storage,events,loadArt,location:{search:'?returned=1'},reducedMotion:true});return {app,nodes,listeners,get:id=>nodes.get(id),doc};
}
function storage(){const map=new Map();return {getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};}

test('home explains empty hook, persists rename, reloads, and refreshes earned objects after a run',async()=>{
 const saved=storage(),ui=setup(saved);await ui.app.ready;assert.equal(ui.get('keepsake-count').textContent,'0 of 3 keepsakes');assert.equal(ui.get('return-note').hidden,true);ui.get('sun-hook').click();assert(ui.get('keepsake-dialog').open);assert.match(ui.get('detail-copy').textContent,/Bring/);ui.get('close-detail').click();assert.equal(ui.get('keepsake-dialog').open,false);
 ui.get('rename').click();assert(ui.get('rename-dialog').open);ui.get('name-input').value='  My quiet loft  ';ui.get('rename-form').onsubmit({preventDefault(){}});assert.equal(ui.get('home-name').textContent,'My quiet loft');assert.equal(ui.get('rename-dialog').open,false);
 const second=setup(saved);await second.app.ready;assert.equal(second.get('home-name').textContent,'My quiet loft');
 writeRecords(saved,recordFinish(emptyRecords(),{status:'won',phase:'escape',hasSun:true,clean:true,time:24.5,escapeTime:11,coins:8}));second.listeners.get('storage')();assert.equal(second.get('keepsake-count').textContent,'3 of 3 keepsakes');assert.equal(second.get('return-note').hidden,false);assert.equal(second.get('clean-best').textContent,'24.50s');assert.equal(second.get('spark-best').textContent,'8 / 8');assert(second.get('sun-hook').classList.contains('earned'));second.get('clean-hook').click();assert.match(second.get('detail-copy').textContent,/tile/);
 ui.app.destroy();second.app.destroy();
});
test('blocked saves and failed artwork leave the home usable',async()=>{
 const blocked={getItem(){throw Error();},setItem(){throw Error();}},ui=setup(blocked,async()=>{throw Error('offline');});await ui.app.ready;assert.equal(ui.get('art-error').hidden,false);ui.get('rename').click();ui.get('name-input').value='Still here';ui.get('rename-form').onsubmit({preventDefault(){}});assert.equal(ui.get('home-name').textContent,'Still here');assert.match(ui.get('save-note').textContent,/unavailable/);assert.equal(ui.get('keepsake-count').textContent,'0 of 3 keepsakes');ui.app.destroy();
});
test('local HTML links and script references still resolve after moving the lab',()=>{
 for(const name of ['home.html','play.html','mischief.html','lab.html','renderer-lab.html']){const html=fs.readFileSync(new URL('../public/'+name,import.meta.url),'utf8');for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const link=m[1];if(link.startsWith('#')||/^https?:/.test(link)||link.startsWith('data:'))continue;assert(fs.existsSync(new URL('../public/'+link.split(/[?#]/)[0],import.meta.url)),name+' → '+link);}}
});

test('banked job treasures refresh the home without awarding an old clean or spark record',async()=>{const saved=storage();writeJob(saved,{...emptyJob(),escapes:1,bestValue:6,bestTime:24.8,treasures:['sun','battery','music'],lastHaul:['sun','battery','music'],lastValue:6});const ui=setup(saved);await ui.app.ready;assert.equal(ui.get('job-best').textContent,'6 / 6');assert.equal(ui.get('job-escapes').textContent,'1');assert(ui.get('haul-music').classList.contains('earned'));assert(ui.get('sun-hook').classList.contains('earned'));assert.equal(ui.get('clean-best').textContent,'—');assert.equal(ui.get('keepsake-count').textContent,'1 of 3 keepsakes');assert.match(ui.get('story-copy').textContent,/music box/);assert.equal(ui.get('return-note').hidden,false);ui.app.destroy();});

test('home resumes unlocked mission and retains replay links after finishing the campaign',async()=>{
 const saved=storage(),ui=setup(saved);await ui.app.ready;assert.match(ui.get('start-heist').href,/route=heist/);assert.equal(ui.get('annex-link').hidden,true);saved.setItem('chog-campaign:v1',JSON.stringify({version:1,vault:true,annex:false}));ui.listeners.get('storage')();assert.match(ui.get('start-heist').textContent,/Continue/);assert.match(ui.get('start-heist').href,/route=annex/);assert.equal(ui.get('replay-vault').hidden,false);saved.setItem('chog-campaign:v1',JSON.stringify({version:1,vault:true,annex:true}));ui.listeners.get('pageshow')();assert.match(ui.get('campaign-status').textContent,/2 \/ 2/);ui.app.destroy();
});
