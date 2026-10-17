import {drawDistrictCanopies,drawDistrictHome,drawDistrictPower,drawDistrictPlanter} from './district-scene.mjs';
import {districtSprite} from './district-art.mjs';
import {caretakerPose} from './caretaker-motion.mjs';
import {drawTorchBeam,drawTorchSource} from './torchlight.mjs?motion=1';
import {FLOOR} from './engine.mjs?motion=1';
import manifest from './asset-manifest.mjs';
import {BLOCK,TREASURES,nearbyAction} from './mischief.mjs?motion=1';
export const CARETAKER_URL='assets/burrows-caretaker-v1.webp';
export function loadCaretaker(){return new Promise((resolve,reject)=>{const img=new Image(),timer=setTimeout(()=>reject(Error('Caretaker artwork timed out')),15000);img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(Error('Caretaker artwork unavailable'));};img.src=new URL(CARETAKER_URL,import.meta.url).href;});}
function label(ctx,text,x,y,color='#fff0c8',size=10){ctx.save();ctx.font=`700 ${size}px system-ui`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#2e243be6';ctx.strokeText(text,x,y);ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.restore();}
function beam(ctx,images,x,y,w,h){ctx.drawImage(images.timber,...manifest.timber.frame,x,y,w,h);}
export function drawTreasure(ctx,id,x,y,size=1,images=null){if(images?.districtProps&&['battery','music'].includes(id)){const w=id==='battery'?31:48,h=id==='battery'?44:34;ctx.save();ctx.translate(x,y);ctx.scale(size,size);districtSprite(ctx,images,id,-w/2,-h,w,h);ctx.restore();return;}ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.lineWidth=2;ctx.strokeStyle='#583a40';
 if(id==='sun'&&images){const glow=ctx.createRadialGradient(0,-20,1,0,-20,43);glow.addColorStop(0,'#ffe39e88');glow.addColorStop(1,'#ffe39e00');ctx.fillStyle=glow;ctx.fillRect(-43,-63,86,86);ctx.drawImage(images.sun,...manifest.sun.frame,-17,-48,34,49);}
 if(id==='battery'){const metal=ctx.createLinearGradient(-14,-36,14,0);metal.addColorStop(0,'#fff0b5');metal.addColorStop(.35,'#d99e50');metal.addColorStop(1,'#6c493f');ctx.fillStyle=metal;ctx.beginPath();ctx.roundRect(-14,-36,28,36,5);ctx.fill();ctx.stroke();ctx.fillStyle='#ffd995';ctx.fillRect(-7,-41,14,6);ctx.fillStyle='#23575c';ctx.fillRect(-9,-29,18,21);ctx.fillStyle='#ffe1a0';ctx.beginPath();ctx.moveTo(2,-27);ctx.lineTo(-5,-17);ctx.lineTo(0,-17);ctx.lineTo(-2,-10);ctx.lineTo(6,-21);ctx.lineTo(1,-21);ctx.fill();}
 if(id==='music'){const wood=ctx.createLinearGradient(0,-25,0,0);wood.addColorStop(0,'#c85e67');wood.addColorStop(.5,'#7f3753');wood.addColorStop(1,'#462b44');ctx.fillStyle=wood;ctx.beginPath();ctx.roundRect(-20,-27,40,27,5);ctx.fill();ctx.stroke();ctx.strokeStyle='#e9b973';ctx.lineWidth=3;ctx.strokeRect(-16,-22,32,17);ctx.fillStyle='#efcb82';ctx.beginPath();ctx.ellipse(0,-27,16,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4c3456';ctx.font='bold 21px Georgia';ctx.textAlign='center';ctx.fillText('♪',0,-29);ctx.strokeStyle='#f3d395';ctx.beginPath();ctx.moveTo(20,-17);ctx.lineTo(28,-17);ctx.lineTo(28,-10);ctx.stroke();}
 ctx.restore();}
export function drawMischiefProps(ctx,s,images,{reducedMotion=false}={}){
 const {gate:g,lift:l,cover}=BLOCK;
 drawDistrictHome(ctx,s,images,{reducedMotion});drawDistrictCanopies(ctx,s,images);drawDistrictPower(ctx,s,images,{reducedMotion});
 // The planter is a visible occluder, not a hidden collision wall.
 if(!drawDistrictPlanter(ctx,s,images)){
 const pot=ctx.createLinearGradient(cover.x,cover.y,cover.x,cover.y+cover.h);pot.addColorStop(0,'#b77258');pot.addColorStop(1,'#573448');ctx.fillStyle=pot;ctx.beginPath();ctx.roundRect(cover.x,cover.y+24,cover.w,cover.h-24,8);ctx.fill();ctx.strokeStyle='#e2ad79';ctx.lineWidth=4;ctx.stroke();
 for(let i=0;i<11;i++){ctx.fillStyle=i%2?'#547a52':'#8aab64';ctx.beginPath();ctx.ellipse(cover.x+8+i*6,cover.y+21+(i%3)*4,14,24,(i-5)*.13,0,Math.PI*2);ctx.fill();}
 }
 // The pot's fall and the noise rings show the exact stimulus the AI hears.
 if(s.pot!=='broken'){const t=s.pot==='falling'?1-s.potTime/.42:0,x=BLOCK.pot.x+t*155,y=BLOCK.pot.y+t*140;ctx.save();ctx.translate(x,y);ctx.rotate(t*3);ctx.fillStyle='#c97a58';ctx.strokeStyle='#654452';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,-25);ctx.lineTo(14,-25);ctx.lineTo(10,0);ctx.lineTo(-10,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#6b8c53';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse((i-2)*5,-28,5,13,(i-2)*.3,0,Math.PI*2);ctx.fill();}ctx.restore();}else{ctx.fillStyle='#c97a58';for(let i=0;i<5;i++)ctx.fillRect(950+i*8,FLOOR-5-i%2*3,6,4);}
 for(const item of Object.values(s.items)){if(item.state!=='world')continue;const pulling=s.action===item.id?Math.min(1,s.actionTime/item.hold):0;const tug=reducedMotion?0:Math.sin(pulling*Math.PI);ctx.save();ctx.translate(item.x+(s.x+14-item.x)*pulling*.22,item.y-4-tug*12);ctx.rotate(reducedMotion?0:Math.sin(pulling*Math.PI*5)*pulling*.09);drawTreasure(ctx,item.id,0,0,1,images);ctx.restore();if(Math.abs(s.x+14-item.x)<150)label(ctx,'◆ '+item.value,item.x,item.y-62,'#ffe1a0',16);}
 if(!images.districtHome){const door=manifest.props.frames.door;ctx.drawImage(images.props,...door,52,FLOOR-109,115,109);}
 for(const n of s.noise){const age=s.time-n.time;if(age>1.2)continue;ctx.save();ctx.globalAlpha=(1-age/1.2)*.7;ctx.strokeStyle=n.kind==='bell'?'#ffb392':'#f8db94';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(n.x,n.y-15,18+age*80,12+age*35,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 const guard=s.caretaker,eyeX=guard.x+14,eyeY=FLOOR-54;
 const torch=drawTorchBeam(ctx,s,{reducedMotion});
 ctx.save();ctx.fillStyle='rgba(42,25,42,.26)';ctx.beginPath();ctx.ellipse(eyeX,FLOOR+2,28,4,0,0,Math.PI*2);ctx.fill();ctx.restore();
 const guardPose=caretakerPose(s,reducedMotion);ctx.save();ctx.translate(eyeX,FLOOR+guardPose.bob);ctx.scale(guard.facing,1);ctx.rotate(guardPose.angle);if(images.caretaker)ctx.drawImage(images.caretaker,-51,-101,102,101);ctx.restore();drawTorchSource(ctx,torch);
 const state=guard.mode==='chase'?(guard.notice>0?'! GET READY':guard.roofWatch?'! BLOCKING YOUR ESCAPE':'! CHASING'):guard.suspicion>.05?'? NOTICING':guard.mode==='investigate'?(guard.notice>0?'? HEARD SOMETHING':'? INVESTIGATING'):guard.mode==='search'?'? SEARCHING':'';if(state)label(ctx,state,eyeX,FLOOR-120,guard.mode==='chase'?'#ffc0a8':'#fff0c9',9);
 if(state){ctx.fillStyle='#35273b';ctx.beginPath();ctx.roundRect(eyeX-27,FLOOR-113,54,5,2);ctx.fill();ctx.fillStyle=guard.mode==='chase'?'#f58a70':'#ffd17b';ctx.fillRect(eyeX-27,FLOOR-113,54*guard.suspicion,5);}
 const a=nearbyAction(s);if(a&&s.controlMode!=='gestures'){label(ctx,s.controlMode==='gestures'?'TAP · '+a.label.toUpperCase():a.id==='home'?'HOLD ACTION · LEAVE':'HOLD ACTION · '+a.label.toUpperCase(),s.x+14,s.y-76,'#fff3c9',10);if(s.actionTime>0){ctx.fillStyle='#33223a';ctx.fillRect(s.x-13,s.y-65,54,5);ctx.fillStyle='#ffe0a1';ctx.fillRect(s.x-13,s.y-65,54*Math.min(1,s.actionTime/a.hold),5);}}
}
export function drawMischiefCarry(ctx,s,images,{reducedMotion=false}={}){
 s.loot.forEach((id,i)=>{
  const endX=s.x+14+(i-1)*21,endY=s.y-30-(i%2)*9,fx=s.theftFX?.id===id?s.theftFX:null;
  const t=fx&&!reducedMotion?1-fx.time/.32:1,ease=1-(1-t)**3;
  const x=fx?fx.x+(endX-fx.x)*ease:endX,y=fx?fx.y+(endY-fx.y)*ease-Math.sin(t*Math.PI)*35:endY;
  const bob=reducedMotion||fx?0:Math.sin(s.time*7-i)*1.5;
  drawTreasure(ctx,id,x,y+bob,fx?1-.5*ease:.5,images);
 });
}
