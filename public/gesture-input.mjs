// Coordinates and thresholds are CSS pixels; no timers or delayed tap callbacks.
export const GESTURE_KEY='chog-controls:v1';
export function readControlMode(storage){try{return storage?.getItem(GESTURE_KEY)==='buttons'?'buttons':'gestures';}catch{return 'gestures';}}
export function saveControlMode(storage,mode){try{storage?.setItem(GESTURE_KEY,mode);return !!storage;}catch{return false;}}
export function createGestureInput({bounds,enabled=()=>true,onMove=()=>{},onJump=()=>{},onDown=null,onDash=()=>{},onStick=()=>{},now=()=>globalThis.performance?.now()||0}={}){
 let move=null,action=null;
 const point=e=>{const b=bounds();return {x:e.clientX-(b.left||0),y:e.clientY-(b.top||0),w:b.width,h:b.height};};
 const time=e=>Number.isFinite(e.timeStamp)?e.timeStamp:now();
 function updateMove(e){const p=point(e),dx=Math.max(-42,Math.min(42,p.x-move.x));onMove(Math.abs(dx)<9?0:Math.sign(dx));onStick({active:true,x:move.x,y:move.y,dx});}
 function down(e){if(!enabled()||(e.pointerType==='mouse'&&e.button!==0))return;const p=point(e);if(p.y<110)return;let accepted=false;
 if(p.x<p.w*.48&&p.y>p.h*.5&&!move){move={id:e.pointerId,x:p.x,y:p.y};updateMove(e);accepted=true;}
 else if(p.x>=p.w*.48&&!action){action={id:e.pointerId,x:p.x,y:p.y,t:time(e),fired:false};accepted=true;}
 if(accepted){e.preventDefault?.();e.currentTarget?.setPointerCapture?.(e.pointerId);}
 }
 function motion(e){if(!enabled()){reset();return;}if(move?.id===e.pointerId){e.preventDefault?.();updateMove(e);return;}if(action?.id!==e.pointerId)return;e.preventDefault?.();const p=point(e),dx=p.x-action.x,dy=p.y-action.y;// Lock the first clear direction. Slight diagonals are allowed; ambiguous ones wait.
 if(action.fired)return;
 // A resting thumb can start a fresh stroke without lifting. Re-anchor after
 // inactivity; a slow drift or the first late event alone never triggers an action.
 if(time(e)-action.t>320){action.x=p.x;action.y=p.y;action.t=time(e);return;}
 if(-dy>=24&&-dy>Math.abs(dx)*1.15){action.fired=true;onJump();}
 else if(onDown&&dy>=28&&dy>Math.abs(dx)*1.15){action.fired=true;onDown();}
 else if(Math.abs(dx)>=28&&Math.abs(dx)>Math.abs(dy)*1.15){action.fired=true;onDash(Math.sign(dx));}}
 function end(e,cancel=false){if(move?.id===e.pointerId){move=null;onMove(0);onStick({active:false});}if(action?.id===e.pointerId){if(!cancel&&enabled())motion(e);action=null;}}
 function reset(){move=null;action=null;onMove(0);onStick({active:false});}
 return {down,move:motion,up:e=>end(e),cancel:e=>end(e,true),reset};
}
