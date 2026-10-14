export const W=900,H=520,FLOOR=460,STEP=1/120;
export const MOVE={speed:265,jump:555,gravity:1500,dashSpeed:720,dashDuration:.18,dashCooldown:1,coyote:.12,jumpBuffer:.14};
export const ROOMS=[
 {id:'v3-0',width:2200,name:'The warm-up',hint:'Jump the traps. Dash with Shift or X. Reach the flag.',spikes:[6,12,19,20,30,37],gaps:[{x:1150,w:130}],platforms:[{x:820,y:370,w:180,h:16}],orbs:[{x:325,y:355},{x:625,y:355},{x:975,y:355},{x:1560,y:355},{x:1880,y:355}]},
 {id:'v3-1',width:3800,name:'Mind the gap',hint:'Jump first, then dash in the air to cross the wide gaps.',spikes:[6,13,14,29,36,46,59,67],gaps:[{x:1000,w:220},{x:2500,w:220}],platforms:[{x:1570,y:370,w:150,h:16},{x:2950,y:370,w:150,h:16}],orbs:[{x:325,y:355},{x:700,y:355},{x:1440,y:355},{x:1830,y:355},{x:2330,y:355},{x:2800,y:355},{x:3380,y:355}]},
 {id:'v3-2',width:5200,name:'The long getaway',hint:'Keep your rhythm. Save your dash for the wide gaps.',spikes:[5,11,12,27,33,41,50,51,65,71,84,89,97],gaps:[{x:850,w:220},{x:2750,w:220},{x:3750,w:220}],platforms:[{x:1800,y:370,w:150,h:16},{x:4300,y:370,w:150,h:16}],orbs:[{x:275,y:355},{x:600,y:355},{x:1200,y:355},{x:1650,y:355},{x:2080,y:355},{x:2575,y:355},{x:3200,y:355},{x:3580,y:355},{x:4050,y:355},{x:4500,y:355},{x:4880,y:355}]}
];
export const MOVEMENT_ROOM={id:'movement-v3',width:2850,name:'The Burrows',spikes:[8,19,35,46,50],gaps:[{x:1250,w:220}],platforms:[{x:580,y:370,w:180,h:16},{x:2050,y:370,w:160,h:16}],orbs:[{x:425,y:355},{x:690,y:330},{x:975,y:355},{x:1530,y:430},{x:1775,y:355},{x:2150,y:330},{x:2325,y:355},{x:2525,y:355}]};
export function groundSegments(room){let x=0,out=[];for(const gap of room.gaps||[]){out.push({x,y:FLOOR,w:gap.x-x,h:120});x=gap.x+gap.w;}out.push({x,y:FLOOR,w:(room.width||W)-x,h:120});return out;}
export function cameraFrame(s,displayWidth=900){const zoom=displayWidth<600?1.5:1.05;const viewWidth=W/zoom;return {zoom,x:Math.max(0,Math.min((s.room.width||W)-viewWidth,s.x-viewWidth*.28)),y:FLOOR*(1-1/zoom)};}
export function newRun(room){return {room,x:55,y:FLOOR-34,vx:0,vy:0,facing:1,ground:true,coyote:MOVE.coyote,jumpBuffer:0,dashTime:0,dashCooldown:0,dashes:0,time:0,status:'playing',deathReason:'',coins:0,collected:[],trail:[],sample:0};}
export const spikeBounds=slot=>({x:slot*50+10,y:FLOOR-23,w:30,h:23});
export function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
export function stepRun(s,input,dt=STEP){
 if(s.status!=='playing')return s;
 s.time+=dt;s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);if(input.jump)s.jumpBuffer=MOVE.jumpBuffer;
 s.coyote=s.ground?MOVE.coyote:Math.max(0,s.coyote-dt);
 s.dashCooldown=Math.max(0,s.dashCooldown-dt);s.dashTime=Math.max(0,s.dashTime-dt);
 const direction=(input.right?1:0)-(input.left?1:0);if(direction&&s.dashTime===0)s.facing=direction;
 if(input.dash&&s.dashCooldown===0){s.dashTime=MOVE.dashDuration;s.dashCooldown=MOVE.dashCooldown;s.dashes++;}
 s.vx=s.dashTime>0?s.facing*MOVE.dashSpeed:direction*MOVE.speed;
 if(s.jumpBuffer>0&&s.coyote>0){s.vy=-MOVE.jump;s.ground=false;s.coyote=0;s.jumpBuffer=0;}
 const oldBottom=s.y+34,oldX=s.x,oldY=s.y;if(s.dashTime===0)s.vy+=MOVE.gravity*dt;s.x=Math.max(8,Math.min((s.room.width||W)-36,s.x+s.vx*dt));// Resolve solid walls horizontally before integrating vertical movement.
 for(const p of s.room.solids||[]){if(s.y+34>p.y&&s.y<p.y+p.h&&s.x+28>p.x&&s.x<p.x+p.w){
  if(oldX+28<=p.x){s.x=p.x-28;s.vx=0;}else if(oldX>=p.x+p.w){s.x=p.x+p.w;s.vx=0;}
 }}
 if(s.dashTime===0)s.y+=s.vy*dt;s.ground=false;
 for(const p of s.room.solids||[]){if(s.vy<0&&oldY>=p.y+p.h&&s.y<p.y+p.h&&s.x+28>p.x&&s.x<p.x+p.w){s.y=p.y+p.h;s.vy=0;}}

 for(const p of [...s.room.platforms,...groundSegments(s.room),...(s.room.solids||[])]){
  if(s.vy>=0&&oldBottom<=p.y+.1&&s.y+34>=p.y&&s.x+28>p.x&&s.x<p.x+p.w){s.y=p.y-34;s.vy=0;s.ground=true;}
 }
 for(const slot of s.room.spikes){if(overlap({x:s.x+5,y:s.y+4,w:18,h:30},spikeBounds(slot))){s.status='dead';s.deathReason='spikes';break;}}
 if(s.y>H+50){s.status='dead';s.deathReason='gap';}
 s.room.orbs.forEach((o,i)=>{if(!s.collected.includes(i)&&Math.hypot(s.x+14-o.x,s.y+17-o.y)<30){s.collected.push(i);s.coins++;}});
 if(!s.room.heist&&s.status==='playing'&&s.x>(s.room.width||W)-74&&s.y+34>390)s.status='won';
 s.sample+=dt;if(s.sample>=1/30){s.trail.push({x:s.x,y:s.y,t:s.time,dash:s.dashTime>0});s.sample=0;}
 return s;
}
export const OPPONENTS={charger:{name:'The Charger',description:'Strikes twice, then catches its breath.',pattern:['strike','strike','recover'],hp:26},turtle:{name:'The Turtle',description:'Guards twice, strikes, then recovers.',pattern:['guard','guard','strike','recover'],hp:26},switch:{name:'The Switch',description:'Alternates attacks and defence. Watch the next move.',pattern:['strike','guard','recover','strike','guard'],hp:26}};
export function simulateFight(rules,opponent='charger'){
 const enemy=OPPONENTS[opponent];if(!enemy)throw Error('Unknown opponent');
 let p={hp:24,stamina:9},e={hp:enemy.hp,stamina:9},frames=[],exhausted=0,blocked=0;
 for(let i=0;i<24&&p.hp>0&&e.hp>0;i++){
  let ea=enemy.pattern[i%enemy.pattern.length];if(e.stamina<(ea==='strike'?3:ea==='guard'?1:0))ea='recover';
  let pa=rules.threshold>=0&&p.stamina<=rules.threshold?'recover':ea==='strike'?rules.response:rules.fallback==='patient'?(ea==='guard'?'recover':'strike'):rules.fallback;
  const before={p:{...p},e:{...e}};let why=pa==='recover'&&rules.threshold>=0&&p.stamina<=rules.threshold?'Low stamina rule':ea==='strike'?'Response to incoming strike':'Default action';
  let actual=pa;if(p.stamina<(pa==='strike'?3:pa==='guard'?1:0)){actual='fizzle';exhausted++;why='Too exhausted to act';}
  const cost=a=>a==='strike'?3:a==='guard'?1:a==='recover'?-4:-1;
  p.stamina=Math.max(0,Math.min(9,p.stamina-cost(actual)));e.stamina=Math.max(0,Math.min(9,e.stamina-cost(ea)));
  let pd=ea==='strike'?(actual==='guard'?1:4):actual==='strike'&&ea==='guard'?2:0;
  let ed=actual==='strike'?(ea==='guard'?1:4):ea==='strike'&&actual==='guard'?2:0;
  if(actual==='guard'&&ea==='strike')blocked+=3;
  p.hp=Math.max(0,p.hp-pd);e.hp=Math.max(0,e.hp-ed);
  frames.push({turn:i+1,pa:actual,ea,why,p:{...p},e:{...e},before,pd,ed});
 }
 const result=p.hp<=0&&e.hp<=0?'draw':e.hp<=0?'win':p.hp<=0?'loss':'draw';
 return {result,frames,p,e,exhausted,blocked,rules:{...rules},opponent};
}
