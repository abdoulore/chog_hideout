import {GUILDS,PLAYERS,player,guild,loadTrial,saveTrial} from './guild-trial.mjs?v=1';
export function localStorageSafe(){try{return globalThis.localStorage;}catch{return null;}}
// Shared local state for headquarters and management; route changes retain the selected seat.
export function createGuildSurface({doc,storage,events}){
 const $=id=>doc.getElementById(id),loaded=loadTrial(storage);let state=loaded.state,blocked=!!loaded.error,paint=()=>{};
 function notify(message){$('hall-notice').hidden=!message;$('hall-notice').textContent=message||'';}
 if(blocked)notify(loaded.error);else if(!saveTrial(storage,state)){blocked=true;notify('Browser saving is unavailable. Rehearsal changes cannot be recorded; solo play is still available.');}
 $('player-seat').innerHTML=GUILDS.map(g=>`<optgroup label="${g.name}">${PLAYERS.filter(p=>p.guild===g.id).map(p=>`<option value="${p.id}">${p.name} · ${g.name}</option>`).join('')}</optgroup>`).join('');
 function identity(){const p=player(state.seat),g=guild(p.guild);$('player-seat').value=p.id;$('guild-name').textContent=g.name;$('your-crest').textContent=g.mark;$('your-crest').classList.toggle('teal',g.color==='teal');$('guild-identity-copy').textContent='Playing as '+p.name+' · Local rehearsal seat';}
 function render(){identity();paint();}
 function change(fn,message,{reset=false}={}){try{const current=loadTrial(storage);if(current.error&&!reset)throw Error(current.error);const next=fn(current.state);if(!saveTrial(storage,next))throw Error('Could not save this rehearsal. No change was recorded.');state=next;blocked=false;notify(message);render();return true;}catch(e){notify(e.message);return false;}}
 function refresh(){const current=loadTrial(storage);if(current.error){blocked=true;notify(current.error);}else state=current.state;render();}
 $('player-seat').onchange=e=>change(s=>({...s,seat:player(e.target.value)?.id||s.seat}),'Rehearsal seat changed.');
 events?.addEventListener?.('storage',refresh);events?.addEventListener?.('pageshow',refresh);
 return {get state(){return state;},get blocked(){return blocked;},change,notify,connect(fn){paint=fn;render();},render,destroy(){events?.removeEventListener?.('storage',refresh);events?.removeEventListener?.('pageshow',refresh);}};
}
