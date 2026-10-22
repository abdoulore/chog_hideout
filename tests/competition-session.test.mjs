import test from 'node:test';
import assert from 'node:assert/strict';
import {createCompetitionSession} from '../public/competition-session.mjs';
import {RULESET} from '../public/competitive-replay.mjs';
import {newMischief,stepMischief} from '../public/mischief.mjs';
import {verifyReplay} from '../server/replay-verify.mjs';
import {lanternEscape} from './helpers/lantern-driver.mjs';
const reply=(data,status=200)=>({ok:status<400,status,json:async()=>data});
test('client records real winning inputs and preserves replay across transient failure',async()=>{
 let submissions=0,body;const statuses=[];
 const session=createCompetitionSession({eventId:'a'.repeat(48),mission:'lantern',onStatus:(...a)=>statuses.push(a),fetcher:async(url,opts)=>{
 if(url.endsWith('attempt'))return reply({attemptId:'b'.repeat(48),mission:'lantern',ruleset:RULESET});
 submissions++;body=JSON.parse(opts.body);if(submissions===1)throw Error('Network interrupted');return reply(verifyReplay('lantern',body.frames));}});
 await session.begin();const run=newMischief({lanternMission:true});lanternEscape(()=>run,c=>{if(run.status==='playing'){session.record(c);stepMischief(run,c);}});
 assert.equal(run.status,'won');await session.finish(run);assert.equal(statuses.at(-1)[1],true);await session.resubmit();assert.equal(submissions,2);assert.match(statuses.at(-1)[0],/Verified/);assert.equal(body.attemptId,'b'.repeat(48));await session.resubmit();assert.equal(submissions,2);
});
test('wrong mission cannot start and failed runs do not submit',async()=>{
 let calls=0;const session=createCompetitionSession({eventId:'a'.repeat(48),mission:'annex',fetcher:async()=>{calls++;return reply({mission:'lantern',ruleset:RULESET});}});await assert.rejects(session.begin(),/different mission/);await session.finish({status:'caught'});assert.equal(calls,1);
});
