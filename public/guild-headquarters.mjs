import {player,standings,qualifierSquad,guildStandings} from './guild-trial.mjs?v=1';
import {nextGoal} from './guild-goals.mjs?v=1';
import {guildCard} from './guild-cards.mjs?v=1';
import {createGuildSurface,localStorageSafe} from './guild-surface.mjs?v=1';
export function mountHeadquarters({doc=globalThis.document,storage=localStorageSafe(),events=globalThis.window}={}){
 const $=id=>doc.getElementById(id),surface=createGuildSurface({doc,storage,events});
 surface.connect(()=>{const s=surface.state,p=player(s.seat),stage=s.phase==='qualifiers'?'qualifiers':'finals',done=s.phase==='complete',own=standings(s,stage).find(r=>r.id===p.id),team=guildStandings(s).find(g=>g.id===p.guild),roster=stage==='qualifiers'?qualifierSquad(s,p.guild):s.rosters[p.guild],goal=nextGoal(s);
 $('hq-event-stage').textContent=done?'REHEARSAL RESULTS':stage==='qualifiers'?'QUALIFIERS OPEN':'SQUADS LOCKED · FINAL';
 $('hq-event-copy').textContent=done?'The event is closed. Your guild’s story is on the results board.':stage==='qualifiers'?'Three squad places. One rooftop job. Earn your place in the final.':'Your squad is set. Bring home your best escape for the guild.';
 $('hq-places').textContent=stage==='qualifiers'?roster.length+' / 3 squad positions filled':team.banked+' / 3 final escapes banked';
 $('hq-your-best').textContent=own.best?'Your best: '+own.best.value+' / 6'+(own.best.example?' · example':''):'Your best: no escape yet';
 $('hq-enter').textContent=done?'View tournament results →':'Open tournament →';$('hq-enter').setAttribute('href',done?'tournament.html#standings':'tournament.html');
 $('hq-target-title').textContent=goal.title;$('hq-target-copy').textContent=goal.copy;$('guild-cards').innerHTML=guildCard(s,p);
 });return surface;
}
if(typeof document!=='undefined')mountHeadquarters();
