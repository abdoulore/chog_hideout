import {W,H,FLOOR,STEP,newRun,stepRun,groundSegments,cameraFrame,MOVEMENT_ROOM} from './engine.mjs';
import {drawChog} from './art.mjs';

const room=MOVEMENT_ROOM;
const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d');

let run=newRun(room),started=false,paused=false,input={},acc=0,last=0,renderer='canvas',game=null,scene=null,phaserReady=null,switchVersion=0;
const resetInput=()=>{input={left:false,right:false,jump:false,dash:false};};resetInput();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function text(c,t,x,y,size=14,color='#624e64'){c.fillStyle=color;c.font=`700 ${size}px system-ui`;c.fillText(t,x,y);}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function polygon(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function buildingShapes(){const out=[];for(let layer=0;layer<2;layer++)for(let i=0;i<25;i++){const x=i*190+(layer?70:0),y=165+(i*53%100)+layer*50,w=85+i*17%75;out.push({layer,x,y,w,h:420-y});}return out;}
const buildings=buildingShapes();
function camera(){const element=$('phaser-host').hidden?canvas:$('phaser-host');return cameraFrame(run,element.getBoundingClientRect().width);}
function canvasRender(){
 const cam=camera();ctx.clearRect(0,0,W,H);const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#bdc9ee');sky.addColorStop(.65,'#f6d6aa');sky.addColorStop(1,'#eac39b');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#fff2c8';ctx.beginPath();ctx.arc(710,110,54,0,Math.PI*2);ctx.fill();
 for(const b of buildings){const x=b.x-cam.x*(b.layer?.36:.18);if(x>W+200||x+b.w<-200)continue;rect(ctx,x,b.y,b.w,b.h,b.layer?'#ae94ad':'#c6b1cd');polygon(ctx,[[x-9,b.y],[x+b.w/2,b.y-35],[x+b.w+9,b.y]],b.layer?'#a78099':'#b69abb');rect(ctx,x+b.w*.4,b.y+18,17,24,'#f4dba6');}
 ctx.save();ctx.translate(0,FLOOR*(1-cam.zoom));ctx.scale(cam.zoom,cam.zoom);ctx.translate(-cam.x,0);
 for(const p of groundSegments(room)){rect(ctx,p.x,p.y,p.w,H-p.y,'#694055');rect(ctx,p.x,p.y,p.w,12,'#c87560');rect(ctx,p.x,p.y,p.w,4,'#f5cc87');for(let x=p.x;x<p.x+p.w;x+=80){rect(ctx,x+12,FLOOR+24,45,4,'#835368');}}
 for(const p of room.platforms){rect(ctx,p.x,p.y,p.w,p.h,'#835065');rect(ctx,p.x,p.y,p.w,4,'#efb478');rect(ctx,p.x+12,p.y+16,9,44,'#8d6674');rect(ctx,p.x+p.w-21,p.y+16,9,44,'#8d6674');}
 for(const gap of room.gaps){text(ctx,'JUMP → DASH',gap.x+15,505,18,'#794b68');const end=gap.x+gap.w;rect(ctx,end,FLOOR-3,180,4,'#c9e6a7');}
 room.orbs.forEach((o,i)=>{if(run.collected.includes(i))return;ctx.fillStyle='#f5bc5e';ctx.beginPath();ctx.arc(o.x,o.y,8,0,Math.PI*2);ctx.fill();});
 for(const slot of room.spikes){for(let n=0;n<3;n++){const x=slot*50+5+n*13;polygon(ctx,[[x,FLOOR],[x+7,FLOOR-25],[x+14,FLOOR]],'#563654');polygon(ctx,[[x+3,FLOOR-5],[x+7,FLOOR-22],[x+9,FLOOR-5]],'#e6d4ca');}}
 rect(ctx,room.width-90,FLOOR-100,57,100,'#9d5f56');rect(ctx,room.width-84,FLOOR-94,45,94,'#f5bc5e');text(ctx,'EXIT',room.width-86,FLOOR-116,16,'#62364d');
 const pose=run.dashTime>0?'dash':!run.ground?'jump':Math.abs(run.vx)>0?'run':'idle';
 if(run.dashTime>0&&!reduced){ctx.globalAlpha=.22;drawChog(ctx,run.x+14-run.facing*30,run.y+14,40,run.facing,'dash');ctx.globalAlpha=1;}
 drawChog(ctx,run.x+14,run.y+14,40,run.facing,pose,run.time*20);ctx.restore();
}
function show(kicker,title,message,button){$('kicker').textContent=kicker;$('title').textContent=title;$('message').textContent=message;$('play').textContent=button;$('overlay').hidden=false;}
function start(){run=newRun(room);started=true;paused=false;acc=0;resetInput();$('overlay').hidden=true;$('pause').textContent='Pause';if(renderer==='canvas')canvas.focus({preventScroll:true});}
function pause(){if(!started||run.status!=='playing'||paused)return;paused=true;resetInput();$('pause').textContent='Resume';show('PAUSED','Take your time.','Your raid will wait here.','Resume →');}
function resume(){if(!started||run.status!=='playing'){start();return;}paused=false;acc=0;resetInput();$('overlay').hidden=true;$('pause').textContent='Pause';if(renderer==='canvas')canvas.focus({preventScroll:true});}
function finish(){resetInput();if(run.status==='won')show('CLEAN GETAWAY','Made it.',`${run.time.toFixed(2)} seconds · ${run.coins} / ${room.orbs.length} sparks. Try the other renderer or beat your time.`,'Try again →');else show('QUICK RETRY',run.deathReason==='gap'?'A little more distance.':'Caught a spike.',run.deathReason==='gap'?'Jump before the edge, then dash while airborne.':'You have room to land after the gap. Set up your next jump before the spike.','Try again →');}
function hud(){$('time').textContent=`${run.time.toFixed(2)}s`;$('distance').value=Math.min(100,run.x/(room.width-74)*100);$('dash-status').textContent=run.dashCooldown>0?`DASH ${run.dashCooldown.toFixed(1)}s`:'DASH READY';$('dash').classList.toggle('cooling',run.dashCooldown>0);}
function frame(t){const dt=Math.min((t-last)/1000||0,.05);last=t;if(started&&!paused&&run.status==='playing'&&!document.hidden){acc+=dt;while(acc>=STEP){stepRun(run,input);input.jump=false;input.dash=false;acc-=STEP;if(run.status!=='playing'){finish();acc=0;break;}}}hud();if(renderer==='canvas')canvasRender();requestAnimationFrame(frame);}requestAnimationFrame(frame);
$('play').onclick=()=>paused?resume():start();$('retry').onclick=start;$('pause').onclick=()=>paused?resume():pause();$('focus').onclick=()=>{document.body.classList.toggle('focus');$('focus').textContent=document.body.classList.contains('focus')?'Exit focus':'Focus view';};
for(const [id,key] of [['left','left'],['right','right'],['jump','jump'],['dash','dash']]){const b=$(id);b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!started||paused||run.status!=='playing')return;input[key]=true;};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>{if(key==='left'||key==='right')input[key]=false;};}
window.addEventListener('keydown',e=>{if(['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','a','d','w','x','shift','r','escape'].includes(k))e.preventDefault();if(k==='escape'){paused?resume():pause();return;}if(k==='r'&&!e.repeat){start();return;}if(!started||paused||run.status!=='playing')return;if(k==='a'||k==='arrowleft')input.left=true;if(k==='d'||k==='arrowright')input.right=true;if([' ','w','arrowup'].includes(k)&&!e.repeat)input.jump=true;if(['shift','x'].includes(k)&&!e.repeat)input.dash=true;});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')input.left=false;if(k==='d'||k==='arrowright')input.right=false;});window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});

function loadPhaser(){if(window.Phaser)return Promise.resolve();return new Promise((resolve,reject)=>{const script=document.createElement('script');const timeout=setTimeout(()=>{script.remove();reject(Error('Phaser download timed out'));},12000);script.src='https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js';script.crossOrigin='anonymous';script.onload=()=>{clearTimeout(timeout);resolve();};script.onerror=()=>{clearTimeout(timeout);reject(Error('Phaser download failed'));};document.head.append(script);});}
async function initPhaser(){
 await loadPhaser();const P=window.Phaser;
 return new Promise((resolve,reject)=>{try{class MovementScene extends P.Scene{
  create(){
   scene=this;const g=this.add.graphics();g.fillStyle(0xc6ccec).fillRect(0,0,room.width,H);g.setScrollFactor(0);const sun=this.add.circle(720,110,54,0xffedc4);sun.setScrollFactor(.05);
   for(const b of buildings){const bg=this.add.graphics();bg.fillStyle(b.layer?0xae94ad:0xc6b1cd).fillRect(b.x,b.y,b.w,b.h);bg.fillStyle(b.layer?0xa78099:0xb69abb).fillTriangle(b.x-9,b.y,b.x+b.w/2,b.y-35,b.x+b.w+9,b.y);bg.fillStyle(0xf4dba6).fillRect(b.x+b.w*.4,b.y+18,17,24);bg.setScrollFactor(b.layer?.36:.18);}
   const world=this.add.graphics();for(const p of groundSegments(room)){world.fillStyle(0x694055).fillRect(p.x,p.y,p.w,H-p.y);world.fillStyle(0xc87560).fillRect(p.x,p.y,p.w,12);world.fillStyle(0xf5cc87).fillRect(p.x,p.y,p.w,4);}
   for(const p of room.platforms){world.fillStyle(0x835065).fillRect(p.x,p.y,p.w,p.h);world.fillStyle(0xefb478).fillRect(p.x,p.y,p.w,4);world.fillStyle(0x8d6674).fillRect(p.x+12,p.y+16,9,44).fillRect(p.x+p.w-21,p.y+16,9,44);}
   for(const gap of room.gaps){world.fillStyle(0xc9e6a7).fillRect(gap.x+gap.w,FLOOR-3,180,4);this.add.text(gap.x+15,485,'JUMP → DASH',{fontFamily:'system-ui',fontSize:'18px',fontStyle:'bold',color:'#794b68'});}
   for(const slot of room.spikes)for(let n=0;n<3;n++){const x=slot*50+5+n*13;world.fillStyle(0x563654).fillTriangle(x,FLOOR,x+7,FLOOR-25,x+14,FLOOR);world.fillStyle(0xe6d4ca).fillTriangle(x+3,FLOOR-5,x+7,FLOOR-22,x+9,FLOOR-5);}
   world.fillStyle(0x9d5f56).fillRect(room.width-90,FLOOR-100,57,100);world.fillStyle(0xf5bc5e).fillRect(room.width-84,FLOOR-94,45,94);this.add.text(room.width-86,FLOOR-132,'EXIT',{fontFamily:'system-ui',fontSize:'16px',fontStyle:'bold',color:'#62364d'});
   this.sparks=room.orbs.map(o=>this.add.circle(o.x,o.y,8,0xf5bc5e));
   for(const pose of ['idle','run','jump','dash'])for(let phase=0;phase<(pose==='run'?6:1);phase++){const key=`chog-${pose}-${phase}`,texture=this.textures.createCanvas(key,80,96);drawChog(texture.getContext(),40,60,48,1,pose,phase*Math.PI/3);texture.refresh();}
   this.hero=this.add.image(run.x+14,run.y+14,'chog-idle-0').setOrigin(.5,60/96).setScale(40/48);this.cameras.main.setOrigin(0,0);resolve();
  }
  update(){if(renderer!=='phaser')return;const cam=camera();this.cameras.main.setZoom(cam.zoom).setScroll(cam.x,cam.y);const pose=run.dashTime>0?'dash':!run.ground?'jump':Math.abs(run.vx)>0?'run':'idle',phase=pose==='run'?Math.floor(run.time*15)%6:0;this.hero.setTexture(`chog-${pose}-${phase}`).setPosition(run.x+14,run.y+14).setFlipX(run.facing<0);this.sparks.forEach((spark,i)=>spark.setVisible(!run.collected.includes(i)));}
 }
 game=new P.Game({type:P.AUTO,parent:'phaser-host',width:W,height:H,backgroundColor:'#f4d6aa',render:{antialias:true,roundPixels:true},scale:{mode:P.Scale.FIT,autoCenter:P.Scale.CENTER_BOTH},audio:{noAudio:true},scene:MovementScene});}catch(e){reject(e);}});
}
$('renderer').onchange=async()=>{pause();const version=++switchVersion;if($('renderer').value==='canvas'){renderer='canvas';game?.loop.sleep();canvas.hidden=false;$('phaser-host').hidden=true;$('renderer-status').textContent='Canvas baseline ready.';return;}$('renderer-status').textContent='Loading Phaser experiment…';try{phaserReady??=initPhaser();await phaserReady;if(version!==switchVersion)return;renderer='phaser';canvas.hidden=true;$('phaser-host').hidden=false;game.scale.refresh();game.loop.wake();$('renderer-status').textContent='Phaser scene ready. Resume or retry to compare.';}catch(e){phaserReady=null;$('renderer').value='canvas';renderer='canvas';game?.loop.sleep();canvas.hidden=false;$('phaser-host').hidden=true;$('renderer-status').textContent='Phaser could not load here. Canvas remains playable.';}};
if(new URLSearchParams(location.search).get('engine')==='phaser'){$('renderer').value='phaser';$('renderer').onchange();}
canvasRender();hud();
