// Presentation-only feedback. The movement simulation never reads this state.
export const snapshot=s=>({x:s.x,y:s.y,vx:s.vx,facing:s.facing,loot:[...(s.loot||[])],ground:s.ground,vy:s.vy,dashes:s.dashes,collected:[...s.collected],status:s.status,phase:s.phase,guardMode:s.caretaker?.mode});
export function createFeedback({reducedMotion=false,random=Math.random}={}){
 const state={particles:[],clock:0,land:0,jump:0,dash:0,impact:0,victory:0,pickup:0,stride:0,turn:0,brake:0,pluck:0,landStrength:1,alert:0};let footDistance=0;
 function burst(x,y,count,color,speed=65){if(reducedMotion)return;for(let i=0;i<count;i++){const angle=random()*Math.PI*2,v=speed*(.4+random()*.6);state.particles.push({x,y,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v-25,age:0,life:.28+random()*.35,size:1.5+random()*2,color});}state.particles=state.particles.slice(-100);}
 return {state,reset(){for(const k of Object.keys(state))state[k]=k==='particles'?[]:0;footDistance=0;},
 observe(before,s){const sounds=[],x=s.x+14,y=s.y+34,dx=Math.abs(s.x-before.x);if(s.ground&&s.dashTime===0)state.stride+=dx/110*Math.PI*2;
  if(s.room.mischief){if(before.facing!==undefined&&s.facing!==before.facing&&Math.abs(before.vx)>80){state.turn=.16;burst(x,y,5,'#efd8ad',50);}
   if(s.ground&&Math.abs(before.vx)>120&&Math.abs(s.vx)<40){state.brake=.12;burst(x,y,4,'#efd8ad',45);}
   for(const id of s.loot||[])if(!(before.loot||[]).includes(id)){state.pluck=.35;state.pickup=.5;burst(x,y-40,14,id==='battery'?'#a8e4dc':id==='music'?'#ecc0f7':'#ffe4a0',75);sounds.push('take-'+id);}
   if(s.caretaker?.mode==='chase'&&before.guardMode!=='chase'&&s.status==='playing'){state.alert=1.1;sounds.push('spotted');}
  }
  if(s.vy<0&&before.vy>=0){state.jump=.18;burst(x,y,7,'#efd8ad',55);sounds.push('jump');}
  if(!before.ground&&s.ground){state.land=.16;state.landStrength=s.room.mischief?Math.max(.35,Math.min(1.4,Math.abs(before.vy)/550)):1;burst(x,y,Math.round(8*state.landStrength),'#eed0a1',55+state.landStrength*30);
   const platform=s.room.platforms?.find(p=>s.x+28>p.x&&s.x<p.x+p.w&&Math.abs(y-p.y)<3);
   const material=platform?.kind==='lift'?'metal':platform?'wood':'stone';sounds.push(s.room.mischief?'land-'+material+(state.landStrength>1.1?'-heavy':''):'land');footDistance=0;}
  if(s.dashes>before.dashes){state.dash=.2;burst(x,y-25,12,'#dab0f4',100);sounds.push('dash');}
  if(s.ground&&s.dashTime===0&&s.status==='playing'&&dx>0){footDistance+=dx;if(footDistance>=55){footDistance%=55;burst(x,y-1,3,'#eac89c',28);sounds.push('step');}}
  for(const i of s.collected)if(!before.collected.includes(i)){const o=s.room.orbs[i];burst(o.x,o.y,14,'#ffe2a0',90);sounds.push('spark');}
  if(!s.room.mischief&&before.phase==='entry'&&s.phase==='escape'){state.pickup=1;burst(x,y-45,24,'#ffe3a1',90);sounds.push('pickup');}
  if(before.status==='playing'&&s.status==='dead'){state.impact=.3;burst(x,y-22,18,'#ecc6f7',100);sounds.push('hurt');}
  if(before.status==='playing'&&s.status==='won'){state.victory=.8;burst(x,y-40,28,'#ffe0a0',130);sounds.push('win');}
  return sounds;
 },update(dt){state.clock+=dt;for(const k of ['land','jump','dash','impact','victory','pickup','turn','brake','pluck','alert'])state[k]=Math.max(0,state[k]-dt);for(const p of state.particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=115*dt;}state.particles=state.particles.filter(p=>p.age<p.life);}};
}
