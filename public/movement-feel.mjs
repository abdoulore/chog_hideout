// The new heist opts into this profile; the original timed raids keep their physics.
export const FEEL={acceleration:6000,brake:9000,turn:8500,air:4800,ledgeHeight:12,ledgeReach:18};
export const platformKey=p=>p.kind==='lift'?'lift':`${p.x}:${p.y}:${p.w}`;
export const ignoringPlatform=(s,p)=>(s.dropThrough||[]).includes(platformKey(p));
const approach=(value,target,amount)=>value<target?Math.min(target,value+amount):Math.max(target,value-amount);
export function runVelocity(s,direction,speed,dt){
 const target=direction*speed,turning=direction&&s.vx*direction<0;
 const rate=!direction?FEEL.brake:turning?FEEL.turn:s.ground?FEEL.acceleration:FEEL.air;
 return approach(s.vx,target,rate*dt);
}
export function assistLedge(s,oldBottom,direction){
 if(s.ground||s.dashTime>0||!direction||s.vy< -100||s.vy>180)return false;
 for(const p of s.room.platforms){
  if(ignoringPlatform(s,p))continue;
  // Only a near miss at the lip. Never rescue a low jump through a platform/wall.
  const edge=direction>0?p.x:p.x+p.w,front=direction>0?s.x+28:s.x;
  const inside=(front-edge)*direction;
  if(inside<0||inside>FEEL.ledgeReach||s.y+34<=p.y||s.y+34>p.y+FEEL.ledgeHeight||oldBottom>p.y+FEEL.ledgeHeight)continue;
  if((s.room.solids||[]).some(b=>s.x<b.x+b.w&&s.x+28>b.x&&p.y>b.y&&p.y-34<b.y+b.h))continue;
  s.y=p.y-34;s.vy=0;s.ground=true;s.ledgeCatch=.16;return true;
 }
 return false;
}
