import {FLOOR,spikeBounds} from './engine.mjs';
import manifest from './asset-manifest.mjs';
// Hazard art stays on the old footprint. The raised warning sign is presentation only.
export function drawHazards(ctx,run,images){
 for(const slot of run.room.spikes){
  const hit=spikeBounds(slot),cx=hit.x+hit.w/2;
  ctx.save();
  // Dark mounting plate separates the hazard from similarly coloured roof tiles.
  ctx.fillStyle='#352136';ctx.fillRect(hit.x-9,FLOOR-3,hit.w+18,7);
  ctx.fillStyle='#eac9a0';for(let x=hit.x-5;x<hit.x+hit.w+5;x+=10){ctx.beginPath();ctx.moveTo(x,FLOOR+1);ctx.lineTo(x+4,FLOOR+1);ctx.lineTo(x+1,FLOOR+4);ctx.lineTo(x-3,FLOOR+4);ctx.closePath();ctx.fill();}
  const art=images.hazard||images.props,frame=manifest.hazard?.frame||manifest.props.frames.trap;
  ctx.shadowColor='#27172c';ctx.shadowBlur=2;ctx.shadowOffsetY=0;
  ctx.drawImage(art,...frame,hit.x-8,hit.y-2,46,25);ctx.shadowBlur=0;
  // A coral warning triangle is distinct from the gold diamond collectibles.
  const cy=hit.y-23;
  ctx.beginPath();ctx.moveTo(cx,cy-12);ctx.lineTo(cx+14,cy+12);ctx.lineTo(cx-14,cy+12);ctx.closePath();ctx.fillStyle='#ffc9b2';ctx.fill();ctx.strokeStyle='#392139';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#5d2b41';ctx.fillRect(cx-1.5,cy-4,3,8);ctx.beginPath();ctx.arc(cx,cy+8,1.8,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
}
