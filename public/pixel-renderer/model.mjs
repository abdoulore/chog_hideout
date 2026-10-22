export function actorFrames(run,fx={},reduced=false){
 const g=run.caretaker;
 return {chog:run.dashTime>0?6:!run.ground?(run.vy<0?4:5):fx.land>.09?7:Math.abs(run.vx)>8?(reduced?1:[1,2,3,2][Math.floor(run.time*14)%4]):0,
 care:g.notice>0?8:g.mode==='chase'?9+(reduced?0:Math.floor(g.walk*2)%4):g.moving?(reduced?0:Math.floor(g.walk*2)%6):6+(reduced?0:Math.floor(run.time*2)%2)};
}
export const PIXEL_KEYS=['chog','care','city','ground','plankL','plankM','plankR','home','planter','shutter','lift','socket','pot','battery','sun','music','lamp'];
// Presentation cues follow real state, never a separate stealth simulation.
export function encounterCues(s){
 const g=s.caretaker,atCover=s.x+14>=1090&&s.x+14<=1170&&s.y+34>380;
 return {socket:s.powered?'CELL CONNECTED':s.loot.includes('battery')?'RETURN CELL':'CELL MISSING',
 gate:s.powered?'GATE CLOSED':'GATE OPEN',lift:s.powered?'LIFT POWERED':'NEEDS CELL',
 guard:g.mode==='chase'?(g.notice>0?'! SPOTTED':g.roofWatch?'! WATCHING LANDING':'! CHASING'):g.suspicion>.05?'? NOTICING':g.mode==='investigate'?'? HEARD SOMETHING':g.mode==='search'?'SEARCHING':'',
 cover:atCover&&!g.visible?'SIGHT BLOCKED':null};
}
export function pixelMotion(s,fx={},reduced=false){
 if(reduced)return {x:0,y:0};
 const moving=s.ground&&Math.abs(s.vx)>8;
 return {x:s.action?Math.round(Math.sin(Math.min(1,s.actionTime/.45)*Math.PI)*2)*s.facing:0,
 y:moving?-Math.round(Math.abs(Math.sin(fx.stride??s.time*14))):s.ground&&!s.action?-Math.round(Math.max(0,Math.sin(s.time*2.5))):0};
}
