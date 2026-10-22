// Width comes first: preserve approach, jump and landing information on phones.
export function pixelLayout(run,width,height){
 const portrait=height/width>1.2,minWidth=portrait?360:480;
 const zoom=Math.max(1,Math.floor(Math.min(width/minWidth,height/260)));
 const view=Math.ceil(width/zoom),nativeH=Math.ceil(height/zoom);
 const bias=run.cameraBias??(run.facing<0?.75:.25);
 const x=Math.round(Math.max(run.annexMission?3840:0,Math.min(Math.max(0,run.room.width-view),run.x-view*bias)));
 const base=Math.round(nativeH*(portrait?.65:.74));
 const top=Math.round(nativeH*.22+48);
 const ground=Math.round(base+Math.max(0,top-(base+run.y+34-460)));
 return {portrait,camera:{x,zoom},groundY:ground*zoom,nativeW:view,nativeH,characterHeight:36};
}
