// Isolated room experiment. No records or competitive submissions.
export const LOOP_GATE={x:1188,y:110,w:34,h:280,kind:'alarm-shutter'};
export const LOOP_WARNING=1.2;
export function prepareLoop(s){
 s.loopTrial=true;s.jobId='sunloop-v1';s.items.battery.state='installed';
 Object.assign(s.items.sun,{x:1370,y:310});Object.assign(s.items.music,{x:900,y:385,hold:1.1,state:'world'});
 s.loopAlarm=false;s.loopWarning=0;s.loopGateClosed=false;s.loopReturnStarted=false;
 s.caretaker.x=1460;s.caretaker.target=1510;s.caretaker.facing=1;
 return s;
}
export function loopRoom(room,s){
 if(!s?.loopTrial)return room;
 return {...room,id:'sunloop-v1',name:'The Sunloop',platforms:[...room.platforms,{x:840,y:385,w:125,h:12}],solids:[...room.solids,...(s.loopGateClosed?[{...LOOP_GATE}]:[])]};
}
export function ringLoopAlarm(s){
 if(s.loopAlarm)return false;
 s.loopAlarm=true;s.loopWarning=LOOP_WARNING;s.powered=false;
 // The alarm sends the caretaker to the street junction, not to an unseen player.
 Object.assign(s.caretaker,{mode:'investigate',target:1000,notice:.8,wait:3.2});
 return true;
}
export function advanceLoop(s,dt){
 if(!s.loopTrial||!s.loopAlarm)return;
 s.loopWarning=Math.max(0,s.loopWarning-dt);
 const g=LOOP_GATE,inside=s.x<g.x+g.w&&s.x+28>g.x&&s.y<g.y+g.h&&s.y+34>g.y;
 if(s.loopWarning===0&&!inside)s.loopGateClosed=true;
 if(s.x<g.x&&s.y+34>400)s.loopReturnStarted=true;
}
export function loopObjective(s){
 if(s.status==='won')return s.loot.includes('music')?'SUN + MUSIC · HOME SAFE':'POCKET SUN · HOME SAFE';
 if(!s.loopAlarm)return 'ROOFTOPS → STEAL THE POCKET SUN';
 if(!s.loot.includes('sun'))return 'RECOVER THE SUN BEFORE GOING HOME';
 if(s.loopWarning>0)return `ALARM · UPPER GATE CLOSES IN ${s.loopWarning.toFixed(1)}s`;
 if(s.x>=LOOP_GATE.x)return 'SWIPE ↓ · STREET EXIT BELOW';
 if(s.x<210)return 'BANK THE SUN AT YOUR HOME DOOR';
 return s.x>790&&!s.loot.includes('music')?'← HOME · MUSIC BOX ABOVE: RISK IT?':'← FOLLOW THE STREET HOME';
}
