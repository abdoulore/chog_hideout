// Authored mission rules, separate from the original movement comparison.
export const POWER_SOCKET={x:1500,y:310};
export const VAULT_SOCKET={x:2030,y:310};
export const VAULT_DOOR={x:2220,y:110,w:34,h:350,kind:'vault'};
export function prepareVault(s){s.vaultMission=true;s.relays=[];s.vaultOpen=false;s.powerRestored=false;s.jobId='sun-vault-v1';Object.assign(s.items.battery,{state:'world',x:1500,y:310,name:'Power cell'});Object.assign(s.items.sun,{x:3930,y:310});}
export function vaultAction(s){
 if(!s.vaultMission)return null;
 const near=p=>Math.abs(s.x+14-p.x)<58&&Math.abs(s.y+34-p.y)<45;
 for(const relay of RELAYS)if(s.vaultOpen&&!s.relays.includes(relay.id)&&near(relay))return {id:relay.id,label:'Release '+relay.name.toLowerCase(),detail:'Disengage this vault seal. Both seals release the Sun.',hold:.45};
 if(near(VAULT_SOCKET)){
  if(!s.vaultOpen&&s.loot.includes('battery'))return {id:'unlock-vault',label:'Power the vault',detail:'Install cell. Open the vault; lift stays offline.',hold:.65};
  if(s.loopAlarm&&s.items.battery.state==='vault')return {id:'recover-cell',label:'Retrieve power cell',detail:'Carry it back to the lift socket for a rooftop escape.',hold:.45};
 }
 if(near(POWER_SOCKET)&&s.loopAlarm&&s.loot.includes('battery'))return {id:'restore-lift',label:'Restore the lift',detail:'Give up the cell. Lift running; use the roofs home.',hold:.45};
 return null;
}
export function performVault(s,id){
 if(RELAYS.some(r=>r.id===id)&&!s.relays.includes(id)){s.relays.push(id);return s.relays.length===2?'Both seals released. The Sun is yours to take.':'First seal released. Find the other brass relay.';}
 if(id==='unlock-vault'){s.vaultOpen=true;s.items.battery.state='vault';s.loot=s.loot.filter(x=>x!=='battery');return 'Vault powered. Take the Sun. The lift is still offline.';}
 if(id==='recover-cell'){s.items.battery.state='carried';s.loot.push('battery');return 'Cell recovered. Restore the lift at the brass socket, or leave by the street.';}
 if(id==='restore-lift'){s.items.battery.state='installed';s.loot=s.loot.filter(x=>x!=='battery');s.powered=true;s.powerRestored=true;return 'Lift restored. Street gate closed. Take the rooftops home.';}
 return null;
}
export function vaultObjective(s){
 if(s.status==='won')return 'THE SUN VAULT · HOME SAFE';
 if(!s.vaultOpen)return s.loot.includes('battery')?'02 · CARRY CELL → VAULT SOCKET':s.items.battery.state==='world'?'01 · FIND THE POWER CELL →':'02 · OPEN THE VAULT';
 if(!s.loopAlarm)return s.relays.length<2?'03 · RELEASE BOTH SEALS · '+s.relays.length+' / 2':'03 · SEALS OPEN → STEAL THE SUN';
 if(!s.loot.includes('sun'))return 'RECOVER THE SUN BEFORE LEAVING';
 if(s.x<210)return 'BANK THE SUN AT YOUR HOME DOOR';
 if(s.powerRestored)return '04 · LIFT RUNNING · ← ROOFTOPS HOME';
 if(s.loot.includes('battery'))return '04 · ← RESTORE LIFT AT BRASS SOCKET';
 if(s.x>2550)return '04 · ← THROUGH THE STEAM HALL · WATCH THE VENTS';
 if(s.x>1900)return '04 · STREET BELOW · OR RETRIEVE CELL AT VAULT SOCKET';
 return '← STREET HOME · JUMP TRAPS · WATCH THE CARETAKER';
}
export const VAULT_PLATFORMS=[{x:2520,y:385,w:180,h:12},{x:2760,y:310,w:180,h:12},{x:3020,y:245,w:180,h:12},{x:3260,y:310,w:180,h:12},{x:3500,y:385,w:180,h:12},{x:3750,y:310,w:370,h:12}];
export const RELAYS=[{id:'relay-west',x:2630,y:385,name:'West seal'},{id:'relay-east',x:3100,y:245,name:'East seal'}];
export const VENTS=[{x:2800,w:100,offset:0},{x:3460,w:100,offset:1.7}];
export function ventState(time,vent){const t=(time+vent.offset)%4.8;return {phase:t<2.4?'safe':t<3.4?'warning':'active',remaining:t<2.4?2.4-t:t<3.4?3.4-t:4.8-t};}
export function vaultHazards(s){if(!s.vaultMission||s.status!=='playing')return;for(const vent of VENTS)if(ventState(s.time,vent).phase==='active'&&s.x+28>vent.x&&s.x<vent.x+vent.w&&s.y+34>350){s.status='dead';s.deathReason='steam';return;}}
