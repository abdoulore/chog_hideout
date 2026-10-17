import {GUILDS,player,freshTrial,qualifierSquad,lockReason,lockSquads,closeReason,closeTrial,fillExamples,abandonActive} from './guild-trial.mjs?v=1';
import {createGuildSurface,localStorageSafe} from './guild-surface.mjs?v=1';
export function mountGuildManagement({doc=globalThis.document,storage=localStorageSafe(),events=globalThis.window}={}){
 const $=id=>doc.getElementById(id),surface=createGuildSurface({doc,storage,events});
 surface.connect(()=>{const s=surface.state,done=s.phase==='complete',reason=surface.blocked?'Saving is unavailable.':done?'Results are closed. Reset to rehearse again.':s.phase==='qualifiers'?lockReason(s):closeReason(s);
 $('host-summary').textContent=done?'Results closed':s.phase==='qualifiers'?'Guild qualifiers':'Squad final';
 $('management-rosters').innerHTML=GUILDS.map(g=>{const roster=s.phase==='qualifiers'?qualifierSquad(s,g.id):s.rosters[g.id];return `<div><strong>${g.name}</strong><span>${roster.length} / 3 ${s.phase==='qualifiers'?'provisional places':'locked places'}</span><small>${roster.length?roster.map(id=>player(id).name).join(' · '):'Awaiting qualifiers'}</small></div>`;}).join('');
 $('advance-round').textContent=done?'Rehearsal complete':s.phase==='qualifiers'?'Lock squads & start final →':'Close rehearsal & award trophy →';$('advance-round').disabled=!!reason;
 $('advance-reason').textContent=reason||(s.phase==='qualifiers'?'Both squads are ready. Locking ends qualifiers and starts fresh final scores.':'Both squads have three escapes. Close now, or return to compete and improve.');
 $('fill-examples').disabled=surface.blocked||done;$('abandon-run').hidden=!s.attempts.some(a=>a.status==='active');
 });
 $('advance-round').onclick=()=>surface.change(s=>s.phase==='qualifiers'?lockSquads(s):closeTrial(s),surface.state.phase==='qualifiers'?'Squads locked. Return to the tournament for your final runs.':'Rehearsal complete. Return to the tournament for results.');
 $('fill-examples').onclick=()=>surface.change(s=>fillExamples(s),'Empty seats filled with labelled examples. Your selected seat is left for you to play.');
 $('abandon-run').onclick=()=>surface.change(abandonActive,'Unfinished attempt abandoned. It still counts towards the limit.');
 $('reset-trial').onclick=()=>$('reset-dialog').showModal();
 $('confirm-reset').onclick=()=>{if(surface.change(()=>freshTrial(),'Fresh rehearsal ready. Solo records were not changed.',{reset:true}))$('reset-dialog').close();};
 return surface;
}
if(typeof document!=='undefined')mountGuildManagement();
