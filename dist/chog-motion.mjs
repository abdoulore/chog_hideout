// Continuous in-between motion using the existing illustrated poses.
// Presentation never changes the collision body or delays an input.
export function chogPose(s,fx={},reducedMotion=false){
 const stride=fx.stride??s.time*20,speed=Math.min(1,Math.abs(s.vx)/265),moving=s.ground&&speed>.03;
 let frame=s.dashTime>0?6:!s.ground?(s.vy<0?4:5):fx.land>.09?7:moving?[1,2,3,2][Math.floor(stride/(Math.PI/2))%4]:0;
 const pose={frame,x:0,y:0,angle:0,sx:1,sy:1};if(reducedMotion)return pose;
 const landing=Math.sin(Math.min(1,(fx.land||0)/.16)*Math.PI),takeoff=Math.sin(Math.min(1,(fx.jump||0)/.18)*Math.PI),step=Math.sin(stride*2);
 const weight=fx.landStrength??1;pose.sx+=landing*.12*weight-takeoff*.07;pose.sy+=takeoff*.12-landing*.12*weight;
 if(moving&&s.dashTime===0){pose.y=-Math.abs(Math.sin(stride))*2.8*speed;pose.sy+=step*.025*speed;pose.sx-=step*.018*speed;pose.angle=.055*speed;}
 if(!s.ground&&s.dashTime===0){pose.angle=Math.max(-.06,Math.min(.08,-s.vy/5500));pose.sy+=Math.min(.07,Math.max(0,s.vy)/6500);}
 if(fx.turn>0){const t=fx.turn/.16;pose.angle-=Math.sin(t*Math.PI)*.12;pose.sy-=Math.sin(t*Math.PI)*.045;}
 if(fx.brake>0)pose.angle-=Math.sin(fx.brake/.12*Math.PI)*.09;
 if(s.ledgeCatch>0){pose.y+=s.ledgeCatch/.16*7;pose.sx+=.05;pose.sy-=.05;}
 if(s.action&&s.actionTime>0){const tug=Math.sin(Math.min(1,s.actionTime/.45)*Math.PI);pose.frame=0;pose.angle=-.11*tug;pose.x=-5*tug;pose.sy-=.07*tug;}
 if(fx.pluck>0){const p=Math.sin(fx.pluck/.35*Math.PI);pose.angle-=p*.08;pose.y-=p*4;}
 if(!moving&&s.ground&&!s.action)pose.sy+=Math.sin((fx.clock??s.time)*2.8)*.012;
 return pose;
}
