import {drawTorchBeam,drawTorchSource} from './torchlight.mjs';
import {FLOOR} from './engine.mjs';
import manifest from './asset-manifest.mjs';
import {BLOCK,TREASURES,nearbyAction} from './mischief.mjs';
export const CARETAKER_URL='assets/burrows-caretaker-v1.webp';
export function loadCaretaker(){return new Promise((resolve,reject)=>{const img=new Image(),timer=setTimeout(()=>reject(Error('Caretaker artwork timed out')),15000);img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(Error('Caretaker artwork unavailable'));};img.src=new URL(CARETAKER_URL,import.meta.url).href;});}
function label(ctx,text,x,y,color='#fff0c8',size=10){ctx.save();ctx.font=`700 ${size}px system-ui`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#2e243be6';ctx.strokeText(text,x,y);ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.restore();}
function beam(ctx,images,x,y,w,h){ctx.drawImage(images.timber,...manifest.timber.frame,x,y,w,h);}
export function drawTreasure(ctx,id,x,y,size=1,images=null){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.lineWidth=2;ctx.strokeStyle='#583a40';
 if(id==='sun'&&images){const glow=ctx.createRadialGradient(0,-20,1,0,-20,43);glow.addColorStop(0,'#ffe39e88');glow.addColorStop(1,'#ffe39e00');ctx.fillStyle=glow;ctx.fillRect(-43,-63,86,86);ctx.drawImage(images.sun,...manifest.sun.frame,-17,-48,34,49);}
 if(id==='battery'){const metal=ctx.createLinearGradient(-14,-36,14,0);metal.addColorStop(0,'#fff0b5');metal.addColorStop(.35,'#d99e50');metal.addColorStop(1,'#6c493f');ctx.fillStyle=metal;ctx.beginPath();ctx.roundRect(-14,-36,28,36,5);ctx.fill();ctx.stroke();ctx.fillStyle='#ffd995';ctx.fillRect(-7,-41,14,6);ctx.fillStyle='#23575c';ctx.fillRect(-9,-29,18,21);ctx.fillStyle='#ffe1a0';ctx.beginPath();ctx.moveTo(2,-27);ctx.lineTo(-5,-17);ctx.lineTo(0,-17);ctx.lineTo(-2,-10);ctx.lineTo(6,-21);ctx.lineTo(1,-21);ctx.fill();}
 if(id==='music'){const wood=ctx.createLinearGradient(0,-25,0,0);wood.addColorStop(0,'#c85e67');wood.addColorStop(.5,'#7f3753');wood.addColorStop(1,'#462b44');ctx.fillStyle=wood;ctx.beginPath();ctx.roundRect(-20,-27,40,27,5);ctx.fill();ctx.stroke();ctx.strokeStyle='#e9b973';ctx.lineWidth=3;ctx.strokeRect(-16,-22,32,17);ctx.fillStyle='#efcb82';ctx.beginPath();ctx.ellipse(0,-27,16,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4c3456';ctx.font='bold 21px Georgia';ctx.textAlign='center';ctx.fillText('♪',0,-29);ctx.strokeStyle='#f3d395';ctx.beginPath();ctx.moveTo(20,-17);ctx.lineTo(28,-17);ctx.lineTo(28,-10);ctx.stroke();}
 ctx.restore();}
export function drawMischiefProps(ctx,s,images,{reducedMotion=false}={}){
 const {gate:g,lift:l,cover}=BLOCK;
 // Two physical routes: a street shutter and the supported canopy above it.
 for(const p of s.room.platforms.filter(p=>!p.kind)){beam(ctx,images,p.x,p.y,p.w,16);for(const x of [p.x+20,p.x+p.w-20]){ctx.globalAlpha=.65;beam(ctx,images,x,p.y+15,8,FLOOR-p.y);ctx.globalAlpha=1;}}
 for(const x of [l.x+10,l.x+l.w-10]){ctx.strokeStyle='#735d55';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,238);ctx.lineTo(x,FLOOR);ctx.stroke();}beam(ctx,images,l.x,230,l.w,13);
 if(s.powered){beam(ctx,images,l.x,s.liftY,l.w,17);label(ctx,'POWERED LIFT',l.x+l.w/2,218,'#fff0bb',9);}else{beam(ctx,images,l.x,FLOOR,l.w,17);label(ctx,'LIFT OFFLINE',l.x+l.w/2,218,'#f8a891',9);}
 if(s.powered)ctx.drawImage(images.shutter,...manifest.shutter.frame,g.x,g.y,g.w,g.h);else{beam(ctx,images,g.x-8,g.y,g.w+16,10);ctx.strokeStyle='#e9c47a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(g.x+4,g.y+25);ctx.lineTo(g.x+12,g.y+33);ctx.lineTo(g.x+31,g.y+16);ctx.stroke();}label(ctx,s.powered?'GATE LOCKED':'SHORTCUT OPEN',g.x+g.w/2,g.y-13,s.powered?'#f8b69c':'#e5f2b3',9);
 // The planter is a visible occluder, not a hidden collision wall.
 const pot=ctx.createLinearGradient(cover.x,cover.y,cover.x,cover.y+cover.h);pot.addColorStop(0,'#b77258');pot.addColorStop(1,'#573448');ctx.fillStyle=pot;ctx.beginPath();ctx.roundRect(cover.x,cover.y+24,cover.w,cover.h-24,8);ctx.fill();ctx.strokeStyle='#e2ad79';ctx.lineWidth=4;ctx.stroke();
 for(let i=0;i<11;i++){ctx.fillStyle=i%2?'#547a52':'#8aab64';ctx.beginPath();ctx.ellipse(cover.x+8+i*6,cover.y+21+(i%3)*4,14,24,(i-5)*.13,0,Math.PI*2);ctx.fill();}label(ctx,'HIDE BEHIND',cover.x+cover.w/2,FLOOR+26,'#f0d9b0',8);
 // The pot's fall and the noise rings show the exact stimulus the AI hears.
 if(s.pot!=='broken'){const t=s.pot==='falling'?1-s.potTime/.42:0,x=BLOCK.pot.x+t*155,y=BLOCK.pot.y+t*140;ctx.save();ctx.translate(x,y);ctx.rotate(t*3);ctx.fillStyle='#c97a58';ctx.strokeStyle='#654452';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,-25);ctx.lineTo(14,-25);ctx.lineTo(10,0);ctx.lineTo(-10,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#6b8c53';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse((i-2)*5,-28,5,13,(i-2)*.3,0,Math.PI*2);ctx.fill();}ctx.restore();}else{ctx.fillStyle='#c97a58';for(let i=0;i<5;i++)ctx.fillRect(950+i*8,FLOOR-5-i%2*3,6,4);}
 for(const item of Object.values(s.items)){if(item.state!=='world')continue;drawTreasure(ctx,item.id,item.x,item.y-4,1,images);label(ctx,item.id==='battery'?'BATTERY · 1':item.id==='music'?'MUSIC BOX · 2':'POCKET SUN · 3',item.x,item.y-68,'#fff0bf',9);}
 if(s.items.battery.state!=='world'||s.items.battery.x!==TREASURES.battery.x){ctx.strokeStyle='#c9a472';ctx.lineWidth=3;ctx.strokeRect(TREASURES.battery.x-16,FLOOR-35,32,35);}
 const door=manifest.props.frames.door;ctx.drawImage(images.props,...door,52,FLOOR-109,115,109);label(ctx,s.loot.length?(s.controlMode==='gestures'?'HOME · TAP DOOR TO LEAVE':'HOME · HOLD ACTION TO LEAVE'):'YOUR WAY HOME',110,FLOOR+24,'#fff0bf',9);
 for(const n of s.noise){const age=s.time-n.time;if(age>1.2)continue;ctx.save();ctx.globalAlpha=(1-age/1.2)*.7;ctx.strokeStyle=n.kind==='bell'?'#ffb392':'#f8db94';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(n.x,n.y-15,18+age*80,12+age*35,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 const guard=s.caretaker,eyeX=guard.x+14,eyeY=FLOOR-54;
 const torch=drawTorchBeam(ctx,s,{reducedMotion});
 ctx.save();ctx.fillStyle='rgba(42,25,42,.26)';ctx.beginPath();ctx.ellipse(eyeX,FLOOR+2,28,4,0,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.save();ctx.translate(eyeX,FLOOR);ctx.scale(guard.facing,1);const stride=reducedMotion?0:Math.sin(s.time*(guard.mode==='chase'?16:7))*1.2;if(images.caretaker)ctx.drawImage(images.caretaker,-51,-101+stride,102,101);ctx.restore();drawTorchSource(ctx,torch);
 const state=guard.mode==='chase'?'! CHASING':guard.suspicion>.05?'? NOTICING':guard.mode==='investigate'?'? INVESTIGATING':guard.mode==='search'?'? SEARCHING':'PATROLLING';label(ctx,state,eyeX,FLOOR-120,guard.mode==='chase'?'#ffc0a8':'#fff0c9',9);
 ctx.fillStyle='#35273b';ctx.beginPath();ctx.roundRect(eyeX-27,FLOOR-113,54,5,2);ctx.fill();ctx.fillStyle=guard.mode==='chase'?'#f58a70':'#ffd17b';ctx.fillRect(eyeX-27,FLOOR-113,54*guard.suspicion,5);
 const a=nearbyAction(s);if(a){label(ctx,s.controlMode==='gestures'?'TAP · '+a.label.toUpperCase():a.id==='home'?'HOLD ACTION · LEAVE':'HOLD ACTION · '+a.label.toUpperCase(),s.x+14,s.y-76,'#fff3c9',10);if(s.actionTime>0){ctx.fillStyle='#33223a';ctx.fillRect(s.x-13,s.y-65,54,5);ctx.fillStyle='#ffe0a1';ctx.fillRect(s.x-13,s.y-65,54*Math.min(1,s.actionTime/a.hold),5);}}
}
export function drawMischiefCarry(ctx,s,images){s.loot.forEach((id,i)=>drawTreasure(ctx,id,s.x+14+(i-1)*21,s.y-30-(i%2)*9,.5,images));}
