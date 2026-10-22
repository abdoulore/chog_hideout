import {driver} from './mischief-driver.mjs';
export function lanternEscape(get,step,{music=false}={}){
 const d=driver(get,step);d.go(3990);d.act();d.go(4040);d.go(4170,{jump:true});d.settle();d.go(4240);d.go(4430,{jump:true});d.settle();d.act();d.go(4500);d.go(4650,{jump:true});d.settle();
 if(music){d.go(4750,{jump:true});d.settle();d.wait(1.2,{interact:true});step({});}
 d.go(4870);d.settle();d.go(4890);d.go(5140,{jump:true,dash:true});d.settle();d.go(5150);d.act();step({down:true});d.wait(.5);d.go(5190);d.act();return d;
}
