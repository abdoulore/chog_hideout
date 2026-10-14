import {FLOOR} from './engine.mjs';
import {HEIST} from './heist.mjs';
import manifest from './asset-manifest.mjs';
function sun(ctx,images,x,y,size=1){
 ctx.save();const glow=ctx.createRadialGradient(x,y,2,x,y,23*size);glow.addColorStop(0,'rgba(255,238,157,.34)');glow.addColorStop(1,'rgba(255,198,81,0)');ctx.fillStyle=glow;ctx.fillRect(x-23*size,y-23*size,46*size,46*size);
 ctx.drawImage(images.sun,...manifest.sun.frame,x-10*size,y-14.5*size,20*size,29*size);ctx.restore();
}
function timberBeam(ctx,images,x1,y1,x2,y2,thickness,opacity=1){
 ctx.save();ctx.globalAlpha=opacity;ctx.translate(x1,y1);ctx.rotate(Math.atan2(y2-y1,x2-x1));ctx.drawImage(images.timber,...manifest.timber.frame,0,-thickness/2,Math.hypot(x2-x1,y2-y1),thickness);ctx.restore();
}
export function drawHeistProps(ctx,run,images){
 const {bridge:b,gate:g}=HEIST,escape=run.phase==='escape';
 // Planks coincide exactly with the bridge platform used by collision.
 if(!escape)ctx.drawImage(images.timber,...manifest.timber.frame,b.x,FLOOR,b.w,18);
 for(const x of [b.x-22,b.x+b.w+22]){ctx.fillStyle='#745042';ctx.fillRect(x-5,FLOOR-22,10,36);const metal=ctx.createRadialGradient(x-3,FLOOR-18,1,x,FLOOR-14,11);metal.addColorStop(0,'#ffe1a0');metal.addColorStop(.5,'#ca9655');metal.addColorStop(1,'#79533e');ctx.fillStyle=metal;ctx.beginPath();ctx.arc(x,FLOOR-14,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#5a3940';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(x,FLOOR-14,5,0,Math.PI*2);ctx.stroke();}
 if(escape){ctx.fillStyle='#f4d29c';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText('BRIDGE RETRACTED',b.x+b.w/2,FLOOR+48);ctx.fillText('BRIDGE RETRACTED',b.x+b.w/2,FLOOR+48);}
 // Rear posts and diagonal corbels support the one-way decks without hiding the top edge.
 for(const p of run.room.platforms.filter(p=>p.kind==='step')){
  for(const x of [p.x+34,p.x+p.w-34])timberBeam(ctx,images,x,p.y+12,x,FLOOR+3,9,.52);
  timberBeam(ctx,images,p.x+7,p.y+12,p.x+34,p.y+48,10,.85);
  timberBeam(ctx,images,p.x+p.w-7,p.y+12,p.x+p.w-34,p.y+48,10,.85);
  ctx.drawImage(images.timber,...manifest.timber.frame,p.x,p.y,p.w,16);
 }
 // Raised shutter housing is foreshadowed on entry; only the closed state is solid.
 const sf=manifest.shutter.frame;ctx.drawImage(images.shutter,sf[0],sf[1],sf[2],Math.round(sf[3]*.08),g.x-6,g.y+3,g.w+12,12);
 if(escape)ctx.drawImage(images.shutter,...sf,g.x,g.y,g.w,g.h);
 else{ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle='#a38369';ctx.lineWidth=3;for(const x of [g.x-3,g.x+g.w+3]){ctx.beginPath();ctx.moveTo(x,g.y+15);ctx.lineTo(x,FLOOR);ctx.stroke();}ctx.restore();}
 ctx.fillStyle='#f2d19b';ctx.textAlign='center';ctx.font='bold 9px system-ui';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText('MAINTENANCE ROOFS',g.x+g.w/2,g.y-25);ctx.fillText('MAINTENANCE ROOFS',g.x+g.w/2,g.y-25);
 // Darken the actual illustrated home's circular window; restoration reveals its gold glass.
 const windowX=96,windowY=FLOOR-71;
 if(run.status!=='won'){const glass=ctx.createLinearGradient(windowX-20,windowY-20,windowX+20,windowY+20);glass.addColorStop(0,'#15253a');glass.addColorStop(.5,'#28344c');glass.addColorStop(1,'#4a4157');ctx.fillStyle=glass;ctx.beginPath();ctx.ellipse(windowX,windowY,24,29,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a6346';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(windowX-23,windowY);ctx.lineTo(windowX+23,windowY);ctx.moveTo(windowX,windowY-28);ctx.lineTo(windowX,windowY+28);ctx.stroke();}
 else{const glow=ctx.createRadialGradient(windowX,windowY,12,windowX,windowY,64);glow.addColorStop(0,'rgba(255,223,140,.32)');glow.addColorStop(1,'rgba(255,210,118,0)');ctx.fillStyle=glow;ctx.fillRect(windowX-64,windowY-64,128,128);sun(ctx,images,138,FLOOR-48,.9);}
 ctx.fillStyle='#ffe1ac';ctx.font='bold 9px system-ui';ctx.fillText('HOME',HEIST.home,FLOOR+25);
 // Sun pedestal is decoration, never an invisible platform or barrier.
 ctx.fillStyle='#6c4650';ctx.fillRect(HEIST.vault-22,FLOOR-15,44,15);ctx.fillStyle='#bf9d73';ctx.fillRect(HEIST.vault-25,FLOOR-18,50,5);
 if(!run.hasSun)sun(ctx,images,HEIST.vault,FLOOR-39,1.6);
 ctx.fillStyle='#f9dfaf';ctx.font='bold 10px system-ui';const label=run.hasSun?'BRING IT HOME ←':'THE POCKET SUN';ctx.strokeStyle='#4c3545';ctx.lineWidth=3;ctx.strokeText(label,HEIST.vault,FLOOR-97);ctx.fillText(label,HEIST.vault,FLOOR-97);
 ctx.textAlign='start';
}
export function drawCarriedSun(ctx,run,images){if(run.hasSun&&run.status!=='won')sun(ctx,images,run.x+14+run.facing*27,run.y+8,.8);}
