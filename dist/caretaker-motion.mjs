import {FLOOR} from './engine.mjs';
export function caretakerPose(s,reducedMotion=false){
 const g=s.caretaker,walk=g.walk||0;
 const bob=reducedMotion?0:g.moving?-Math.abs(Math.sin(walk))*2.2:0;
 const angle=reducedMotion?0:g.notice>0?-.065:g.moving?Math.sin(walk)*.018:0;
 return {bob,angle,light:{x:g.x+14+g.facing*(Math.cos(angle)*36+Math.sin(angle)*30),y:FLOOR+bob+Math.sin(angle)*36-Math.cos(angle)*30}};
}
