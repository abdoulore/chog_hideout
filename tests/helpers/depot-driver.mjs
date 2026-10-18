import {driver} from './mischief-driver.mjs';
// Continuous authored route; no teleports, patched guard states or disabled hazards.
export function depotApproach(get,step,{high=true,pause=0}={}){
 const d=driver(get,step);d.go(270);d.go(365,{jump:true});d.settle();d.go(410);d.go(550,{jump:true});d.settle();d.go(640);d.go(800,{jump:true});d.settle();if(pause)d.wait(pause);d.go(905);d.go(1265,{jump:true,dash:true});d.settle();d.go(1500);
 if(high){d.go(1710,{jump:true});d.settle();d.go(1760);d.go(1960,{jump:true});d.settle();}
 else{step({down:true});d.wait(.5);d.go(1550);d.go(1700,{jump:true});d.settle();d.go(1780);d.go(1960,{jump:true});d.settle();}
 d.go(2030);d.go(2330,{jump:true,dash:true});d.settle();d.go(2390);d.act();return d;
}
export function depotEscape(get,step,{high=true,music=false,pause=0}={}){
 const d=depotApproach(get,step,{high,pause});step({down:true});d.wait(.5);d.go(2070);d.go(1880,{jump:true});d.settle();d.go(1850);d.go(1670,{jump:true});d.settle();d.go(1590);d.settle();d.go(1140);d.go(890,{jump:true,dash:true});d.settle();if(music){d.wait(1.2,{interact:true});step({});}d.go(710,{jump:true,dash:true});d.settle();d.go(110);d.act();
}
