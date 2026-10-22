import {driver} from './mischief-driver.mjs';
import {missionVents,ventState} from '../../public/vault-mission.mjs';
export function annexEscape(get,step,{music=false,low=false}={}){
 const d=driver(get,step);d.go(4200);d.settle();d.go(4230);d.go(4410,{jump:true});d.settle();d.act();if(music){d.go(4490);d.wait(1.2,{interact:true});step({});}d.go(4510);d.go(4700,{jump:true});d.settle();d.act();if(low){step({down:true});d.wait(.3);d.settle();}d.go(4730);d.go(4970,{jump:true,dash:true});d.settle();d.go(5040);d.act();step({down:true});d.wait(.5);
 const vents=missionVents(get()),waitVent=v=>{for(let n=0;n<600;n++){const a=ventState(get().time,v);if(a.phase==='safe'&&a.remaining>1.5)return;step({});}};
 d.go(4930);waitVent(vents[1]);d.go(4740);d.go(4400);waitVent(vents[0]);d.go(4200);d.go(3910);d.act();return d;
}
