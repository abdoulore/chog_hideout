// Scripted feasibility probe; this does not measure human completion or touch feel.
import {HEIST} from '../../dist/heist.mjs';
export function controlHeist(s,{low=2210,high=1980}={}){
 const left=s.phase==='escape';let jump=false,dash=false;
 if(s.ground){
  if(s.y+34===460)for(const slot of s.room.spikes){const dist=left?s.x-(slot*50+40):slot*50+10-(s.x+28);if(dist>=0&&dist<=80)jump=true;}
  if(left&&s.y+34===460&&s.x<=low&&s.x>2130)jump=true;
  if(left&&s.y+34===380&&s.x<=high&&s.x>1900)jump=true;
  if(left&&s.y+34===460&&s.x<=HEIST.bridge.x+HEIST.bridge.w+80&&s.x>HEIST.bridge.x+HEIST.bridge.w)jump=true;
 }
 if(left&&!s.ground&&s.x>850&&s.x<1180&&s.y<405&&s.dashCooldown===0)dash=true;
 return {left,right:!left,jump,dash};
}
