// Authored mission rules, separate from the original movement comparison.
export const POWER_SOCKET={x:1500,y:310};
export const VAULT_SOCKET={x:2030,y:310};
export const VAULT_DOOR={x:2220,y:110,w:34,h:350,kind:'vault'};
export function prepareVault(s,annexMission=false){s.annexMission=annexMission;s.vaultMission=true;s.relays=[];s.vaultOpen=false;s.powerRestored=false;s.jobId=annexMission?'east-annex-v1':'sun-vault-v1';Object.assign(s.items.battery,{state:'world',x:1500,y:310,name:'Power cell'});Object.assign(s.items.sun,{x:annexMission?5050:3930,y:310});if(annexMission)Object.assign(s.items.music,{x:4450,y:310});}
export function vaultAction(s){
 if(!s.vaultMission)return null;
 const near=p=>Math.abs(s.x+14-p.x)<58&&Math.abs(s.y+34-p.y)<45;
 for(const relay of missionRelays(s))if(s.vaultOpen&&!s.relays.includes(relay.id)&&near(relay))return {id:relay.id,label:'Release '+relay.name.toLowerCase(),detail:'Disengage this vault seal. Release every seal to free the Sun.',hold:.45};
 if(near(VAULT_SOCKET)){
  if(!s.vaultOpen&&s.loot.includes('battery'))return {id:'unlock-vault',label:'Power the vault',detail:'Install cell. Open the vault; lift stays offline.',hold:.65};
  if(s.loopAlarm&&s.items.battery.state==='vault')return {id:'recover-cell',label:'Retrieve power cell',detail:'Carry it back to the lift socket for a rooftop escape.',hold:.45};
 }
 if(near(POWER_SOCKET)&&s.loopAlarm&&s.loot.includes('battery'))return {id:'restore-lift',label:'Restore the lift',detail:'Give up the cell. Lift running; use the roofs home.',hold:.45};
 return null;
}
export function performVault(s,id){
 if(missionRelays(s).some(r=>r.id===id)&&!s.relays.includes(id)){s.relays.push(id);return s.relays.length===missionRelays(s).length?'All seals released. The Sun is yours to take.':'Seal released. Follow the objective to the next relay.';}
 if(id==='unlock-vault'){s.vaultOpen=true;s.items.battery.state='vault';s.loot=s.loot.filter(x=>x!=='battery');return 'Cell installed. Vault open. Release the brass seals inside.';}
 if(id==='recover-cell'){s.items.battery.state='carried';s.loot.push('battery');return 'Cell recovered. Restore the lift at the brass socket, or leave by the street.';}
 if(id==='restore-lift'){s.items.battery.state='installed';s.loot=s.loot.filter(x=>x!=='battery');s.powered=true;s.powerRestored=true;return 'Lift restored. Street gate closed. Take the rooftops home.';}
 return null;
}
export function guideVaultTarget(s,p,label){
 const dx=p.x-(s.x+14),dy=p.y-(s.y+34);
 const horizontal=Math.abs(dx)<58?'':dx<0?'←':'→';
 const vertical=Math.abs(dy)<45?'':dy<0?'↑':'↓';
 return label+' · '+([horizontal,vertical].filter(Boolean).join(' ')||'NEARBY');
}
export function vaultObjective(s){
 if(s.status==='won')return (s.annexMission?'THE EAST ANNEX':'THE SUN VAULT')+' · HOME SAFE';
 if(!s.vaultOpen)return s.loot.includes('battery')?guideVaultTarget(s,VAULT_SOCKET,'02 · INSTALL CELL AT VAULT'):s.items.battery.state==='world'?guideVaultTarget(s,s.items.battery,'01 · COLLECT POWER CELL'):'02 · OPEN THE VAULT';
 if(!s.loopAlarm){const remaining=missionRelays(s).filter(r=>!s.relays.includes(r.id)).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x));return remaining.length?guideVaultTarget(s,remaining[0],'03 · '+remaining[0].name.toUpperCase()+' · '+s.relays.length+'/'+missionRelays(s).length):guideVaultTarget(s,s.items.sun,'03 · STEAL THE SUN');}
 if(!s.loot.includes('sun'))return guideVaultTarget(s,s.items.sun,'RECOVER THE SUN');
 if(s.x<210)return 'BANK THE SUN AT YOUR HOME DOOR';
 if(s.powerRestored)return '04 · LIFT RUNNING · ← ROOFTOPS HOME';
 if(s.loot.includes('battery'))return guideVaultTarget(s,POWER_SOCKET,'04 · RESTORE LIFT');
 if(s.x>2550)return '04 · ← THROUGH THE STEAM HALL · WATCH THE VENTS';
 if(s.x>1900)return '04 · STREET BELOW · OR RETRIEVE CELL AT VAULT SOCKET';
 return '← STREET HOME · JUMP TRAPS · WATCH THE CARETAKER';
}
export const VAULT_PLATFORMS=[{x:2520,y:385,w:180,h:12},{x:2760,y:310,w:180,h:12},{x:3020,y:245,w:180,h:12},{x:3260,y:310,w:180,h:12},{x:3500,y:385,w:180,h:12},{x:3750,y:310,w:370,h:12}];
export const RELAYS=[{id:'relay-west',x:2630,y:385,name:'West seal'},{id:'relay-east',x:3100,y:245,name:'East seal'}];
export const VENTS=[{x:2800,w:100,offset:0},{x:3460,w:100,offset:1.7}];
export function ventState(time,vent){const t=(time+vent.offset)%4.8;return {phase:t<2.4?'safe':t<3.4?'warning':'active',remaining:t<2.4?2.4-t:t<3.4?3.4-t:4.8-t};}
export function vaultHazards(s){if(!s.vaultMission||s.status!=='playing')return;for(const vent of missionVents(s))if(ventState(s.time,vent).phase==='active'&&s.x+28>vent.x&&s.x<vent.x+vent.w&&s.y+34>350){s.status='dead';s.deathReason='steam';return;}}

// Annex reuses the approach but adds a high route and recoverable lower ledges.
export const ANNEX_PLATFORMS=[{x:4140,y:385,w:180,h:12},{x:4380,y:310,w:180,h:12},{x:4620,y:245,w:180,h:12},{x:4860,y:310,w:360,h:12},{x:4590,y:385,w:160,h:12}];
export const ANNEX_RELAYS=[...RELAYS,{id:'relay-annex',x:4700,y:245,name:'Annex seal'}];
export const ANNEX_VENTS=[...VENTS,{x:4260,w:90,offset:.9},{x:4800,w:100,offset:2.6}];
export const missionRelays=s=>s.annexMission?ANNEX_RELAYS:RELAYS;
export const missionVents=s=>s.annexMission?ANNEX_VENTS:VENTS;
export const missionPlatforms=s=>s.annexMission?[...VAULT_PLATFORMS,...ANNEX_PLATFORMS]:VAULT_PLATFORMS;
