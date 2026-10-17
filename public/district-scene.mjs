import {FLOOR} from './engine.mjs';
import {BLOCK} from './mischief.mjs';
import manifest from './asset-manifest.mjs';
import {districtSprite,districtAssets} from './district-art.mjs';
function line(ctx,points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function timber(ctx,images,x,y,w,h){ctx.drawImage(images.timber,...manifest.timber.frame,x,y,w,h);}
function pin(ctx,x,y){ctx.fillStyle='#382d32';ctx.beginPath();ctx.arc(x+1,y+1,3.7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e1b371';ctx.beginPath();ctx.arc(x,y,2.7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff0b8';ctx.fillRect(x-1.4,y-1.5,1.8,1);}
function lamp(ctx,x,y,on,r=4){if(on){const glow=ctx.createRadialGradient(x,y,1,x,y,r*4);glow.addColorStop(0,'#ffdb8b88');glow.addColorStop(1,'#ffcc7600');ctx.fillStyle=glow;ctx.fillRect(x-r*4,y-r*4,r*8,r*8);}ctx.fillStyle='#302d35';ctx.beginPath();ctx.arc(x,y,r+2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c59156';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=on?'#ffe7a2':'#65575d';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function pulley(ctx,x,y,r,angle){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle='#433238';ctx.strokeStyle='#d7a561';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);line(ctx,[[0,0],[r-2,0]],'#ae7f51',2);}pin(ctx,0,0);ctx.restore();}
export function drawDistrictCanopies(ctx,s,images){
 for(const p of s.room.platforms.filter(p=>!p.kind)){
  // Everything decorative hangs below the real collision top.
  ctx.fillStyle='#32253655';ctx.fillRect(p.x+7,p.y+17,p.w-4,8);
  for(const side of [-1,1]){const x=side<0?p.x+14:p.x+p.w-14;line(ctx,[[x,p.y+9],[x,p.y+62]],'#49313a',10);line(ctx,[[x-2,p.y+10],[x-2,p.y+62]],'#a06d4a',5);line(ctx,[[x,p.y+52],[x-side*34,p.y+15]],'#49313a',9);line(ctx,[[x-1,p.y+49],[x-side*32,p.y+16]],'#b27e4c',4);pin(ctx,x,p.y+11);}
  timber(ctx,images,p.x,p.y+2,p.w,19);
  const edge=ctx.createLinearGradient(0,p.y,0,p.y+5);edge.addColorStop(0,'#ffe0a0');edge.addColorStop(1,'#a16948');ctx.fillStyle=edge;ctx.fillRect(p.x,p.y,p.w,4);
  ctx.fillStyle='#624636';for(let x=p.x+24;x<p.x+p.w-5;x+=32)ctx.fillRect(x,p.y+1,1,4);
  for(const x of [p.x+8,p.x+p.w-8]){ctx.fillStyle='#735748';ctx.fillRect(x-4,p.y+4,8,17);pin(ctx,x,p.y+9);}
 }
}
export function drawDistrictHome(ctx,s,images,{reducedMotion=false}={}){
 if(!images.districtHome)return false;
 const frame=districtAssets.districtHome.frame,w=308,h=w*frame[3]/frame[2];
 ctx.fillStyle='#2d1d3540';ctx.beginPath();ctx.ellipse(110,FLOOR+2,146,9,0,0,Math.PI*2);ctx.fill();
 districtSprite(ctx,images,'home',110-w/2,FLOOR-h,w,h);
 const available=s.loot.length>0&&(!s.loopTrial||s.loot.includes('sun')),banking=s.action==='home'?s.actionTime/.45:s.status==='won'?1:0;
 if(banking>0){
  const scale=w/frame[2],dx=110-w/2+(322-frame[0])*scale,dy=FLOOR-h+(244-frame[1])*scale,dw=160*scale,dh=256*scale,open=Math.min(1,banking);
  ctx.save();ctx.beginPath();ctx.moveTo(dx,dy+dh);ctx.lineTo(dx,dy+dw/2);ctx.bezierCurveTo(dx,dy-dw*.15,dx+dw,dy-dw*.15,dx+dw,dy+dw/2);ctx.lineTo(dx+dw,dy+dh);ctx.closePath();ctx.clip();
  const inside=ctx.createLinearGradient(dx,dy,dx+dw,dy);inside.addColorStop(0,'#543134');inside.addColorStop(.45,'#ffe6a5');inside.addColorStop(1,'#b46d3d');ctx.fillStyle=inside;ctx.fillRect(dx,dy,dw,dh);
  ctx.drawImage(images.districtHome,322,244,160,256,dx,dy,dw*(1-open*.87),dh);ctx.restore();
 }
 if(available||banking){const glow=ctx.createRadialGradient(110,FLOOR-25,3,110,FLOOR-25,72);glow.addColorStop(0,`rgba(255,213,126,${banking ? .30 : .13})`);glow.addColorStop(1,'#ffcf7a00');ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle=glow;ctx.fillRect(38,FLOOR-97,144,120);ctx.restore();}
 // A small sign marks home; the contextual control supplies the action text.
 ctx.save();ctx.translate(110,FLOOR-h+18);ctx.fillStyle='#3b2b40';ctx.strokeStyle='#ca9c66';ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(-23,-7,46,20,4);ctx.fill();ctx.stroke();ctx.fillStyle='#f6dfaf';ctx.font='700 8px system-ui';ctx.textAlign='center';ctx.fillText('HOME',0,6);ctx.restore();return true;
}
export function drawDistrictPower(ctx,s,images,{reducedMotion=false}={}){
 const {gate:g,lift:l}=BLOCK;
 // A physical conduit joins the battery socket, gate relay and lift motor.
 const wire=[[465,FLOOR-18],[481,FLOOR-18],[481,351],[590,351],[590,355],[960,355],[960,244],[1088,244]];
 line(ctx,wire,'#3a2c38',7);line(ctx,wire,'#99734f',4);line(ctx,wire,'#ddb17a',1);
 for(const x of [493,687,935]){ctx.fillStyle='#5b4a48';ctx.fillRect(x,348,7,12);pin(ctx,x+3,352);}
 const socket=ctx.createLinearGradient(422,416,466,460);socket.addColorStop(0,'#a77a51');socket.addColorStop(.4,'#57434a');socket.addColorStop(1,'#312736');ctx.fillStyle=socket;ctx.strokeStyle='#c89965';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(422,416,44,44,6);ctx.fill();ctx.stroke();ctx.fillStyle='#243840';ctx.beginPath();ctx.roundRect(428,421,32,33,4);ctx.fill();for(const x of [432,453]){ctx.fillStyle='#ddb474';ctx.fillRect(x,424,3,10);}lamp(ctx,470,440,s.powered,3);
 // The gate is hung from the canopy with a real rolled-up shutter when open.
 for(const x of [g.x-10,g.x+g.w]){ctx.fillStyle='#56424c';ctx.fillRect(x,g.y,10,g.h);ctx.fillStyle='#b17c58';ctx.fillRect(x,g.y,3,g.h);pin(ctx,x+5,g.y+12);}
 if(s.powered)ctx.drawImage(images.shutter,...manifest.shutter.frame,g.x,g.y,g.w,g.h);
 else{for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#a77755':'#664b49';ctx.fillRect(g.x,g.y+i*3,g.w,3);}line(ctx,[[g.x+4,g.y+15],[g.x+g.w-4,g.y+15]],'#e4b982',2);}
 lamp(ctx,g.x+g.w+5,g.y-9,s.powered,3);
 // Iron tracks, winding wheels, a painted motor, and a warmly lit power lamp.
 for(const x of [l.x+10,l.x+l.w-10]){line(ctx,[[x,243],[x,FLOOR]],'#3a303b',8);line(ctx,[[x-1,243],[x-1,FLOOR]],'#b4936a',3);for(const y of [274,359,445])pin(ctx,x,y);}
 timber(ctx,images,l.x-7,230,l.w+14,17);
 const board=ctx.createLinearGradient(0,177,0,233);board.addColorStop(0,'#8e684c');board.addColorStop(1,'#44333d');ctx.fillStyle=board;ctx.beginPath();ctx.roundRect(1065,177,72,53,5);ctx.fill();
 districtSprite(ctx,images,'motor',1063,173,76,60);
 const phase=s.powered&&!reducedMotion?s.time*1.4:0;for(const x of [l.x+10,l.x+l.w-10])pulley(ctx,x,239,10,phase);
 const platformY=s.powered?s.liftY:FLOOR;
 for(const x of [l.x+12,l.x+l.w-12]){line(ctx,[[x,249],[x,platformY]],'#4e3d40',2.8);line(ctx,[[x-1,249],[x-1,platformY]],'#c4a47c',.9);}
 timber(ctx,images,l.x-3,platformY,l.w+6,21);line(ctx,[[l.x,platformY],[l.x+l.w,platformY]],'#f7d394',3);for(const x of [l.x+8,l.x+l.w-8])pin(ctx,x,platformY+9);
 lamp(ctx,1146,208,s.powered,5);
 if(Math.abs(s.x-1090)<175&&!s.powered&&!s.loopTrial){ctx.save();ctx.font='600 10px system-ui';ctx.textAlign='center';ctx.fillStyle='#322738';ctx.beginPath();ctx.roundRect(1041,151,120,19,5);ctx.fill();ctx.fillStyle='#f4d5a5';ctx.fillText('Return battery to power',1101,164);ctx.restore();}
}
export function drawDistrictPlanter(ctx,s,images){const b=BLOCK.cover;ctx.fillStyle='#2d223c44';ctx.beginPath();ctx.ellipse(b.x+b.w/2,FLOOR+1,45,5,0,0,Math.PI*2);ctx.fill();return districtSprite(ctx,images,'planter',b.x-4,b.y-3,b.w+8,b.h+3);}
