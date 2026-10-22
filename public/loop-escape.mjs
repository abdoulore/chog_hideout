import {VAULT_DOOR,missionPlatforms} from './vault-mission.mjs';
// Isolated room experiment. No records or competitive submissions.
export const LOOP_GATE={x:1188,y:110,w:34,h:280,kind:'alarm-shutter'};
export const LOOP_WARNING=1.2;
export const DEPOT_GATE={...LOOP_GATE,x:2220};
export const loopGate=s=>s.annexMission?{...DEPOT_GATE,x:4860}:s.loopExtended?DEPOT_GATE:LOOP_GATE;
export const DEPOT_PLATFORMS=[
 {x:1660,y:245,w:140,h:12},{x:1900,y:310,w:180,h:12},
 {x:2280,y:310,w:270,h:12},
 {x:1630,y:385,w:180,h:12},{x:2130,y:385,w:120,h:12}
];
export function prepareLoop(s,extended=false){s.loopExtended=extended;
 s.loopTrial=true;s.jobId=extended?'sunloop-depot-v1':'sunloop-v1';s.items.battery.state='installed';
 Object.assign(s.items.sun,{x:extended?2400:1370,y:310});Object.assign(s.items.music,{x:900,y:385,hold:1.1,state:'world'});
 s.loopAlarm=false;s.loopWarning=0;s.loopGateClosed=false;s.loopReturnStarted=false;
 s.caretaker.x=1460;s.caretaker.target=1510;s.caretaker.facing=1;
 return s;
}
export function loopRoom(room,s){
 if(!s?.loopTrial)return room;
 return {...room,id:s.loopExtended?'sunloop-depot-v1':'sunloop-v1',name:'The Sunloop',width:s.annexMission?5350:s.vaultMission?4300:s.loopExtended?2660:room.width,spikes:s.loopExtended?[35,39]:room.spikes,platforms:[...room.platforms,...(s.vaultMission?missionPlatforms(s):[]),{x:840,y:385,w:125,h:12},...(s.loopExtended?DEPOT_PLATFORMS:[])],solids:[...room.solids,...(s.annexMission?[{x:3840,y:-2000,w:40,h:2460,kind:'annex-boundary'}]:[]),...(s.vaultMission&&!s.vaultOpen?[{...VAULT_DOOR}]:[]),...(s.loopGateClosed?[{...loopGate(s)}]:[])]};
}
export function ringLoopAlarm(s){
 if(s.loopAlarm)return false;
 s.loopAlarm=true;s.loopWarning=LOOP_WARNING;s.powered=false;
 // The alarm sends the caretaker to the street junction, not to an unseen player.
 Object.assign(s.caretaker,{mode:'investigate',target:1000,notice:.8,wait:s.loopExtended?8:3.2});
 return true;
}
export function advanceLoop(s,dt){
 if(!s.loopTrial||!s.loopAlarm)return;
 s.loopWarning=Math.max(0,s.loopWarning-dt);
 const g=loopGate(s),inside=s.x<g.x+g.w&&s.x+28>g.x&&s.y<g.y+g.h&&s.y+34>g.y;
 if(s.loopWarning===0&&!inside)s.loopGateClosed=true;
 if(s.x<g.x&&s.y+34>400)s.loopReturnStarted=true;
}
export function loopObjective(s){
 if(s.status==='won')return s.loot.includes('music')?'SUN + MUSIC · HOME SAFE':'POCKET SUN · HOME SAFE';
 if(!s.loopAlarm)return s.loopExtended?(s.x<1200?'01 · OVER THE ROOFTOPS →':s.x<2220?'02 · HIGH ROOFS OR LOWER LEDGES →':'STEAL THE POCKET SUN'):'ROOFTOPS → STEAL THE POCKET SUN';
 if(!s.loot.includes('sun'))return 'RECOVER THE SUN BEFORE GOING HOME';
 if(s.loopWarning>0)return `ALARM · UPPER GATE CLOSES IN ${s.loopWarning.toFixed(1)}s`;
 if(s.x>=loopGate(s).x)return 'SWIPE ↓ · STREET EXIT BELOW';
 if(s.loopExtended&&s.x>1600)return '03 · ← SERVICE WALK · JUMP THE TRAPS';
 if(s.x<210)return 'BANK THE SUN AT YOUR HOME DOOR';
 return s.x>790&&!s.loot.includes('music')?'← HOME · MUSIC BOX ABOVE: RISK IT?':'← FOLLOW THE STREET HOME';
}
