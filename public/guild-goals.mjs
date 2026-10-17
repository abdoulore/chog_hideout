import {player,standings,compareRuns,formatTime,guildStandings} from './guild-trial.mjs?v=1';
// Presentation derived from existing records. Never changes scoring or invents activity.
export function nextGoal(s,id=s.seat){
 const p=player(id),stage=s.phase==='qualifiers'?'qualifiers':'finals';
 if(s.phase==='complete')return {title:'The result is in.',copy:'Your next rivalry starts with a new rehearsal. This event’s standings are closed.'};
 if(stage==='finals'&&!s.rosters[p.guild].includes(id))return {title:'You’re on the reserve bench.',copy:'Follow your squad below, or practise for the next qualifier.'};
 const rows=standings(s,stage,stage==='qualifiers'?p.guild:null),own=rows.find(r=>r.id===id),scored=rows.filter(r=>r.best);
 let target=null,title='';
 if(stage==='qualifiers'){
  const boundary=scored[2],tie=boundary&&scored[3]&&compareRuns(boundary.best,scored[3].best)===0;
  if(tie&&own.best&&compareRuns(own.best,boundary.best)===0){target=boundary;title='Break the squad-place tie.';}
  else if((!own.best||own.rank>3)&&scored.filter(r=>r.id!==id).length>=3){target=scored.filter(r=>r.id!==id)[2];title='Take a squad place.';}
 }
 if(!target&&own.best){target=scored.filter(r=>r.id!==id&&compareRuns(r.best,own.best)<0).at(-1);if(target)title='Chase the next position.';}
 if(target){const b=target.best;return {title,copy:`Bank ${b.value} treasure in under ${formatTime(b.ticks)}${b.value<6?`, or bank ${b.value+1} or more at any time`:''}. ${target.id===id?'The tied cutoff':target.name} holds ${b.value} / 6 at ${formatTime(b.ticks)}${b.example?' (example score)':''}.`,target:{value:b.value,ticks:b.ticks}};}
 if(!own.best)return {title:stage==='qualifiers'?'Put your name on the board.':'Your squad needs your escape.',copy:stage==='qualifiers'?'Bank any treasure to claim an open squad position. Get home first; improve your haul on the next run.':'Bank any treasure to add your first final score. All three squad members need a safe escape.'};
 return {title:stage==='qualifiers'?'You’re setting the pace.':'Keep raising the bar.',copy:own.best.value<6?`Your best is ${own.best.value} / 6. Bank ${own.best.value+1} or more to improve it, or match your haul in under ${formatTime(own.best.ticks)}.`:`All six treasure points are home. Match that haul in under ${formatTime(own.best.ticks)} to improve your record.`};
}
export function latestImpact(s,id=s.seat){
 const index=s.attempts.findLastIndex(a=>a.player===id&&!a.example&&a.status!=='active');if(index<0)return null;
 const a=s.attempts[index];if(a.status!=='banked')return {attempt:a,title:a.status==='caught'?'Caught. Your best is safe.':'A fresh route next time.',copy:'No score added. This attempt still counts towards the round limit.'};
 const group=a.stage==='qualifiers'?player(id).guild:null,before={...s,attempts:s.attempts.slice(0,index)},after={...s,attempts:s.attempts.slice(0,index+1)};
 const old=standings(before,a.stage,group).find(r=>r.id===id),now=standings(after,a.stage,group).find(r=>r.id===id);
 let title=!old.best?`You entered at #${now.rank}.`:now.rank<old.rank?`You climbed from #${old.rank} to #${now.rank}.`:compareRuns(now.best,old.best)<0?'A better escape. A stronger record.':'Your previous best still stands.';
 let copy=`${a.value} / 6 · ${formatTime(a.ticks)} · ${a.stage==='qualifiers'?'Guild qualifier':'Final player board'}. Position immediately after this run.`;
 if(a.stage==='finals'){const oldTeam=guildStandings(before).find(g=>g.id===player(id).guild),team=guildStandings(after).find(g=>g.id===player(id).guild);copy+=` Your guild’s haul: ${oldTeam.value} → ${team.value} / 18. ${team.banked} of 3 escapes banked.`;}
 return {attempt:a,title,copy};
}
