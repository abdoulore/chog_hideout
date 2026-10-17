import test from 'node:test';
import assert from 'node:assert/strict';
import {freshTrial,beginAttempt,finishAttempt,fillExamples,lockSquads,closeTrial,lockReason,closeReason,standings,guildStandings,bestRun,entryReason,usedAttempts,loadTrial,saveTrial,TRIAL_KEY,PLAYERS} from '../dist/guild-trial.mjs';
import {createGuildSession} from '../dist/guild-session.mjs';
function bank(s,id,value,ticks,stage=s.phase){const r=beginAttempt(s,id,stage);return finishAttempt(r.state,r.attempt.id,{status:'banked',value,ticks});}
function store(s){const map=new Map([[TRIAL_KEY,JSON.stringify(s)]]);return {getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};}
function qualified(){return fillExamples(bank(freshTrial('event'),'lantern-1',6,3600));}

test('higher haul beats faster time, exact ticks break ties, and only a better run replaces a best',()=>{
 let s=freshTrial('event');s=bank(s,'lantern-1',1,1200);s=bank(s,'lantern-2',3,4800);s=bank(s,'lantern-3',3,4801);s=bank(s,'lantern-4',3,4800);
 assert.deepEqual(standings(s).slice(0,4).map(p=>[p.id,p.rank]),[['lantern-2',1],['lantern-4',1],['lantern-3',3],['lantern-1',4]]);
 s=bank(s,'lantern-2',1,500);assert.equal(bestRun(s,'lantern-2').value,3);assert.equal(usedAttempts(s,'lantern-2','qualifiers'),2);
});
test('qualifiers lock three members per guild; final starts empty; a reserve cannot enter',()=>{
 const s=qualified(),n=lockSquads(s);assert.equal(n.phase,'finals');assert.equal(n.rosters.lantern.length,3);assert.equal(n.rosters.copper.length,3);assert(n.rosters.lantern.includes('lantern-1'));assert.equal(s.phase,'qualifiers');
 assert(guildStandings(n).every(g=>g.value===0&&!g.qualified));const reserve=PLAYERS.find(p=>!n.rosters[p.guild].includes(p.id));assert.match(entryReason(n,reserve.id,'finals'),/did not make/);assert.match(entryReason(n,'lantern-1','qualifiers'),/closed/);assert.match(entryReason(n,'lantern-1','finals','old-event'),/older/);
});
test('a tie across third qualifier place requires another run, not arbitrary selection',()=>{
 let s=freshTrial('event');for(const p of PLAYERS)s=bank(s,p.id,p.id.endsWith('1')?6:p.id.endsWith('2')?3:1,3600);
 assert.match(lockReason(s),/Third place is tied/);assert.throws(()=>lockSquads(s),/tied/);
 s=bank(s,'lantern-3',1,3599);s=bank(s,'copper-3',1,3599);assert.equal(lockReason(s),null);
});
test('all three escapes are required; exact team ties share a trophy; closure freezes entry',()=>{
 let s=lockSquads(qualified());for(const gid of ['lantern','copper'])for(const id of s.rosters[gid]){if(id==='lantern-1')continue;s=bank(s,id,1,3600);}
 assert.match(closeReason(s),/three successful/);assert.equal(guildStandings(s).find(g=>g.id==='lantern').rank,null);
 s=bank(s,'lantern-1',1,3600);assert.deepEqual(guildStandings(s).map(g=>g.rank),[1,1]);s=closeTrial(s);assert.equal(s.phase,'complete');assert.match(entryReason(s,'lantern-1','finals'),/closed/);
});
test('attempts are consumed on start, superseded attempts are abandoned and terminal submission is one-time',()=>{
 let s=freshTrial('event'),first;for(let i=0;i<10;i++){const r=beginAttempt(s,'lantern-1','qualifiers');s=r.state;first??=r.attempt.id;}
 assert.equal(s.attempts.filter(a=>a.status==='abandoned').length,9);assert.equal(usedAttempts(s,'lantern-1','qualifiers'),10);assert.throws(()=>beginAttempt(s,'lantern-1','qualifiers'),/10/);assert.throws(()=>finishAttempt(s,first,{status:'banked',value:6,ticks:100}),/no longer active/);
 const last=s.attempts.at(-1);s=finishAttempt(s,last.id,{status:'caught'});assert.throws(()=>finishAttempt(s,last.id,{status:'banked',value:6,ticks:100}),/no longer active/);assert.equal(bestRun(s,'lantern-1'),null);
});
test('examples are labelled, skip selected seat, preserve existing results and never consume real attempts',()=>{
 let s=freshTrial('event');s=bank(s,'copper-1',6,10000);s=fillExamples(s);assert.equal(bestRun(s,'lantern-1'),null);assert.equal(bestRun(s,'copper-1').example,false);assert.equal(bestRun(s,'copper-1').value,6);assert.equal(bestRun(s,'lantern-2').example,true);assert.equal(usedAttempts(s,'lantern-2','qualifiers'),0);assert.equal(fillExamples(s).attempts.length,s.attempts.length);
});
test('session saves banked results once, rejects stale event links and reports blocked persistence',()=>{
 const storage=store(freshTrial('event')),context={event:'event',seat:'lantern-1',stage:'qualifiers'},session=createGuildSession({storage,context});assert(session.start());session.finish({status:'won',loot:['battery','music'],time:30});assert.match(session.receipt,/3 \/ 6/);assert.equal(loadTrial(storage).state.attempts.length,1);session.finish({status:'won',loot:['sun'],time:1});assert.equal(loadTrial(storage).state.attempts.length,1);
 assert.equal(createGuildSession({storage,context:{...context,event:'old'}}).start(),false);
 const blocked=createGuildSession({storage:{getItem:storage.getItem,setItem(){throw Error();}},context});assert.equal(blocked.start(),false);assert.match(blocked.error,/unavailable/);assert.equal(loadTrial(storage).state.attempts.length,1);
});
test('invalid saves are surfaced and an abandoned session cannot submit a score',()=>{
 const storage=store(freshTrial('event')),session=createGuildSession({storage,context:{event:'event',seat:'lantern-1',stage:'qualifiers'}});session.start();session.abandon();session.finish({status:'won',loot:['sun'],time:10});assert.equal(loadTrial(storage).state.attempts[0].status,'abandoned');
 storage.setItem(TRIAL_KEY,'bad json');assert(loadTrial(storage).error);assert.equal(saveTrial(null,freshTrial()),false);
});
