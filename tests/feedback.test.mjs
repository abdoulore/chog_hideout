import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedback,snapshot} from '../public/feedback.mjs';
import {newRun,stepRun,MOVEMENT_ROOM} from '../public/engine.mjs';
import {createSound} from '../public/sound.mjs';
import {newMischief} from '../public/mischief.mjs';

test('feedback follows actual jump, dash, landing, pickup and terminal transitions once',()=>{
 const f=createFeedback({random:()=>.5}),s=newRun(MOVEMENT_ROOM);let before=snapshot(s);stepRun(s,{jump:true});assert.deepEqual(f.observe(before,s),['jump']);
 before=snapshot(s);stepRun(s,{dash:true});assert(f.observe(before,s).includes('dash'));before=snapshot(s);stepRun(s,{});assert(!f.observe(before,s).includes('dash'));
 s.ground=true;s.y=426;assert(f.observe({...snapshot(s),ground:false},s).includes('land'));
 before=snapshot(s);s.collected.push(0);s.coins++;assert.deepEqual(f.observe(before,s),['spark']);assert.deepEqual(f.observe(snapshot(s),s),[]);
 before=snapshot(s);s.status='won';assert.deepEqual(f.observe(before,s),['win']);assert.deepEqual(f.observe(snapshot(s),s),[]);
 assert(f.state.particles.length>0);f.update(1);assert.equal(f.state.particles.length,0);f.reset();assert.equal(f.state.victory,0);
});
test('feedback cannot alter simulation; reduced motion suppresses particles and resets cleanly',()=>{
 const a=newRun(MOVEMENT_ROOM),b=newRun(MOVEMENT_ROOM),f=createFeedback({reducedMotion:true});
 for(let i=0;i<150;i++){const before=snapshot(a),input={right:true,jump:i===10,dash:i===28};stepRun(a,input);stepRun(b,input);f.observe(before,a);f.update(1/120);assert.deepEqual(a,b);}
 assert.equal(f.state.particles.length,0);f.reset();assert.equal(f.state.stride,0);
});

function fakeAudio(){
 const nodes=[],calls=[],param=()=>({value:0,setValueAtTime(v){assert(Number.isFinite(v));},exponentialRampToValueAtTime(v){assert(v>0);},setTargetAtTime(v){calls.push(['gain',v]);}});
 const node=()=>{const n={connect(){},disconnect(){},start(t=0){calls.push(['start',t]);},stop(t=0){calls.push(['stop',t]);},gain:param(),frequency:param()};nodes.push(n);return n;};
 const ctx={state:'suspended',currentTime:10,sampleRate:8000,destination:{},createGain:node,createOscillator:node,createBiquadFilter:node,createBufferSource:node,createBuffer:(_,n)=>({getChannelData:()=>new Float32Array(n)}),async resume(){this.state='running';},async suspend(){this.state='suspended';}};
 return {ctx,calls,nodes};
}
test('sound waits for user unlock, supports every cue, and stops voices on mute/pause',async()=>{
 const {ctx,calls}=fakeAudio();let created=0;const s=createSound({getContext:()=>{created++;return ctx;}});
 s.play('jump');assert.equal(created,0);assert.equal(calls.length,0);assert(await s.unlock());assert.equal(created,1);
 for(const cue of ['step','jump','land','land-stone','land-wood-heavy','land-metal','dash','spark','pickup','take-battery','take-sun','take-music','spotted','hurt','win'])s.play(cue);assert(calls.some(c=>c[0]==='start'));
 s.setMuted(true);const starts=calls.filter(c=>c[0]==='start').length;s.play('jump');assert.equal(calls.filter(c=>c[0]==='start').length,starts);assert(calls.some(c=>c[0]==='stop'));
 s.setMuted(false);s.pause();s.play('dash');assert.equal(calls.filter(c=>c[0]==='start').length,starts);await s.unlock();s.play('jump');assert(calls.filter(c=>c[0]==='start').length>starts);assert.equal(created,1);
});
test('missing or denied audio never prevents play',async()=>{
 for(const getContext of [()=>null,()=>{throw Error('unsupported');}]){const s=createSound({getContext});assert.equal(await s.unlock(),false);assert.equal(s.available,false);s.play('win');s.pause();}
});

test('coyote jump emits takeoff feedback after leaving a roof',()=>{
 const s=newRun(MOVEMENT_ROOM),f=createFeedback();s.ground=false;s.coyote=.08;s.vy=20;const before=snapshot(s);stepRun(s,{jump:true});assert(f.observe(before,s).includes('jump'));
});
test('quick pause and resume await the pending audio suspension',async()=>{
 const {ctx}=fakeAudio();let finishSuspend;ctx.suspend=()=>new Promise(resolve=>{finishSuspend=()=>{ctx.state='suspended';resolve();};});
 const s=createSound({getContext:()=>ctx});await s.unlock();s.pause();const resume=s.unlock();await Promise.resolve();finishSuspend();assert(await resume);assert.equal(ctx.state,'running');
});


test('mission landings distinguish stone, timber and lift metal, with stronger feedback for a large fall',()=>{
 const s=newMischief(),f=createFeedback();
 for(const [x,feet,cue] of [[100,460,'stone'],[340,385,'wood'],[1050,385,'metal']]){
  s.x=x;s.y=feet-34;s.ground=true;
  const before={...snapshot(s),ground:false,vy:320};
  assert.deepEqual(f.observe(before,s),['land-'+cue]);const soft=f.state.landStrength;
  assert.deepEqual(f.observe({...before,vy:850},s),['land-'+cue+'-heavy']);assert(f.state.landStrength>soft);
  assert.deepEqual(f.observe(snapshot(s),s),[]);
 }
});

test('each treasure has one signature cue; caretaker warning fires once on recognition and stays readable with reduced motion',()=>{
 const s=newMischief(),f=createFeedback({reducedMotion:true});
 for(const id of ['battery','sun','music']){const before=snapshot(s);s.loot.push(id);s.phase='escape';assert.deepEqual(f.observe(before,s),['take-'+id]);assert.deepEqual(f.observe(snapshot(s),s),[]);}
 const before=snapshot(s);s.caretaker.mode='chase';assert.deepEqual(f.observe(before,s),['spotted']);assert(f.state.alert>0);assert.equal(f.state.particles.length,0);assert.deepEqual(f.observe(snapshot(s),s),[]);f.update(1.2);assert.equal(f.state.alert,0);
});

test('recognition stops earlier voices and briefly suppresses incidental music and footsteps',async()=>{
 const {ctx,calls}=fakeAudio(),s=createSound({getContext:()=>ctx});await s.unlock();s.play('music');const stops=calls.filter(c=>c[0]==='stop').length;s.play('spotted');assert(calls.filter(c=>c[0]==='stop').length>stops);const starts=calls.filter(c=>c[0]==='start').length;
 s.play('music');s.play('step');assert.equal(calls.filter(c=>c[0]==='start').length,starts);ctx.currentTime+=.7;s.play('step');assert(calls.filter(c=>c[0]==='start').length>starts);
});
