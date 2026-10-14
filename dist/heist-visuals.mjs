import {FLOOR} from './engine.mjs';
import {HEIST} from './heist.mjs';
function sun(ctx,x,y,size=1){
 ctx.save();ctx.translate(x,y);ctx.scale(size,size);
 const glow=ctx.createRadialGradient(0,0,2,0,0,27);glow.addColorStop(0,'rgba(255,238,157,.65)');glow.addColorStop(1,'rgba(255,198,81,0)');ctx.fillStyle=glow;ctx.fillRect(-27,-27,54,54);
 ctx.strokeStyle='#88502e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-13,5,Math.PI,0);ctx.stroke();ctx.fillStyle='#b47736';ctx.fillRect(-10,-11,20,3);ctx.fillRect(-10,9,20,4);
 ctx.fillStyle='#fff2ac';ctx.beginPath();ctx.ellipse(0,0,8,10,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ecb252';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff9dc';ctx.beginPath();ctx.arc(-2,-3,3,0,Math.PI*2);ctx.fill();ctx.restore();
}
export function drawHeistProps(ctx,run,images){
 const {bridge:b,gate:g}=HEIST,escape=run.phase==='escape';
 // Planks coincide exactly with the bridge platform used by collision.
 if(!escape){for(let x=b.x;x<b.x+b.w;x+=20){ctx.fillStyle=(Math.floor((x-b.x)/20)%2)?'#986342':'#b57b4f';ctx.fillRect(x,FLOOR,19,9);ctx.fillStyle='#edbf77';ctx.fillRect(x,FLOOR,19,2);}ctx.fillStyle='#553941';ctx.fillRect(b.x,FLOOR+9,b.w,4);}
 for(const x of [b.x-22,b.x+b.w+22]){ctx.fillStyle='#815041';ctx.fillRect(x-5,FLOOR-22,10,36);ctx.fillStyle='#d5a464';ctx.beginPath();ctx.arc(x,FLOOR-14,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6b4440';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,FLOOR-14,6,0,Math.PI*2);ctx.stroke();}
 if(escape){ctx.fillStyle='#f4d29c';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText('BRIDGE RETRACTED',b.x+b.w/2,FLOOR+48);ctx.fillText('BRIDGE RETRACTED',b.x+b.w/2,FLOOR+48);}
 // The upper route stays visible in both phases. Thin planks leave readable headroom.
 for(const p of run.room.platforms.filter(p=>p.kind==='step')){
  ctx.fillStyle='#6b4146';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle='#f0bb70';ctx.fillRect(p.x,p.y,p.w,2);
  ctx.fillStyle='#b67c50';for(let x=p.x+10;x<p.x+p.w;x+=26)ctx.fillRect(x,p.y+3,2,2);
  ctx.strokeStyle='#a97855';ctx.lineWidth=3;for(const x of [p.x+15,p.x+p.w-15]){ctx.beginPath();ctx.moveTo(x,p.y+6);ctx.lineTo(x+8,p.y+17);ctx.stroke();}
 }
 // Raised shutter housing is foreshadowed on entry; only the closed state is solid.
 ctx.fillStyle='#6c4a4f';ctx.fillRect(g.x-6,g.y-14,g.w+12,14);ctx.fillStyle='#c5a06b';ctx.fillRect(g.x-8,g.y-15,g.w+16,3);
 if(escape){const metal=ctx.createLinearGradient(g.x,0,g.x+g.w,0);metal.addColorStop(0,'#72535a');metal.addColorStop(.45,'#a18a78');metal.addColorStop(1,'#66454c');ctx.fillStyle=metal;ctx.fillRect(g.x,g.y,g.w,g.h);
  for(let y=g.y+12;y<g.y+g.h;y+=14){ctx.strokeStyle='#513b49';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g.x,y);ctx.lineTo(g.x+g.w,y);ctx.stroke();ctx.strokeStyle='#c0a785';ctx.beginPath();ctx.moveTo(g.x+2,y+2);ctx.lineTo(g.x+g.w-2,y+2);ctx.stroke();}
  ctx.fillStyle='#ead0a0';ctx.fillRect(g.x+18,g.y+59,24,28);ctx.fillStyle='#6a4e54';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText('07',g.x+30,g.y+78);
 }else{ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle='#a38369';ctx.lineWidth=3;for(const x of [g.x-3,g.x+g.w+3]){ctx.beginPath();ctx.moveTo(x,g.y);ctx.lineTo(x,FLOOR);ctx.stroke();}ctx.restore();}
 ctx.fillStyle='#f2d19b';ctx.textAlign='center';ctx.font='bold 9px system-ui';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText('MAINTENANCE ROOFS',g.x+g.w/2,g.y-25);ctx.fillText('MAINTENANCE ROOFS',g.x+g.w/2,g.y-25);
 // Darken the actual illustrated home's circular window; restoration reveals its gold glass.
 const windowX=96,windowY=FLOOR-71;
 if(run.status!=='won'){ctx.fillStyle='#332d43';ctx.beginPath();ctx.ellipse(windowX,windowY,24,29,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a6346';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(windowX-23,windowY);ctx.lineTo(windowX+23,windowY);ctx.moveTo(windowX,windowY-28);ctx.lineTo(windowX,windowY+28);ctx.stroke();}
 else{const glow=ctx.createRadialGradient(windowX,windowY,12,windowX,windowY,64);glow.addColorStop(0,'rgba(255,223,140,.32)');glow.addColorStop(1,'rgba(255,210,118,0)');ctx.fillStyle=glow;ctx.fillRect(windowX-64,windowY-64,128,128);sun(ctx,138,FLOOR-48,.65);}
 ctx.fillStyle='#ffe1ac';ctx.font='bold 9px system-ui';ctx.fillText('HOME',HEIST.home,FLOOR+25);
 // Sun pedestal is decoration, never an invisible platform or barrier.
 ctx.fillStyle='#6c4650';ctx.fillRect(HEIST.vault-22,FLOOR-15,44,15);ctx.fillStyle='#bf9d73';ctx.fillRect(HEIST.vault-25,FLOOR-18,50,5);
 if(!run.hasSun)sun(ctx,HEIST.vault,FLOOR-50,1.35);
 ctx.fillStyle='#f9dfaf';ctx.font='bold 10px system-ui';const label=run.hasSun?'BRING IT HOME ←':'THE POCKET SUN';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText(label,HEIST.vault,FLOOR-97);ctx.fillText(label,HEIST.vault,FLOOR-97);
 ctx.textAlign='start';
}
export function drawCarriedSun(ctx,run){if(run.hasSun&&run.status!=='won')sun(ctx,run.x+14+run.facing*27,run.y-12,.7);}
