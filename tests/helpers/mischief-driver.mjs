import assert from 'node:assert/strict';
// Feasibility controller using only public movement/actions. No state teleport or guard overrides.
export function driver(get,step){
 const wait=(seconds,input={})=>{for(let i=0;i<seconds*120&&get().status==='playing';i++)step(input);};
 function go(x,{jump=false,dash=false,double=false}={}){let n=0,j=jump,d=false;while(Math.abs(get().x-x)>5&&n++<1000&&get().status==='playing'){const s=get(),input={right:s.x<x,left:s.x>x,jump:(j&&s.ground)||(double&&!j&&!s.ground&&!s.airJumpUsed&&s.vy>=0),dash:dash&&!s.ground&&s.vy>-360&&!d};if(input.jump)j=false;if(input.dash)d=true;step(input);}assert(Math.abs(get().x-x)<6,`Cannot reach ${x}: x=${get().x} status=${get().status}`);}
 function settle(){for(let i=0;i<220&&!get().ground&&get().status==='playing';i++)step({});assert(get().ground,'Could not land');}
 const act=()=>{wait(.8,{interact:true});step({});};
 return {wait,go,settle,act};
}
export function batteryRoute(d){d.go(430);d.act();d.go(110);d.act();}
export function allTreasuresRoute(d,get,step){d.go(270);d.go(365,{jump:true});d.settle();d.go(410);d.go(550,{jump:true});d.settle();d.go(640);d.go(800,{jump:true});d.settle();d.act();d.go(905);d.go(1265,{jump:true,dash:true});d.settle();d.go(1200);d.settle();d.go(1330);d.act();d.go(1030,{jump:true,dash:true});d.settle();let attempts=0;while((get().y+34>340||!get().ground)&&get().status==='playing'&&attempts++<1400)step({jump:get().ground&&get().y+34>450});assert(get().ground&&get().y+34<=340,'Could not ride the lift');d.go(1290,{jump:true,dash:true});d.settle();d.go(1450);d.act();d.go(1225);d.go(910,{jump:true,dash:true});d.settle();d.go(760);d.go(630,{jump:true});d.settle();d.go(465);d.settle();d.go(430);d.act();d.go(110);d.act();}
