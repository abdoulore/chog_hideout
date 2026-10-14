// Presentation-only feedback. The movement simulation never reads this state.
export const snapshot=s=>({x:s.x,y:s.y,ground:s.ground,vy:s.vy,dashes:s.dashes,collected:[...s.collected],status:s.status,phase:s.phase});
export function createFeedback({reducedMotion=false,random=Math.random}={}){
 const state={particles:[],clock:0,land:0,jump:0,dash:0,impact:0,victory:0,pickup:0,stride:0};let footDistance=0;
 function burst(x,y,count,color,speed=65){if(reducedMotion)return;for(let i=0;i<count;i++){const angle=random()*Math.PI*2,v=speed*(.4+random()*.6);state.particles.push({x,y,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v-25,age:0,life:.28+random()*.35,size:1.5+random()*2,color});}state.particles=state.particles.slice(-100);}
 return {state,reset(){for(const k of Object.keys(state))state[k]=k==='particles'?[]:0;footDistance=0;},
 observe(before,s){const sounds=[],x=s.x+14,y=s.y+34,dx=Math.abs(s.x-before.x);state.stride+=dx*.065;
  if(s.vy<0&&before.vy>=0){state.jump=.18;burst(x,y,7,'#efd8ad',55);sounds.push('jump');}
  if(!before.ground&&s.ground){state.land=.16;burst(x,y,10,'#eed0a1',78);sounds.push('land');}
  if(s.dashes>before.dashes){state.dash=.2;burst(x,y-25,12,'#dab0f4',100);sounds.push('dash');}
  if(s.ground&&s.dashTime===0&&s.status==='playing'&&dx>0){footDistance+=dx;if(footDistance>=55){footDistance%=55;burst(x,y-1,3,'#eac89c',28);sounds.push('step');}}
  for(const i of s.collected)if(!before.collected.includes(i)){const o=s.room.orbs[i];burst(o.x,o.y,14,'#ffe2a0',90);sounds.push('spark');}
  if(before.phase==='entry'&&s.phase==='escape'){state.pickup=1;burst(x,y-45,24,'#ffe3a1',90);sounds.push('pickup');}
  if(before.status==='playing'&&s.status==='dead'){state.impact=.3;burst(x,y-22,18,'#ecc6f7',100);sounds.push('hurt');}
  if(before.status==='playing'&&s.status==='won'){state.victory=.8;burst(x,y-40,28,'#ffe0a0',130);sounds.push('win');}
  return sounds;
 },update(dt){state.clock+=dt;for(const k of ['land','jump','dash','impact','victory','pickup'])state[k]=Math.max(0,state[k]-dt);for(const p of state.particles){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=115*dt;}state.particles=state.particles.filter(p=>p.age<p.life);}};
}
