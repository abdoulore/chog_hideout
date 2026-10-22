import {drawPixelVault} from './vault.mjs';
import {pixelLayout} from './camera.mjs';
import {actorFrames,PIXEL_KEYS,encounterCues,pixelMotion} from './model.mjs';
import {BLOCK} from '../mischief.mjs';
import {drawTorchBeam} from '../torchlight.mjs';
const buffers=new WeakMap();
export async function loadPixelArt(){return Object.fromEntries(await Promise.all(PIXEL_KEYS.map(key=>new Promise((resolve,reject)=>{const im=new Image(),timer=setTimeout(()=>reject(Error('Pixel artwork timed out: '+key)),15000);im.onload=()=>{clearTimeout(timer);resolve([key,im]);};im.onerror=()=>{clearTimeout(timer);reject(Error('Pixel artwork unavailable: '+key));};im.src=new URL('../pixel/'+key+'.png',import.meta.url).href;}))));}
export function drawPixelWorld(ctx,s,im,width,height,{feedback={},reducedMotion=false}={}){
 let b=buffers.get(ctx);if(!b){b=ctx.canvas.ownerDocument.createElement('canvas');buffers.set(ctx,b);}
 const l=pixelLayout(s,width,height),z=l.camera.zoom,cx=l.camera.x,gy=l.groundY/z,oy=gy-460;
 if(b.width!==l.nativeW)b.width=l.nativeW;if(b.height!==l.nativeH)b.height=l.nativeH;
 const c=b.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,b.width,b.height);
 c.fillStyle='#777a9b';c.fillRect(0,0,b.width,b.height);
 // Keep the town in the distance. No blur or grading of the play layer.
 const cityX=-Math.round(cx*.12),cityY=Math.round(gy-im.city.height*.75);
 for(let x=cityX-im.city.width;x<b.width;x+=im.city.width)c.drawImage(im.city,x,cityY);
 c.fillStyle='#55516b99';c.fillRect(0,0,b.width,b.height);
 const haze=c.createLinearGradient(0,gy-150,0,gy);haze.addColorStop(0,'#35253d00');haze.addColorStop(1,'#35253d77');c.fillStyle=haze;c.fillRect(0,0,b.width,b.height);
 c.save();c.translate(-cx,oy);
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const spr=(key,x,y)=>c.drawImage(im[key],Math.round(x),Math.round(y));
 const label=(text,x,y,color='#ffe3a4')=>{c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#261b33';c.fillRect(Math.round(x-text.length*2.5-4),Math.round(y-9),text.length*5+8,12);c.fillStyle=color;c.fillText(text,Math.round(x),Math.round(y));};
 const tile=(key,x,y,w)=>{c.save();c.beginPath();c.rect(x,y,w,im[key].height);c.clip();for(let tx=x;tx<x+w;tx+=im[key].width)spr(key,tx,y);c.restore();};
 rect(cx,460,b.width,b.height,'#392839');tile('ground',cx-cx%im.ground.width,460,b.width+im.ground.width);
 for(const p of s.room.platforms.filter(p=>!p.kind)){for(const x of [p.x+12,p.x+p.w-12]){rect(x,p.y+12,4,55,'#332538');rect(x+1,p.y+12,1,55,'#a5734b');}tile('plankM',p.x,p.y,p.w);spr('plankL',p.x,p.y);spr('plankR',p.x+p.w-im.plankR.width,p.y);}
 const homeX=s.lanternMission?5200:s.annexMission?3920:110;spr('home',homeX-65,460-im.home.height);label(s.lanternMission?(s.powerRestored?'EXIT OPEN':'EXIT · NEEDS POWER'):s.annexMission?'EXTRACT HERE':'HOME',homeX,460-im.home.height-9);if(s.annexMission){rect(3840,-2000,40,2460,'#453247');for(let y=200;y<460;y+=24)rect(3844,y,32,2,'#82615e');}
 for(const x of [260,750,1230,1600])spr('lamp',x,460-im.lamp.height);
 // The source socket stays readable after the cell is removed.
 if(!s.vaultMission){spr('socket',444-im.socket.width/2,460-im.socket.height);if(Math.abs(s.x-444)<210)label(encounterCues(s).socket,444,419,s.powered?'#c8ebc1':'#ffe3a4');
 // Visible wiring explains why taking this cell changes both machines.
 c.strokeStyle='#46313c';c.lineWidth=4;c.beginPath();c.moveTo(450,449);c.lineTo(480,449);c.lineTo(480,350);c.lineTo(590,350);c.lineTo(590,352);c.lineTo(1090,352);c.lineTo(1090,246);c.stroke();c.strokeStyle=s.powered?'#cba76b':'#77636a';c.lineWidth=1;c.stroke();
 }else{c.strokeStyle=s.powered?'#cba76b':'#77636a';c.lineWidth=2;c.beginPath();c.moveTo(1500,310);c.lineTo(1500,350);c.lineTo(1180,350);c.lineTo(1180,246);c.lineTo(1090,246);c.stroke();}
 const cues=encounterCues(s);
 const g=BLOCK.gate;
 rect(g.x-3,g.y-3,g.w+6,3,'#d49b3a');rect(g.x-3,g.y,3,g.h,'#60434b');rect(g.x+g.w,g.y,3,g.h,'#60434b');
 if(s.powered){c.save();c.beginPath();c.rect(g.x,g.y,g.w,g.h);c.clip();for(let x=g.x;x<g.x+g.w;x+=im.shutter.width)spr('shutter',x,g.y);c.restore();}else rect(g.x,g.y,g.w,8,'#b88051');
 if(Math.abs(s.x-g.x)<210)label(cues.gate,g.x+g.w/2,g.y-15,s.powered?'#e9ba91':'#b9e3c0');
 const liftY=s.powered?s.liftY:460;
 for(const x of [BLOCK.lift.x+8,BLOCK.lift.x+BLOCK.lift.w-8]){rect(x,246,2,liftY-246,'#bd9c6a');for(let y=250;y<liftY;y+=5)rect(x,y,3,1,'#3a2838');}
 spr('lift',BLOCK.lift.x,liftY);label(cues.lift,1090,240,s.powered?'#c8ebc1':'#e5bd91');if(!s.powered&&Math.abs(s.x-1090)<180)label(s.vaultMission?'CELL SOCKET ON ROOF →':'RETURN CELL AT STREET SOCKET',1090,225);
 if(s.vaultMission)drawPixelVault(c,s,im,{rect,spr,label,reducedMotion});
 if(s.pot!=='broken'){const t=s.pot==='falling'?1-s.potTime/.42:0;spr('pot',815+t*155-im.pot.width/2,310+t*140-im.pot.height);}else for(let i=0;i<5;i++)rect(950+i*8,455-i%2*3,5,3,'#cf8055');
 for(const item of Object.values(s.items))if(item.state==='world'){const bob=reducedMotion?0:Math.round(Math.sin(s.time*3)*1);spr(item.id,item.x-im[item.id].width/2,item.y-im[item.id].height+bob);rect(item.x-1,item.y-im[item.id].height-6+bob,2,2,'#ffe7a6');}
 for(const n of s.noise){const age=s.time-n.time;if(age>1.2)continue;c.globalAlpha=(1-age/1.2)*.65;c.strokeStyle=n.kind==='bell'?'#ff9a84':'#ffe2ac';c.lineWidth=1;c.beginPath();c.ellipse(Math.round(n.x),Math.round(n.y-10),Math.round(12+age*60),Math.round(7+age*25),0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;
 const frames=actorFrames(s,feedback,reducedMotion),guard=s.caretaker;
 const actor=(key,frame,fw,fh,x,y,facing)=>{c.save();c.translate(Math.round(x),Math.round(y));c.scale(facing,1);c.drawImage(im[key],frame*fw,0,fw,fh,-fw/2,-fh,fw,fh);c.restore();};
 const light={x:Math.round(guard.x+14+guard.facing*12),y:438};
 drawTorchBeam(c,s,{reducedMotion:true,origin:light});
 actor('care',frames.care,48,48,guard.x+14,460,guard.facing);
 for(const [r,alpha] of [[10,.1],[6,.15],[2,.8]]){c.globalAlpha=alpha;rect(light.x-r,light.y-r,r*2,r*2,'#fff1ac');}c.globalAlpha=1;
 // Cover is drawn over the guard and covers the simulation's entire 80-unit height.
 spr('planter',BLOCK.cover.x-15,460-im.planter.height);
 if(cues.guard){label(cues.guard,guard.x+14,393,guard.mode==='chase'?'#ffb59e':'#ffe3a4');rect(guard.x-4,400,36,5,'#281b31');rect(guard.x-3,401,34*(guard.mode==='chase'?1:guard.suspicion),3,guard.mode==='chase'?'#ff766e':'#ffd166');}
 if(cues.cover)label(cues.cover,s.x+14,s.y-19,'#b9e3c0');
 if(s.dashTime>0&&!reducedMotion){c.globalAlpha=.22;actor('chog',6,48,42,s.x+14-s.facing*18,s.y+35,s.facing);c.globalAlpha=.4;actor('chog',6,48,42,s.x+14-s.facing*9,s.y+35,s.facing);c.globalAlpha=1;}
 const motion=pixelMotion(s,feedback,reducedMotion);
 // A contact shadow anchors the small silhouette without changing its scale or hitbox.
 if(s.ground)rect(s.x+3,s.y+33,22,2,'#21172b99');
 actor('chog',frames.chog,48,42,s.x+14+motion.x,s.y+35+motion.y,s.facing);
 s.loot.forEach((id,i)=>{const targetX=s.x+14-im[id].width/2+(i-(s.loot.length-1)/2)*17,targetY=s.y-4-im[id].height;const theft=s.theftFX?.id===id&&!reducedMotion?s.theftFX:null,t=theft?Math.min(1,1-theft.time/.32):1,ease=1-(1-t)**3;spr(id,theft?(theft.x-im[id].width/2)+(targetX-(theft.x-im[id].width/2))*ease:targetX,theft?(theft.y-im[id].height)+(targetY-(theft.y-im[id].height))*ease-Math.sin(t*Math.PI)*15:targetY+motion.y);});
 if(!reducedMotion)for(const p of feedback.particles||[]){c.globalAlpha=Math.max(0,1-p.age/p.life);rect(p.x,p.y,Math.max(1,p.size/2),Math.max(1,p.size/2),p.color);}c.globalAlpha=1;
 if(s.status==='won'){label(s.lanternMission?'LIGHT DELIVERED':s.annexMission?'ANNEX COMPLETE':'SAFE AT HOME',homeX,395);rect(homeX-11,429,22,31,'#ffe3a466');}
 c.restore();if(s.status==='dead'){c.fillStyle='#982d4b33';c.fillRect(0,0,b.width,b.height);}
 ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,width,height);ctx.drawImage(b,0,0,b.width*z,b.height*z);
}
