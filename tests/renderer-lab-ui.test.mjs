import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('movement screen supports controls, pause, retry, focus, and failed-renderer fallback',async()=>{
 const html=fs.readFileSync(new URL('../public/renderer-lab.html',import.meta.url),'utf8'),nodes=new Map(),events=new Map();
 const context=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{}),set:()=>true});
 function element(tag='div',attrs=''){
  const classes=new Set();return {tagName:tag.toUpperCase(),value:'',hidden:/\bhidden\b/.test(attrs),textContent:'',disabled:false,children:[],classList:{toggle(k){classes.has(k)?classes.delete(k):classes.add(k);},contains:k=>classes.has(k)},getContext:()=>context,getBoundingClientRect:()=>({width:380,height:220,left:0,top:0}),focus(){document.activeElement=this;},setPointerCapture(){},remove(){},append(n){this.children.push(n);},click(){this.onclick?.({preventDefault(){}});}};
 }
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const n=element(m[1],m[2]);n.id=m[3];nodes.set(n.id,n);}
 globalThis.document={hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id),id);return nodes.get(id);},createElement:element,body:element('body'),head:{append:s=>queueMicrotask(()=>s.onerror())},addEventListener:(t,cb)=>events.set('document:'+t,cb)};
 globalThis.window={addEventListener:(t,cb)=>events.set(t,cb)};globalThis.matchMedia=()=>({matches:true});globalThis.location={search:''};globalThis.requestAnimationFrame=cb=>events.set('raf',cb);globalThis.setTimeout=()=>1;globalThis.clearTimeout=()=>{};
 await import('../public/renderer-lab.mjs');const get=id=>nodes.get(id);get('play').click();assert.equal(get('overlay').hidden,true);
 const key=k=>({key:k,repeat:false,preventDefault(){}});events.get('keydown')(key('ArrowRight'));for(let i=0;i<25;i++)events.get('raf')(i*16.667);assert(get('distance').value>0);
 get('dash').onpointerdown({pointerId:1,preventDefault(){}});events.get('raf')(430);assert.match(get('dash-status').textContent,/DASH [01]\.[0-9]s/);
 events.get('blur')();const time=get('time').textContent;for(let i=0;i<10;i++)events.get('raf')(450+i*16.667);assert.equal(get('time').textContent,time);assert.equal(get('overlay').hidden,false);
 get('play').click();assert.equal(get('overlay').hidden,true);get('retry').click();assert.equal(get('overlay').hidden,true);
 get('focus').click();assert(document.body.classList.contains('focus'));assert.equal(get('focus').textContent,'Exit focus');
 get('renderer').value='phaser';await get('renderer').onchange();assert.equal(get('renderer').value,'canvas');assert.match(get('renderer-status').textContent,/could not load/);assert.equal(get('canvas').hidden,false);
 get('play').click();events.get('keydown')(key('ArrowRight'));events.get('raf')(800);assert(get('distance').value>0);
});
