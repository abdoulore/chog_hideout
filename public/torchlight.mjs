import {caretakerPose} from './caretaker-motion.mjs';
import {FLOOR} from './engine.mjs?motion=1';
import {BLOCK} from './mischief.mjs?motion=1';
// Presentation only: detection and suspicion continue to use the existing simulation.
function clippedRay(origin,target,obstacles){let stop=1;const dx=target.x-origin.x,dy=target.y-origin.y;for(const b of obstacles){let near=0,far=1;for(const [p,d,min,max] of [[origin.x,dx,b.x,b.x+b.w],[origin.y,dy,b.y,b.y+b.h]]){if(Math.abs(d)<.00001){if(p<min||p>max){near=2;break;}}else{const a=(min-p)/d,z=(max-p)/d;near=Math.max(near,Math.min(a,z));far=Math.min(far,Math.max(a,z));}}if(near<=far&&near>=0&&near<stop)stop=near;}return {x:origin.x+dx*stop,y:origin.y+dy*stop};}
function path(ctx,light,points){ctx.beginPath();ctx.moveTo(light.x,light.y);for(const p of points)ctx.lineTo(p.x,p.y);ctx.closePath();}
export function drawTorchBeam(ctx,s,{reducedMotion=false,origin=null}={}){
 const g=s.caretaker,light={...(origin||caretakerPose(s,reducedMotion).light),alert:g.mode==='chase',noticing:g.suspicion>.05},range=(light.alert?400:300)-36,farX=light.x+g.facing*range,obstacles=[...s.room.solids,s.cover||BLOCK.cover],points=[];
 for(let i=0;i<=32;i++)points.push(clippedRay(light,{x:farX,y:FLOOR-190+i*193/32},obstacles));
 ctx.save();path(ctx,light,points);const glow=ctx.createLinearGradient(light.x,light.y,farX,light.y);
 if(light.alert){glow.addColorStop(0,'rgba(255,151,94,.56)');glow.addColorStop(.55,'rgba(255,119,70,.30)');glow.addColorStop(1,'rgba(255,130,80,.10)');}else{glow.addColorStop(0,'rgba(255,232,142,.60)');glow.addColorStop(.5,'rgba(255,213,104,.32)');glow.addColorStop(1,'rgba(255,218,126,.10)');}
 ctx.globalCompositeOperation='screen';ctx.fillStyle=glow;ctx.fill();ctx.globalCompositeOperation='source-over';ctx.strokeStyle=light.alert?'rgba(255,151,111,.78)':'rgba(255,219,132,.75)';ctx.lineWidth=1.5;ctx.stroke();
 // A restrained bright centre makes the lantern read as the source of the beam.
 const pool=ctx.createRadialGradient(light.x,light.y,2,light.x,light.y,40);pool.addColorStop(0,'rgba(255,232,137,.40)');pool.addColorStop(1,'rgba(255,216,111,0)');ctx.fillStyle=pool;ctx.fillRect(light.x-40,light.y-40,80,80);ctx.restore();return light;
}
export function drawTorchSource(ctx,light){ctx.save();const halo=ctx.createRadialGradient(light.x,light.y,2,light.x,light.y,27);halo.addColorStop(0,'rgba(255,250,192,.90)');halo.addColorStop(.30,'rgba(255,219,113,.55)');halo.addColorStop(1,'rgba(255,198,83,0)');ctx.globalCompositeOperation='screen';ctx.fillStyle=halo;ctx.fillRect(light.x-27,light.y-27,54,54);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fff5bd';ctx.strokeStyle='#e9aa46';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(light.x,light.y,4.5,6.5,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();}
