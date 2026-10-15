import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mountHome} from '../dist/home.mjs';
import {emptyRecords,recordFinish,writeRecords} from '../dist/heist-records.mjs';
function setup(storage,loadArt=async()=>({room:{},sun:{},chog:{},props:{}})){
 const html=fs.readFileSync(new URL('../dist/home.html',import.meta.url),'utf8'),nodes=new Map(),listeners=new Map();const context=new Proxy({createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});let doc;
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
 for(const name of ['home.html','play.html','lab.html','renderer-lab.html']){const html=fs.readFileSync(new URL('../dist/'+name,import.meta.url),'utf8');for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const link=m[1];if(link.startsWith('#')||/^https?:/.test(link)||link.startsWith('data:'))continue;assert(fs.existsSync(new URL('../dist/'+link.split(/[?#]/)[0],import.meta.url)),name+' → '+link);}}
});
