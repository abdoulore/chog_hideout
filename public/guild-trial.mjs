// Browser-local rehearsal only. These records do not authenticate players or verify runs.
export const TRIAL_KEY='chog-guild-rehearsal:v1';
export const LIMIT=10;
export const GAME_VERSION='one-more-thing-guild-v1';
export const GUILDS=[
 {id:'lantern',name:'Lantern Company',mark:'☀',motto:'A little light. A lot of nerve.',color:'gold',players:['Ari','Pip','Moss','Ember']},
 {id:'copper',name:'Copper Assembly',mark:'⚙',motto:'Every good plan needs an escape.',color:'teal',players:['Sable','Wren','Kip','Rue']}
];
export const PLAYERS=GUILDS.flatMap(g=>g.players.map((name,i)=>({id:g.id+'-'+(i+1),guild:g.id,name})));
export const player=id=>PLAYERS.find(p=>p.id===id);
export const guild=id=>GUILDS.find(g=>g.id===id);
const copy=s=>JSON.parse(JSON.stringify(s));
export function freshTrial(id=globalThis.crypto?.randomUUID?.()||'trial-'+Date.now()){
 return {version:1,id,gameVersion:GAME_VERSION,phase:'qualifiers',seat:PLAYERS[0].id,attempts:[],rosters:{lantern:[],copper:[]},next:1};
}
export function loadTrial(storage){
 try{const raw=storage?.getItem(TRIAL_KEY);if(!raw)return {state:freshTrial(),error:null};const s=JSON.parse(raw);
 if(s.version!==1||s.gameVersion!==GAME_VERSION||typeof s.id!=='string'||!s.id||!['qualifiers','finals','complete'].includes(s.phase)||!player(s.seat)||!Array.isArray(s.attempts)||s.attempts.length>300||!Number.isInteger(s.next)||s.next<1||!s.rosters)throw Error();
 const ids=new Set();for(const a of s.attempts){if(!a||typeof a.id!=='string'||ids.has(a.id)||!player(a.player)||!['qualifiers','finals'].includes(a.stage)||!['active','banked','caught','abandoned'].includes(a.status)||typeof a.example!=='boolean')throw Error();ids.add(a.id);if(a.status==='banked'&&(!Number.isInteger(a.value)||a.value<1||a.value>6||!Number.isInteger(a.ticks)||a.ticks<1))throw Error();}
 for(const g of GUILDS){const r=s.rosters[g.id];if(!Array.isArray(r)||new Set(r).size!==r.length||r.some(id=>player(id)?.guild!==g.id)||r.length>3||(s.phase!=='qualifiers'&&r.length!==3))throw Error();}
 return {state:s,error:null};
 }catch{return {state:freshTrial(),error:'This rehearsal could not be read. Reset it to start a fresh rehearsal. Your solo saves are untouched.'};}
}
export function saveTrial(storage,s){try{if(!storage)throw Error();storage.setItem(TRIAL_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function compareRuns(a,b){return b.value-a.value||a.ticks-b.ticks;}
export function bestRun(s,id,stage=s.phase==='qualifiers'?'qualifiers':'finals'){
 return s.attempts.filter(a=>a.player===id&&a.stage===stage&&a.status==='banked').sort(compareRuns)[0]||null;
}
export function usedAttempts(s,id,stage){return s.attempts.filter(a=>a.player===id&&a.stage===stage&&!a.example).length;}
export function standings(s,stage=s.phase==='qualifiers'?'qualifiers':'finals',group=null){
 const rows=PLAYERS.filter(p=>!group||p.guild===group).map(p=>({...p,best:bestRun(s,p.id,stage)})).sort((a,b)=>a.best&&b.best?compareRuns(a.best,b.best)||a.id.localeCompare(b.id):a.best?-1:b.best?1:a.id.localeCompare(b.id));
 let rank=0;return rows.map((r,i)=>{if(r.best&&(i===0||!rows[i-1].best||compareRuns(rows[i-1].best,r.best)))rank=i+1;return {...r,rank:r.best?rank:null};});
}
export function qualifierSquad(s,gid){return standings(s,'qualifiers',gid).filter(p=>p.best).slice(0,3).map(p=>p.id);}
export function lockReason(s){
 if(s.phase!=='qualifiers')return 'Squads are already locked.';
 if(s.attempts.some(a=>a.status==='active'))return 'Finish or abandon the active run before locking squads.';
 for(const g of GUILDS){const rows=standings(s,'qualifiers',g.id).filter(p=>p.best);if(rows.length<3)return g.name+' needs three successful qualifiers.';if(rows[3]&&compareRuns(rows[2].best,rows[3].best)===0)return 'Third place is tied in '+g.name+'. Play another qualifier to settle the squad place.';}
 return null;
}
export function lockSquads(s){const why=lockReason(s);if(why)throw Error(why);const n=copy(s);for(const g of GUILDS)n.rosters[g.id]=qualifierSquad(s,g.id);n.phase='finals';return n;}
export function guildStandings(s){
 const rows=GUILDS.map(g=>{const members=(s.rosters[g.id]||[]).map(id=>({player:player(id),best:bestRun(s,id,'finals')}));const banked=members.filter(p=>p.best);return {...g,members,qualified:banked.length===3,banked:banked.length,value:banked.reduce((n,p)=>n+p.best.value,0),ticks:banked.reduce((n,p)=>n+p.best.ticks,0),examples:banked.some(p=>p.best.example)};});
 rows.sort((a,b)=>Number(b.qualified)-Number(a.qualified)||b.value-a.value||a.ticks-b.ticks||a.id.localeCompare(b.id));
 let rank=0;return rows.map((r,i)=>{if(r.qualified&&(i===0||!rows[i-1].qualified||r.value!==rows[i-1].value||r.ticks!==rows[i-1].ticks))rank=i+1;return {...r,rank:r.qualified?rank:null};});
}
export function closeReason(s){if(s.phase!=='finals')return 'Start the squad final first.';if(s.attempts.some(a=>a.status==='active'))return 'Finish or abandon the active run first.';if(guildStandings(s).some(g=>!g.qualified))return 'Both guilds need three successful squad runs before results can close.';return null;}
export function closeTrial(s){const why=closeReason(s);if(why)throw Error(why);const n=copy(s);n.phase='complete';return n;}
export function entryReason(s,id,stage,eventId=s.id){
 if(eventId!==s.id)return 'This link belongs to an older rehearsal. Return to Guild Hall.';
 if(!player(id))return 'Choose a rehearsal player in Guild Hall.';
 if(stage!==s.phase||!['qualifiers','finals'].includes(stage))return 'This round has closed. Return to Guild Hall.';
 if(stage==='finals'&&!s.rosters[player(id).guild].includes(id))return 'This player did not make the locked squad. Choose a squad member in Guild Hall.';
 if(usedAttempts(s,id,stage)>=LIMIT)return 'All 10 rehearsal attempts have been used for this round.';
 return null;
}
export function beginAttempt(s,id,stage,eventId=s.id){const why=entryReason(s,id,stage,eventId);if(why)throw Error(why);const n=copy(s);for(const a of n.attempts)if(a.status==='active')a.status='abandoned';const attempt={id:n.id+':'+n.next++,player:id,stage,status:'active',example:false};n.attempts.push(attempt);return {state:n,attempt};}
export function finishAttempt(s,attemptId,{status,value=0,ticks=0}){
 const n=copy(s),a=n.attempts.find(a=>a.id===attemptId);if(!a||a.status!=='active'||a.stage!==s.phase)throw Error('This attempt is no longer active. It was not added to the standings.');
 if(!['banked','caught','abandoned'].includes(status))throw Error('Invalid attempt result.');
 if(status==='banked'&&(!Number.isInteger(value)||value<1||value>6||!Number.isInteger(ticks)||ticks<1))throw Error('Invalid banked result.');
 Object.assign(a,{status,value:status==='banked'?value:0,ticks:status==='banked'?ticks:0});return n;
}
export function fillExamples(s,exclude=s.seat){
 if(s.phase==='complete')throw Error('This rehearsal is complete. Reset to try a different setup.');
 if(s.attempts.some(a=>a.status==='active'))throw Error('Finish or abandon the active run first.');
 const n=copy(s);for(const [i,p] of PLAYERS.entries()){
  if(p.id===exclude||bestRun(n,p.id,n.phase)||(n.phase==='finals'&&!n.rosters[p.guild].includes(p.id)))continue;
  // Fixtures only; never pass these off as real members or validated play.
  n.attempts.push({id:n.id+':'+n.next++,player:p.id,stage:n.phase,status:'banked',value:[1,3,1,1,3,1,4,1][i],ticks:(28+i*3)*120,example:true});
 }return n;
}
export function abandonActive(s){const n=copy(s);for(const a of n.attempts)if(a.status==='active')a.status='abandoned';return n;}
export function formatTime(ticks){return (ticks/120).toFixed(3)+'s';}
export function trialUrl(s,id=s.seat){return 'mischief.html?'+new URLSearchParams({trial:'guild',event:s.id,seat:id,round:s.phase}).toString();}
export function trialContext(search=''){const p=new URLSearchParams(search);return p.get('trial')==='guild'?{event:p.get('event'),seat:p.get('seat'),stage:p.get('round')}:null;}
