export function actorFrames(run,fx={},reduced=false){
 const g=run.caretaker;
 return {chog:run.dashTime>0?6:!run.ground?(run.vy<0?4:5):fx.land>.09?7:Math.abs(run.vx)>8?(reduced?1:[1,2,3,2][Math.floor(run.time*14)%4]):0,
 care:g.notice>0?8:g.mode==='chase'?9+(reduced?0:Math.floor(g.walk*2)%4):g.moving?(reduced?0:Math.floor(g.walk*2)%6):6+(reduced?0:Math.floor(run.time*2)%2)};
}
export const PIXEL_KEYS=['chog','care','city','ground','plankL','plankM','plankR','home','planter','shutter','lift','socket','pot','battery','sun','music','lamp'];
