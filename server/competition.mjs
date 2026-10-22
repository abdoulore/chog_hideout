import {RULESET,MISSIONS} from '../public/competitive-replay.mjs';
import {verifyReplay} from './replay-verify.mjs';
export function createCompetition({db,stmt,one,master,rate,clock,fail,text,random,hash}){
 const all=async(sql,...v)=>(await stmt(sql,...v).all()).results;
 const id=v=>{if(typeof v!=='string'||! /^[a-f0-9]{48}$/.test(v))fail(400,'Invalid event.');return v;};
 const get=async eventId=>{const e=await one('SELECT e.*,g.name AS host FROM live_events e JOIN guilds g ON g.id=e.guild_id WHERE e.id=?',id(eventId));if(!e)fail(404,'Event not found.');return e;};
 const open=e=>{if(e.cancelled||clock()<e.starts_at||clock()>=e.ends_at)fail(409,'This event is not open.');if(e.ruleset!==RULESET)fail(409,'This event uses an earlier game version. Ask the host to create a new event.');};
 async function standings(e){
  const entries=await all('SELECT e.id,e.guild_id,g.name FROM live_entries e JOIN guilds g ON g.id=e.guild_id WHERE e.event_id=? ORDER BY e.created_at,e.id',e.id);
  const players=await all('SELECT entry_id,user_id,alias FROM live_players WHERE event_id=?',e.id);
  const scores=await all('SELECT user_id,entry_id,ticks,haul FROM live_attempts WHERE event_id=? AND used=1 AND ticks IS NOT NULL ORDER BY haul DESC,ticks ASC',e.id);
  const rows=entries.map(entry=>{const squad=players.filter(p=>p.entry_id===entry.id).map(p=>{const best=scores.find(s=>s.user_id===p.user_id&&s.entry_id===entry.id);return {alias:p.alias,haul:best?.haul??null,ticks:best?.ticks??null};});return {guildId:entry.guild_id,guild:entry.name,squad,complete:squad.length===e.squad_size&&squad.every(s=>s.ticks!==null),haul:squad.reduce((n,s)=>n+(s.haul||0),0),ticks:squad.reduce((n,s)=>n+(s.ticks||0),0)};});
  rows.sort((a,b)=>Number(b.complete)-Number(a.complete)||b.haul-a.haul||a.ticks-b.ticks||a.guildId.localeCompare(b.guildId));
  let previous=null,rank=0;return rows.map((r,i)=>{if(!previous||r.complete!==previous.complete||r.haul!==previous.haul||r.ticks!==previous.ticks)rank=i+1;previous=r;return {...r,rank:r.complete?rank:null};});
 }
 async function finalize(e){if(e.cancelled||clock()<e.ends_at)return;const board=await standings(e),first=board.find(r=>r.complete),winners=first?board.filter(r=>r.complete&&r.haul===first.haul&&r.ticks===first.ticks).map(r=>r.guildId):[];await stmt('INSERT OR IGNORE INTO live_trophies (event_id,winners,awarded_at) VALUES (?,?,?)',e.id,JSON.stringify(winners),clock()).run();}
 async function roster(user){const member=await one('SELECT guild_id FROM guild_members WHERE user_id=?',user);if(!member)return {guildId:null,players:[]};const rows=await all('SELECT user_id,alias FROM guild_members WHERE guild_id=? ORDER BY joined_at,user_id',member.guild_id);return {guildId:member.guild_id,players:await Promise.all(rows.map(async r=>({key:await hash(r.user_id),alias:r.alias,isYou:r.user_id===user})))};}
 return async function competition(user,action,b){
  if(action==='competition-list'){const events=await all('SELECT e.*,g.name AS host FROM live_events e JOIN guilds g ON g.id=e.guild_id ORDER BY e.created_at DESC LIMIT 50');for(const e of events)await finalize(e);return {events:events.map(e=>({...e,phase:e.cancelled?'cancelled':clock()>=e.ends_at?'finished':'open'})),roster:await roster(user),ruleset:RULESET};}
  if(action==='competition-detail'){
   const e=await get(b.get('event'));await finalize(e);const board=await standings(e),player=await one('SELECT p.*,e.guild_id FROM live_players p JOIN live_entries e ON e.id=p.entry_id WHERE p.event_id=? AND p.user_id=?',e.id,user),attempts=await one('SELECT count(*) AS count FROM live_attempts WHERE event_id=? AND user_id=?',e.id,user),award=await one('SELECT winners,awarded_at FROM live_trophies WHERE event_id=?',e.id);
   return {event:e,phase:e.cancelled?'cancelled':clock()>=e.ends_at?'finished':'open',standings:board,entered:!!player,attemptsUsed:attempts.count,attemptLimit:10,trophy:award?{guildIds:JSON.parse(award.winners),awardedAt:award.awarded_at}:null};
  }
  if(action==='competition-create'){
   const {g}=await master(user,b.guildId);if(!Object.hasOwn(MISSIONS,b.mission))fail(400,'Choose a supported mission.');if(![1,3].includes(b.squadSize))fail(400,'Choose a one-player or three-player squad.');if(!Number.isInteger(b.hours)||b.hours<1||b.hours>72)fail(400,'Choose a duration of 1–72 hours.');const eventId=random(),now=clock(),name=text(b.name,3,60,'Event name');
   const r=await stmt('INSERT INTO live_events (id,guild_id,name,mission,squad_size,starts_at,ends_at,created_at,cancelled,ruleset) SELECT ?,?,?,?,?,?,?,?,0,? WHERE (SELECT count(*) FROM live_events WHERE guild_id=? AND ends_at>? AND cancelled=0)<3',eventId,g.id,name,b.mission,b.squadSize,now,now+b.hours*3600000,now,RULESET,g.id,now).run();if(r.meta.changes!==1)fail(409,'Your guild already hosts three open events.');return {eventId};
  }
  if(action==='competition-cancel'){const e=await get(b.eventId);await master(user,e.guild_id);if(clock()>=e.ends_at)fail(409,'Finished results cannot be changed.');await stmt('UPDATE live_events SET cancelled=1 WHERE id=? AND ends_at>?',e.id,clock()).run();return {cancelled:true};}
  if(action==='competition-enter'){
   const e=await get(b.eventId);open(e);const {g}=await master(user,b.guildId);const rosterRows=await all('SELECT user_id,alias FROM guild_members WHERE guild_id=?',g.id);if(!Array.isArray(b.players)||b.players.length!==e.squad_size||new Set(b.players).size!==e.squad_size)fail(400,'Select the exact squad size.');
   const selected=[];for(const row of rosterRows)if(b.players.includes(await hash(row.user_id)))selected.push(row);if(selected.length!==e.squad_size)fail(400,'Every selected player must currently belong to your guild.');
   const entryId=e.id+':'+g.id,now=clock();const result=await db.batch([stmt('INSERT INTO live_entries (id,event_id,guild_id,created_at) SELECT ?,?,?,? WHERE (SELECT count(*) FROM live_entries WHERE event_id=?)<32 AND EXISTS(SELECT 1 FROM live_events WHERE id=? AND cancelled=0 AND ends_at>?)',entryId,e.id,g.id,now,e.id,e.id,now),...selected.map(p=>stmt('INSERT INTO live_players (id,event_id,entry_id,user_id,alias) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM live_entries WHERE id=?)',e.id+':'+p.user_id,e.id,entryId,p.user_id,p.alias,entryId))]);if(result[0].meta.changes!==1)fail(409,'The event is full or closed.');return {entered:true};
  }
  if(action==='competition-attempt'){
   await rate(user,'competition-attempt',12);const e=await get(b.eventId);open(e);const p=await one('SELECT p.*,m.guild_id FROM live_players p JOIN live_entries en ON en.id=p.entry_id JOIN guild_members m ON m.user_id=p.user_id AND m.guild_id=en.guild_id WHERE p.event_id=? AND p.user_id=?',e.id,user);if(!p)fail(403,'Your guild master must enter you in a squad, and you must still belong to that guild.');const attemptId=random(),now=clock(),expires=Math.min(e.ends_at,now+15*60000);
   const r=await stmt('INSERT INTO live_attempts (id,event_id,entry_id,user_id,started_at,expires,used) SELECT ?,?,?,?,?,?,0 WHERE (SELECT count(*) FROM live_attempts WHERE event_id=? AND user_id=?)<10 AND EXISTS(SELECT 1 FROM live_events WHERE id=? AND cancelled=0 AND ends_at>?)',attemptId,e.id,p.entry_id,user,now,expires,e.id,user,e.id,now).run();if(r.meta.changes!==1)fail(409,'No attempts remain, or the event closed.');return {attemptId,mission:e.mission,ruleset:e.ruleset,expires};
  }
  if(action==='competition-submit'){
   await rate(user,'competition-submit',5);const a=await one('SELECT * FROM live_attempts WHERE id=? AND user_id=?',id(b.attemptId),user);if(!a)fail(404,'Attempt not found.');const e=await get(a.event_id);open(e);if(a.used||a.expires<=clock())fail(409,'Attempt already submitted or expired.');const member=await one('SELECT m.user_id FROM guild_members m JOIN live_entries en ON en.guild_id=m.guild_id WHERE en.id=? AND m.user_id=?',a.entry_id,user);if(!member)fail(403,'You are no longer in the registered guild.');
   let score;try{score=verifyReplay(e.mission,b.frames);}catch(err){fail(422,err.message);}if(clock()-a.started_at<score.ticks*1000/120-1000)fail(422,'Replay duration exceeds the time available for this attempt.');
   const r=await stmt('UPDATE live_attempts SET used=1,ticks=?,haul=?,replay=? WHERE id=? AND user_id=? AND used=0 AND expires>? AND EXISTS(SELECT 1 FROM live_events WHERE id=? AND cancelled=0 AND ends_at>?)',score.ticks,score.haul,JSON.stringify(b.frames),a.id,user,clock(),e.id,clock()).run();if(r.meta.changes!==1)fail(409,'Attempt was submitted, cancelled or expired while checking.');return {accepted:true,...score};
  }
  fail(404,'Unknown competition action.');
 };
}
