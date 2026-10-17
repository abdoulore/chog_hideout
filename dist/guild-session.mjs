import {loadTrial,saveTrial,beginAttempt,finishAttempt,entryReason,player,guild,standings,usedAttempts,LIMIT,formatTime} from './guild-trial.mjs?v=1';
// One adapter for the existing game. No authoritative identity or competition claims.
export function createGuildSession({storage,context}){
 let attempt=null,receipt='',error='';
 function read(){const r=loadTrial(storage);if(r.error)throw Error(r.error);return r.state;}
 function persist(s){if(!saveTrial(storage,s))throw Error('Rehearsal saving is unavailable. This result was not recorded.');}
 return {
  get active(){return !!attempt;},get receipt(){return receipt;},get error(){return error;},
  label(){return `${player(context.seat)?.name||'Unknown seat'} · ${context.stage==='qualifiers'?'Qualifier':'Squad final'} · LOCAL REHEARSAL`;},
  availability(){try{return entryReason(read(),context.seat,context.stage,context.event);}catch(e){return e.message;}},
  start(){error='';receipt='';try{const s=read(),next=beginAttempt(s,context.seat,context.stage,context.event);persist(next.state);attempt=next.attempt;return true;}catch(e){error=e.message;return false;}},
  finish(run){if(!attempt)return;const id=attempt.id;attempt=null;try{const s=read(),banked=run.status==='won',value=(run.loot||[]).reduce((n,id)=>n+({battery:1,music:2,sun:3}[id]||0),0);const next=finishAttempt(s,id,{status:banked?'banked':'caught',value,ticks:Math.round(run.time*120)});persist(next);const used=usedAttempts(next,context.seat,context.stage);if(banked){const row=standings(next,context.stage).find(p=>p.id===context.seat);receipt=`${value} / 6 · ${formatTime(Math.round(run.time*120))}. ${row.best.id===id?'New best.':'Previous best kept.'} Player rank ${row.rank} for ${guild(row.guild).name}. ${LIMIT-used} attempts left. Local, unverified result.`;}else receipt=`Caught. No score added. ${LIMIT-used} attempts left. Your previous best is safe.`;}catch(e){error=e.message;receipt=e.message;}},
  abandon(){if(!attempt)return;const id=attempt.id;attempt=null;try{persist(finishAttempt(read(),id,{status:'abandoned'}));}catch(e){error=e.message;}},
 };
}
