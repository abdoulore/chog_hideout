import {FLOOR,groundSegments} from './engine.mjs';
import manifest from './asset-manifest.mjs';
export {manifest};

export async function loadArt(){
 const entries=await Promise.all(Object.entries(manifest).map(([key,m])=>new Promise((resolve,reject)=>{
  const image=new Image();const timer=setTimeout(()=>reject(Error(`Artwork timed out: ${key}`)),15000);
  image.onload=()=>{clearTimeout(timer);resolve([key,image]);};image.onerror=()=>{clearTimeout(timer);reject(Error(`Artwork unavailable: ${key}`));};image.src=new URL(m.url,import.meta.url).href;
 })));
 return Object.fromEntries(entries);
}
export function artCamera(run,displayWidth,width=900){const zoom=displayWidth<600?1.7:1.2,view=width/zoom;return {zoom,x:Math.max(0,Math.min(run.room.width-view,run.x-view*.28))};}
function sprite(ctx,img,frame,x,y,w,h){ctx.drawImage(img,...frame,x,y,w,h);}
export function drawWorld(ctx,run,images,width=900,height=520,{displayWidth=900,reducedMotion=false}={}){
 const m=manifest,cam=artCamera(run,displayWidth,width),groundY=height*.73;
 ctx.clearRect(0,0,width,height);
 // The distant city moves more slowly than the physical gameplay plane.
 const bgW=Math.max(width*1.45,height*images.city.width/images.city.height),bgH=bgW*images.city.height/images.city.width;
 const offset=cam.x*.16;for(let tile=-1;tile<4;tile++){
  const x=tile*bgW-offset;
  ctx.save();if(tile%2){ctx.translate(x+bgW,(height-bgH)*.2);ctx.scale(-1,1);ctx.drawImage(images.city,0,0,bgW,bgH);}else ctx.drawImage(images.city,x,(height-bgH)*.2,bgW,bgH);ctx.restore();
 }
 ctx.fillStyle='rgba(255,230,194,.07)';ctx.fillRect(0,0,width,height);
 ctx.save();ctx.translate(0,groundY-FLOOR*cam.zoom);ctx.scale(cam.zoom,cam.zoom);ctx.translate(-cam.x,0);
 const house=m.props.frames.house;
 for(const [x,w] of [[-170,325],[555,290],[1995,290]]){
  const h=w*house[3]/house[2];sprite(ctx,images.props,house,x,FLOOR-h,w,h);
 }
 // Platforms use the same top plane as the simulation. Image overhang is clipped.
 function roof(x,y,w,hanging=false){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,hanging?22:900);ctx.clip();
  if(!hanging){const wall=ctx.createLinearGradient(0,y+35,0,y+420);wall.addColorStop(0,'#865347');wall.addColorStop(.5,'#5b3b43');wall.addColorStop(1,'#322c3d');ctx.fillStyle=wall;ctx.fillRect(x,y+26,w,900);}
  const tileW=hanging?260:520,tileH=hanging?30:77;
  for(let tx=x;tx<x+w;tx+=tileW)sprite(ctx,images.roof,m.roof.frame,tx,y,tileW,tileH);
  ctx.restore();
  if(!hanging){ctx.strokeStyle='rgba(240,181,105,.20)';ctx.lineWidth=7;for(let tx=x+45;tx<x+w;tx+=170){ctx.beginPath();ctx.moveTo(tx,y+69);ctx.lineTo(tx-9,y+160);ctx.stroke();}}
 }
 for(const p of groundSegments(run.room))roof(p.x,p.y,p.w);
 for(const p of run.room.platforms)roof(p.x,p.y,p.w,true);
 // Safe landing is indicated with a few warm edge glints rather than a neon strip.
 for(const gap of run.room.gaps||[]){ctx.fillStyle='rgba(255,221,151,.8)';for(let i=0;i<4;i++)ctx.fillRect(gap.x+gap.w+8+i*20,FLOOR,9,2);}
 const gem=m.props.frames.gem;
 run.room.orbs.forEach((o,i)=>{if(run.collected.includes(i))return;const drift=reducedMotion?0:Math.sin(run.time*3+i)*1.5;sprite(ctx,images.props,gem,o.x-12,o.y-14+drift,24,28);});
 const trap=m.props.frames.trap;for(const slot of run.room.spikes)sprite(ctx,images.props,trap,slot*50+2,FLOOR-25,46,25);
 const door=m.props.frames.door,doorWidth=118,doorHeight=doorWidth*door[3]/door[2];
 sprite(ctx,images.props,door,run.room.width-137,FLOOR-doorHeight,doorWidth,doorHeight);
 // Frames share an illustration scale; each pose is anchored by its visible feet.
 let frame=0;if(run.dashTime>0)frame=6;else if(!run.ground)frame=run.vy<0?4:5;else if(Math.abs(run.vx)>0)frame=[1,2,3,2][Math.floor(run.time*12)%4];
 const f=m.chog.frames[frame],scale=74/m.chog.frames[0][3],fw=f[2]*scale,fh=f[3]*scale;
 ctx.save();ctx.translate(run.x+14,run.y+34);ctx.scale(run.facing,1);
 if(run.dashTime>0&&!reducedMotion){ctx.globalAlpha=.17;sprite(ctx,images.chog,f,-fw/2-33,-fh,fw,fh);ctx.globalAlpha=.30;sprite(ctx,images.chog,f,-fw/2-17,-fh,fw,fh);ctx.globalAlpha=1;}
 sprite(ctx,images.chog,f,-fw/2,-fh,fw,fh);ctx.restore();ctx.restore();
 // A quiet foreground shade gives glass controls contrast without covering the route.
 const shade=ctx.createLinearGradient(0,height*.79,0,height);shade.addColorStop(0,'rgba(32,20,42,0)');shade.addColorStop(1,'rgba(27,19,37,.78)');ctx.fillStyle=shade;ctx.fillRect(0,height*.79,width,height*.21);
}
