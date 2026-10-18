import {FLOOR} from './engine.mjs';
import {sceneLayout} from './scene-layout.mjs';
import {BLOCK,TREASURES} from './mischief.mjs';
export function actionTarget(run,action){if(!action)return null;if(action.id==='home')return {x:BLOCK.home,y:FLOOR-52,label:'GO HOME'};if(action.id==='pot')return {x:BLOCK.pot.x,y:BLOCK.pot.y-20,label:'KNOCK'};if(action.id==='restore')return {x:TREASURES.battery.x,y:FLOOR-20,label:'RESTORE'};const item=run.items[action.id];return item?{x:item.x,y:item.y-24,label:'TAKE'}:null;}
export function projectTarget(run,action,{width,height,displayWidth,displayHeight,cameraBias}){const target=actionTarget(run,action);if(!target)return null;const l=sceneLayout({...run,cameraBias},displayWidth,width,height);return {...target,x:(target.x-l.camera.x)*l.camera.zoom*displayWidth/width,y:(l.groundY+(target.y-FLOOR)*l.camera.zoom)*displayHeight/height};}

export function guardScreenDirection(run,{width,height,displayWidth,cameraBias}){
 const {camera}=sceneLayout({...run,cameraBias},displayWidth,width,height);
 const px=(run.caretaker.x+14-camera.x)*camera.zoom*displayWidth/width;
 return px<24?-1:px>displayWidth-24?1:0;
}
export function captureExplanation(run){
 if(run.deathReason==='spikes')return 'You landed on a marked spike trap. Jump before the warning sign, or use the ledges above. Dashing does not protect you from spikes.';
 if(run.deathReason==='gap')return 'You missed the landing. Save the air jump for recovery and use dash to cross the wider gap.';
 if(run.capture?.cause==='drop')return 'You dropped within the caretaker’s reach. Check below before swiping down, or jump and dash past him first.';
 if(run.capture?.cause==='air')return 'Your jump passed too close to the caretaker. Take off earlier to clear his reach.';
 if(run.capture?.cause==='street')return 'The caretaker caught you at street level. Cross above him, or break sight behind the planter before moving.';
 return 'The caretaker caught you. Watch his torch and use cover before crossing.';
}
