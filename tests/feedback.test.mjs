import test from 'node:test';
import assert from 'node:assert/strict';
import {createFeedback,snapshot} from '../dist/feedback.mjs';
import {newRun,stepRun,MOVEMENT_ROOM} from '../dist/engine.mjs';
import {createSound} from '../dist/sound.mjs';

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
 for(const cue of ['step','jump','land','dash','spark','pickup','hurt','win'])s.play(cue);assert(calls.some(c=>c[0]==='start'));
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
