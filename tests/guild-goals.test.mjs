import test from 'node:test';
import assert from 'node:assert/strict';
import {freshTrial,beginAttempt,finishAttempt,fillExamples,lockSquads} from '../dist/guild-trial.mjs';
import {nextGoal,latestImpact} from '../dist/guild-goals.mjs';
function bank(s,id,value,ticks){const r=beginAttempt(s,id,s.phase);return finishAttempt(r.state,r.attempt.id,{status:'banked',value,ticks});}
test('an open place has no invented opponent target; a full field uses the actual cutoff',()=>{
 let s=freshTrial('goals');assert.equal(nextGoal(s).target,undefined);s=fillExamples(s);const g=nextGoal(s);assert.deepEqual(g.target,{value:1,ticks:4440});assert.match(g.copy,/under 37.000s/);assert.match(g.copy,/example score/);s=bank(s,'lantern-1',1,4800);assert.match(nextGoal(s).title,/squad place/);
});
test('six-point and tied-cutoff targets never demand impossible extra treasure',()=>{
 let s=freshTrial('goals');for(const [id,value,ticks] of [['lantern-1',6,4800],['lantern-2',6,3600],['lantern-3',6,4000],['lantern-4',6,4800]])s=bank(s,id,value,ticks);
 const g=nextGoal(s);assert.match(g.title,/tie/);assert.match(g.copy,/under 40.000s/);assert.doesNotMatch(g.copy,/7 or more/);
 s=bank(s,'lantern-1',6,3000);assert.match(nextGoal(s).copy,/under 25.000s/);assert.doesNotMatch(nextGoal(s).copy,/7/);
});
test('run impact records the actual movement at that moment and does not rewrite it when others improve',()=>{
 let s=fillExamples(freshTrial('goals'));s=bank(s,'lantern-1',1,6000);s=bank(s,'lantern-1',6,3600);assert.match(latestImpact(s).title,/#4 to #1/);s=bank(s,'lantern-2',6,3000);assert.match(latestImpact(s).title,/#4 to #1/);s=bank(s,'lantern-1',1,1200);assert.match(latestImpact(s).title,/previous best/);
});
test('final recaps show the team contribution; reserves and closed events do not promise a playable target',()=>{
 let s=fillExamples(bank(freshTrial('goals'),'lantern-1',6,3000));s=lockSquads(s);s=bank(s,'lantern-1',3,3600);assert.match(latestImpact(s).copy,/0 → 3 \/ 18/);const reserve=['lantern-1','lantern-2','lantern-3','lantern-4'].find(id=>!s.rosters.lantern.includes(id));assert.match(nextGoal(s,reserve).title,/reserve/);assert.match(nextGoal({...s,phase:'complete'}).copy,/closed/);
});
