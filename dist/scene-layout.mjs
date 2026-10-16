import {FLOOR} from './engine.mjs';
export function isPortrait(displayWidth,width=900,height=520){return displayWidth<600&&height/width>1.2;}
export function cameraBiasFor(phase,displayWidth,width=900,height=520){const portrait=isPortrait(displayWidth,width,height);return phase==='escape'?(portrait?.8:.72):(portrait?.2:.28);}
export function sceneCamera(run,displayWidth,width=900,height=520){
 const portrait=isPortrait(displayWidth,width,height),zoom=portrait?(run.room.mischief?1.6:1.85):displayWidth<600?1.7:1.2,view=width/zoom;
 // Mobile look-ahead preserves the full required gap and 80 units of landing.
 const bias=run.cameraBias??cameraBiasFor(run.phase,displayWidth,width,height);
 return {zoom,x:Math.max(0,Math.min(run.room.width-view,run.x-view*bias))};
}
export function sceneLayout(run,displayWidth,width=900,height=520){
 const portrait=isPortrait(displayWidth,width,height),camera=sceneCamera(run,displayWidth,width,height),characterHeight=portrait?(run.room.mischief?100:82):74;
 const base=height*(portrait?.65:.73),foot=base+(run.y+34-FLOOR)*camera.zoom;
 const minFoot=portrait?Math.max(height*.29,102*width/Math.max(displayWidth,1)+characterHeight*camera.zoom):Math.max(170,height*.24);
 return {portrait,camera,characterHeight,groundY:base+Math.max(0,minFoot-foot),backgroundScale:portrait?1.16:1,backgroundLift:portrait?height*.12:0};
}
