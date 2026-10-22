import {driver} from './mischief-driver.mjs';
import {missionVents,ventState} from '../../public/vault-mission.mjs';
export function annexEscape(get,step,{music=false,low=false,delay=0}={}){
 const d=driver(get,step);d.wait(delay);d.go(4200);d.settle();d.go(4230);d.go(4410,{jump:true});d.settle();d.act();d.go(4490);d.act();d.go(4510);d.go(4700,{jump:true});d.settle();
 if(music){d.go(4750,{jump:true});d.settle();d.wait(1.2,{interact:true});step({});}
 if(low){step({down:true});d.wait(.3);d.settle();}d.go(4730);d.go(4970,{jump:true,dash:true});d.settle();d.go(5190);d.go(5480,{jump:true,dash:true});d.settle();d.go(5490);d.act();d.go(5530);d.go(5730,{jump:true});d.settle();d.go(5740);d.act();step({down:true});d.wait(.5);
 const vents=missionVents(get()),waitVent=v=>{for(let n=0;n<600;n++){const a=ventState(get().time,v);if(a.phase==='safe'&&a.remaining>1.5)return;step({});}};
 d.go(5530);waitVent(vents[2]);d.go(5300);d.go(5340,{jump:true});d.settle();d.go(5090,{jump:true,dash:true});d.settle();d.go(4930);d.go(4700,{jump:true,dash:true});d.settle();d.go(4490,{jump:true,dash:true});d.settle();d.go(4200,{jump:true,dash:true});d.settle();d.go(3910);d.settle();d.act();return d;
}
