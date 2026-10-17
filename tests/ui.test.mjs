import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('UI smoke: navigation, editor gating, rematch, feedback, and local persistence',async()=>{
 const html=fs.readFileSync(new URL('../public/lab.html',import.meta.url),'utf8');
 const nodes=new Map(),events=new Map(),timers=new Map(),storage=new Map();let timerId=0;
 const context=new Proxy({},{get:(_,key)=>key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
 function element(tag='div',attrs=''){
  const n={tagName:tag.toUpperCase(),children:[],textContent:'',value:'',hidden:/\bhidden\b/.test(attrs),disabled:/\bdisabled\b/.test(attrs),dataset:{},attributes:{},classList:{toggle(){}},className:'',append(...items){this.children.push(...items);},prepend(...items){this.children.unshift(...items);},replaceChildren(...items){this.children=[...items];},setAttribute(k,v){this.attributes[k]=v;},getContext(){return context;},focus(){document.activeElement=this;},select(){},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:900,height:520};},addEventListener(t,cb){this['on'+t]=cb;},click(){if(!this.disabled)this.onclick?.({preventDefault(){}});}};
  for(const m of attrs.matchAll(/data-([a-z]+)="([^"]+)"/g))n.dataset[m[1]]=m[2];return n;
 }
 const tabButtons=[],votes=[];
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const n=element(m[1],m[2]);n.id=m[3];if(m[1]==='select'){const rest=html.slice(m.index+m[0].length).split('</select>')[0];n.value=rest.match(/value="([^"]*)"/)?.[1]||'';}nodes.set(n.id,n);}
 for(const m of html.matchAll(/<button\b([^>]*data-tab="[^"]+"[^>]*)>/g))tabButtons.push(element('button',m[1]));
 for(const m of html.matchAll(/<button\b([^>]*data-vote="[^"]+"[^>]*)>/g))votes.push(element('button',m[1]));
 globalThis.document={hidden:false,activeElement:null,getElementById:id=>{assert(nodes.has(id),`missing ID ${id}`);return nodes.get(id);},querySelector:()=>element('a'),querySelectorAll:q=>q==='[data-tab]'?tabButtons:q==='[data-vote]'?votes:q==='.panel'?['hideout','dojo','compare'].map(id=>nodes.get(id)):[],createElement:element,createTextNode:s=>s,addEventListener:(t,cb)=>events.set('document:'+t,cb)};
 globalThis.window={addEventListener:(t,cb)=>events.set(t,cb)};globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=cb=>{events.set('raf',cb);};globalThis.setTimeout=cb=>{timers.set(++timerId,cb);return timerId;};globalThis.clearTimeout=id=>timers.delete(id);
 await import('../public/app.mjs');const get=id=>nodes.get(id);
 assert.equal(get('room-buttons').children.length,3);
 get('edit-toggle').click();assert.equal(get('editor').hidden,false);assert.equal(get('save-room').disabled,true);
 get('clear-room').click();assert.equal(get('trap-count').textContent,'0 / 5 traps');
 get('test-room').click();assert.equal(get('hide-overlay').hidden,true);
 const e={key:'ArrowRight',preventDefault(){}};events.get('keydown')(e);for(let i=0;i<260;i++)events.get('raf')(i*16.667);
 assert.equal(get('save-room').disabled,false,'save unlocks only after a successful test');get('save-room').click();assert.equal(get('load-room').hidden,false);
 tabButtons.find(b=>b.dataset.tab==='dojo').click();assert.equal(get('dojo').hidden,false);assert.equal(get('hideout').hidden,true);
 get('fight').click();assert.equal(get('rule-response').disabled,true);get('skip-fight').click();assert.equal(get('m-fights').textContent,1);assert.equal(get('m-result').textContent,'loss');assert.equal(get('rule-response').disabled,false);
 get('rule-threshold').value='3';get('rule-response').value='guard';get('rule-response').onchange();get('fight').click();get('skip-fight').click();assert.equal(get('m-result').textContent,'win');assert.equal(get('m-changes').textContent,1);
 votes[0].click();get('verdict-note').value='Jumping made me retry.';get('verdict-note').oninput();const saved=JSON.parse(storage.get('chog-lab-v1'));assert.equal(saved.vote,'Hideout');assert.equal(saved.note,'Jumping made me retry.');assert.deepEqual(saved.custom,[]);
 tabButtons.find(b=>b.dataset.tab==='compare').click();assert.equal(get('compare').hidden,false);
});
