import {driver} from './mischief-driver.mjs';
export function approachSun(get,step,{pause=0}={}){
 const d=driver(get,step);d.go(270);d.go(365,{jump:true});d.settle();d.go(410);d.go(550,{jump:true});d.settle();d.go(640);d.go(800,{jump:true});d.settle();if(pause)d.wait(pause);d.go(905);d.go(1265,{jump:true,dash:true});d.settle();d.go(1360);d.act();return d;
}
export function loopEscape(get,step,{music=false,pause=0}={}){
 const d=approachSun(get,step,{pause});step({down:true});d.wait(.5);d.go(1140);d.go(890,{jump:true,dash:true});d.settle();if(music){d.wait(1.2,{interact:true});step({});}d.go(710,{jump:true,dash:true});d.settle();d.go(110);d.act();
}
