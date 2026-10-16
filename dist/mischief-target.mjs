import {FLOOR} from './engine.mjs';
import {sceneLayout} from './scene-layout.mjs';
import {BLOCK,TREASURES} from './mischief.mjs';
export function actionTarget(run,action){if(!action)return null;if(action.id==='home')return {x:BLOCK.home,y:FLOOR-52,label:'GO HOME'};if(action.id==='pot')return {x:BLOCK.pot.x,y:BLOCK.pot.y-20,label:'KNOCK'};if(action.id==='restore')return {x:TREASURES.battery.x,y:FLOOR-20,label:'RESTORE'};const item=run.items[action.id];return item?{x:item.x,y:item.y-24,label:'TAKE'}:null;}
export function projectTarget(run,action,{width,height,displayWidth,displayHeight,cameraBias}){const target=actionTarget(run,action);if(!target)return null;const l=sceneLayout({...run,cameraBias},displayWidth,width,height);return {...target,x:(target.x-l.camera.x)*l.camera.zoom*displayWidth/width,y:(l.groundY+(target.y-FLOOR)*l.camera.zoom)*displayHeight/height};}
