import {newRun,stepRun,STEP,FLOOR} from './engine.mjs';
export const MISSION_ID='borrowed-sunshine-v1';
export const HEIST={home:100,vault:2680,pickup:{x:2635,w:110},bridge:{x:880,w:220},gate:{x:1730,y:300,w:60,h:160},width:2850};
const steps=[{x:1900,y:380,w:230,h:6,kind:'step'},{x:1650,y:300,w:220,h:8,kind:'step'}];
const common={heist:true,name:'Borrowed Sunshine',missionId:MISSION_ID,width:HEIST.width,gaps:[HEIST.bridge],spikes:[7,12,48],orbs:[{x:375,y:355},{x:625,y:355},{x:990,y:355},{x:1500,y:355},{x:2010,y:355},{x:1770,y:275},{x:2425,y:355},{x:2670,y:430}]};
export const HEIST_ROOMS={entry:{...common,id:MISSION_ID+':entry',phase:'entry',platforms:[...steps,{...HEIST.bridge,y:FLOOR,h:8,kind:'bridge'}],solids:[]},escape:{...common,id:MISSION_ID+':escape',phase:'escape',platforms:steps,solids:[{...HEIST.gate,kind:'shutter'}]}};
export function newHeist(){const s=newRun(HEIST_ROOMS.entry);return Object.assign(s,{phase:'entry',hasSun:false,clean:true,checkpoint:null,escapeStartedAt:null,escapeTime:0});}
export function stepHeist(s,input,dt=STEP){
 if(s.status!=='playing')return s;
 stepRun(s,input,dt);
 if(s.status!=='playing')return s;
 if(s.phase==='entry'&&s.ground&&s.y+34===FLOOR&&s.x+14>=HEIST.pickup.x&&s.x+14<=HEIST.pickup.x+HEIST.pickup.w){
  s.phase='escape';s.room=HEIST_ROOMS.escape;s.hasSun=true;s.escapeStartedAt=s.time;s.escapeTime=0;
  s.checkpoint={collected:[...s.collected],coins:s.coins};
 }
 if(s.phase==='escape'){s.escapeTime=s.time-s.escapeStartedAt;if(s.hasSun&&s.ground&&s.x<=HEIST.home+40&&s.y+34===FLOOR)s.status='won';}
 return s;
}
export function retryEscape(s){
 if(!s.checkpoint)return newHeist();
 const r=newHeist();Object.assign(r,{room:HEIST_ROOMS.escape,phase:'escape',hasSun:true,clean:false,x:HEIST.vault,y:FLOOR-34,facing:-1,escapeStartedAt:0,checkpoint:{...s.checkpoint,collected:[...s.checkpoint.collected]},collected:[...s.checkpoint.collected],coins:s.checkpoint.coins});return r;
}
export function missionProgress(s){if(s.status==='won')return 100;const half=Math.max(0,Math.min(1,(s.x-HEIST.home)/(HEIST.vault-HEIST.home)));return (s.phase==='escape'?1-half*.5:half*.5)*100;}
export function missionObjective(s){if(s.status==='won')return 'HOME, A LITTLE BRIGHTER';if(s.phase==='entry')return 'RECOVER THE POCKET SUN →';if(s.x>1820&&s.x<2280&&s.y+34>365)return '← SHUTTER CLOSED · TAKE THE ROOFS';if(s.x>1100&&s.x<1500)return '← BRIDGE GONE · JUMP + DASH';return '← BRING THE SUN HOME';}
