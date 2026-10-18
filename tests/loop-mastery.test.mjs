import test from 'node:test';
import assert from 'node:assert/strict';
import {createLoopMastery} from '../public/loop-mastery.mjs';
const run=(time,music=false,status='won')=>({time,loot:music?['sun','music']:['sun'],status});
test('haul categories have separate bests; only completed escapes count',()=>{
 const m=createLoopMastery();assert.equal(m.finish(run(12,false,'dead')),null);
 assert.match(m.finish(run(22)).message,/First/);assert.match(m.next(),/music/);
 assert.match(m.finish(run(25,true)).message,/First/);
 assert.match(m.finish(run(21)).message,/1.00s faster/);
 assert.match(m.finish(run(23)).message,/2.00s behind/);
 assert.match(m.finish(run(21)).message,/Matched/);
 assert.match(m.summary(),/21.00s.*25.00s/);assert.match(m.next(),/either/);
});
test('duplicate result display is idempotent and a fresh visit starts empty',()=>{
 const m=createLoopMastery(),s=run(20);const result=m.finish(s);assert.equal(m.finish(s),result);
 assert.match(createLoopMastery().summary(),/set your first/);
 assert.equal(m.finish({status:'won',time:1,loot:['music']}),null);
 assert.equal(m.finish(run(NaN)),null);
});
