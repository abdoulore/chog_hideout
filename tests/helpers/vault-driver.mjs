import {VENTS,ventState} from '../../public/vault-mission.mjs';
import {driver} from './mischief-driver.mjs';
export function vaultApproach(get,step,{high=true}={}){
 const d=driver(get,step);d.go(270);d.go(365,{jump:true});d.settle();d.go(410);d.go(550,{jump:true});d.settle();d.go(640);d.go(800,{jump:true});d.settle();d.go(905);d.go(1265,{jump:true,dash:true});d.settle();d.go(1490);d.act();
 if(high){d.go(1710,{jump:true});d.settle();d.go(1760);d.go(1960,{jump:true});d.settle();}
 else{step({down:true});d.wait(.5);d.go(1550);d.go(1700,{jump:true});d.settle();d.go(1780);d.go(1960,{jump:true});d.settle();}
 d.go(2020);d.act();d.go(2330,{jump:true,dash:true});d.settle();d.go(2630);d.settle();d.act();d.go(2680);d.go(2850,{jump:true});d.settle();d.go(2890);d.go(3100,{jump:true});d.settle();d.act();d.go(3330);d.settle();d.go(3420);d.go(3600,{jump:true});d.settle();d.go(3630);d.go(3890,{jump:true,dash:true});d.settle();d.go(3920);d.act();return d;
}
export function vaultEscape(get,step,{restore=false,music=false,high=true}={}){
 const d=vaultApproach(get,step,{high});step({down:true});d.wait(.5);const waitVent=v=>{for(let n=0;n<600;n++){const a=ventState(get().time,v);if(a.phase==='safe'&&a.remaining>1.5)return;step({});}};d.go(3600);waitVent(VENTS[1]);d.go(3380);d.go(2940);waitVent(VENTS[0]);d.go(2740);d.go(2390);
 if(restore){d.go(2160);d.go(2140,{jump:true});d.settle();d.go(2020,{jump:true});d.settle();d.act();d.go(1930);d.go(1710,{jump:true,dash:true});d.settle();d.go(1500,{jump:true});d.settle();d.act();d.go(1265);d.go(1035,{jump:true});d.settle();d.go(890,{jump:true});d.settle();}
 else{d.go(2070);d.go(1880,{jump:true});d.settle();d.go(1850);d.go(1670,{jump:true});d.settle();d.go(1590);d.settle();d.go(1460);d.go(1140,{jump:true,dash:true,double:true});d.settle();d.go(890,{jump:true,dash:true});d.settle();}
 if(music){if(get().y+34<380){step({down:true});d.wait(.3);d.settle();}d.wait(1.2,{interact:true});step({});}
 d.go(710,{jump:true,dash:true});d.settle();if(get().powered){d.go(630);d.go(465);d.settle();}d.go(110);d.act();return d;
}
