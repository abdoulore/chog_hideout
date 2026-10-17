import {prepareLoop,loopRoom,ringLoopAlarm,advanceLoop,loopObjective} from './loop-escape.mjs';
import {newRun,stepRun,STEP,FLOOR,overlap} from './engine.mjs?motion=1';
export const JOB_ID='one-more-thing-v1';
export const BLOCK={width:1720,home:110,gate:{x:570,y:330,w:42,h:130},lift:{x:1010,w:160},pot:{x:815,y:310},cover:{x:1090,y:380,w:80,h:80},patrol:{min:800,max:1510}};
export const TREASURES={battery:{id:'battery',name:'Lift battery',x:444,y:460,value:1,hold:.45},sun:{id:'sun',name:'Pocket Sun',x:1335,y:460,value:3,hold:.65},music:{id:'music',name:'Music box',x:1460,y:310,value:2,hold:.55}};
const roofs=[{x:300,y:385,w:160,h:12},{x:500,y:310,w:185,h:12},{x:730,y:310,w:210,h:12},{x:1240,y:310,w:330,h:12}];
function room(powered=true,liftY=385,movementTrial=null){return {id:JOB_ID,movementTrial,platformDrop:!!movementTrial,doubleJump:movementTrial==='double',heist:true,mischief:true,name:'One More Thing',width:BLOCK.width,gaps:[],spikes:[],orbs:[],platforms:[...roofs,...(movementTrial?[{x:190,y:310,w:70,h:12}]:[]),...(powered?[{x:BLOCK.lift.x,y:liftY,w:BLOCK.lift.w,h:12,kind:'lift'}]:[])],solids:powered?[{...BLOCK.gate,kind:'shutter'}]:[]};}
export function newMischief({movementTrial=null,loopTrial=false}={}){if(loopTrial)movementTrial='double';movementTrial=['single','double'].includes(movementTrial)?movementTrial:null;const s=Object.assign(newRun(room(true,385,movementTrial)),{movementTrial},{phase:'sneak',jobId:JOB_ID,loot:[],items:Object.fromEntries(Object.entries(TREASURES).map(([id,t])=>[id,{...t,state:'world'}])),powered:true,liftY:385,pot:'ready',potTime:0,noise:[],noiseId:0,musicAt:0,action:null,actionTime:0,actionCooldown:0,requireRelease:false,alerted:false,catches:0,eventId:0,event:null,banked:false,caretaker:{x:1190,y:FLOOR-34,facing:1,mode:'patrol',suspicion:0,target:1510,lastSeen:null,search:0,heard:0,wait:0,visible:false,notice:0,roofWatch:false,walk:0,moving:false}});if(loopTrial){prepareLoop(s);s.room=loopRoom(s.room,s);}return s;}
function emit(s,type,text){s.event={id:++s.eventId,type,text};}
function noise(s,x,y,radius,kind){s.noise.push({id:++s.noiseId,x,y,radius,kind,time:s.time});s.noise=s.noise.slice(-8);}
export function lootValue(s){return s.loot.reduce((n,id)=>n+TREASURES[id].value,0);}
export function canSee(s){const g=s.caretaker,px=s.x+14,py=s.y+17,gx=g.x+14,gy=g.y+10,dx=px-gx,dy=py-gy;const facing=dx*g.facing>=-24;const distance=Math.hypot(dx,dy),range=g.mode==='chase'?400:300;
 if(!facing||distance>range||Math.abs(dy)>180)return false;
 // A solid shutter and the marked planter block vision. Upper roofs remain visible.
 for(const b of [...s.room.solids,BLOCK.cover]){for(let i=1;i<20;i++){const t=i/20,x=gx+dx*t,y=gy+dy*t;if(x>b.x&&x<b.x+b.w&&y>b.y&&y<b.y+b.h)return false;}}
 return true;
}
export function nearbyAction(s){
 if(s.x<190&&s.ground&&s.y+34===FLOOR&&s.loot.length&&(!s.loopTrial||s.loot.includes('sun')))return {id:'home',label:'Head home',detail:'Bank '+s.loot.length+' treasure'+(s.loot.length===1?'':'s')+' · or go back for more',hold:.45};
 const near=(x,y,r=62)=>Math.abs(s.x+14-x)<r&&Math.abs(s.y+34-y)<45;
 if(s.pot==='ready'&&near(BLOCK.pot.x,BLOCK.pot.y))return {id:'pot',label:'Knock the pot',detail:'A crash down below will draw the caretaker',hold:.12};
 if(s.items.battery.state==='carried'&&near(TREASURES.battery.x,TREASURES.battery.y,52))return {id:'restore',label:'Restore power',detail:'Give up the battery · restart lift · close gate',hold:.45};
 for(const id of ['music','sun','battery']){const item=s.items[id];if(item.state==='world'&&near(item.x,item.y))return {id,label:'Take '+item.name.toLowerCase(),detail:s.loopTrial&&id==='sun'?'Opens the street home. Upper gate closes after the bell.':id==='battery'?'Opens the street gate. Stops the lift.':id==='music'?'Worth 2. Plays until you drop it.':'Worth 3. The depot bell will ring.',hold:item.hold};}
 return null;
}
function take(s,id){const item=s.items[id];s.theftFX={id,x:item.x,y:item.y,time:.32};item.state='carried';s.loot.push(id);s.phase='escape';if(id==='battery'){s.powered=false;noise(s,item.x,item.y-20,520,'clank');emit(s,'steal','Battery taken. Street gate open; lift stopped.');}else if(id==='sun'){s.alerted=true;noise(s,item.x,item.y-20,1100,'bell');const changed=s.loopTrial&&ringLoopAlarm(s);emit(s,'alarm',changed?'Bell! Street home open. Drop below the upper shutter.':'The Sun is yours. The depot bell rang.');}else{item.playing=true;s.musicAt=s.time+.15;emit(s,'steal','Music box taken. Drop it to leave a noisy decoy.');}}
function perform(s,id){
 if(id==='home'){s.status='won';s.banked=true;emit(s,'win',s.loot.length===3?'Everything, and home in one piece.':'Home safe. You chose when to leave.');return;}
 if(id==='pot'){s.pot='falling';s.potTime=.42;emit(s,'pot','A little accident. Watch where the caretaker goes.');return;}
 if(id==='restore'){s.items.battery.state='world';s.items.battery.x=TREASURES.battery.x;s.items.battery.y=FLOOR;s.loot=s.loot.filter(id=>id!=='battery');s.powered=true;
 // Restoring from the socket is always left of the shutter, never traps the player inside it.
 emit(s,'power','Battery returned. Lift running; street gate closed.');return;}
 take(s,id);
}
function drop(s,requested=null){if(!s.loot.length)return;const id=requested&&s.loot.includes(requested)?requested:s.loot.includes('music')?'music':s.loot.at(-1),item=s.items[id];s.loot=s.loot.filter(v=>v!==id);item.state='world';item.x=Math.max(200,Math.min(BLOCK.width-70,s.x+14+s.facing*38));item.y=s.y+34;
 // Land on the nearest actual supporting top, so dropped loot remains recoverable.
 const tops=[FLOOR,...s.room.platforms.filter(p=>item.x>=p.x&&item.x<=p.x+p.w&&p.y>=s.y+25).map(p=>p.y)];item.y=Math.min(...tops);s.musicAt=s.time;emit(s,'drop',id==='music'?'Music box dropped. It will keep playing here.':item.name+' dropped. You can pick it up again.');}
// Predict only from a visible position/velocity. Never track the player through cover.
export function landingTarget(s){
 const height=Math.max(0,FLOOR-(s.y+34));
 const flight=Math.max(0,Math.min(.75,(-s.vy+Math.sqrt(s.vy*s.vy+3000*height))/1500));
 return Math.max(s.powered?640:260,Math.min(BLOCK.width-90,s.x+s.vx*flight));
}
function guardStep(s,dt){
 const g=s.caretaker,oldX=g.x;g.visible=canSee(s);g.notice=Math.max(0,(g.notice||0)-dt);
 const elevated=s.y+34<FLOOR-65;
 if(g.visible){
  g.suspicion=Math.min(1,g.suspicion+dt*(g.mode==='chase'?2:s.loopTrial&&s.loopAlarm?5:1.05));g.lastSeen=s.x;g.search=3.2;
  if(g.suspicion>=1&&g.mode!=='chase'){g.mode='chase';g.notice=s.loopTrial&&s.loopAlarm?.15:.55;emit(s,'spotted','Spotted! The caretaker is choosing an escape to block.');}
 }else g.suspicion=Math.max(0,g.suspicion-dt*.43);
 if(g.mode==='chase'){
  if(g.visible){
   g.roofWatch=elevated;
   // A visible airborne thief can be led; a lost thief cannot be tracked.
   g.target=elevated?landingTarget(s):s.x;
  }else{g.search-=dt;if(!g.roofWatch)g.target=g.lastSeen??g.x;if(g.search<=0){g.mode='search';g.wait=1.7;g.roofWatch=false;}}
  // A dropped music box can draw a searching pursuer away after sight is broken.
  const lure=s.noise.filter(n=>n.kind==='music'&&s.items.music.state==='world'&&n.id>g.heard&&s.time-n.time<1.5&&Math.hypot(g.x-n.x,g.y-n.y)<n.radius).at(-1);
  if(!g.visible&&g.search<2.6&&lure){g.heard=lure.id;g.mode='investigate';g.target=lure.x;g.wait=1.6;g.roofWatch=false;g.notice=.35;emit(s,'heard','He followed the music. Make your move.');}
 }else{
  const heard=s.noise.filter(n=>n.id>g.heard&&s.time-n.time<1.5&&Math.hypot(g.x-n.x,g.y-n.y)<n.radius).at(-1);
  if(heard&&!g.visible){g.heard=heard.id;g.mode='investigate';g.target=s.loopTrial&&heard.kind==='bell'?1000:heard.x;g.wait=s.loopTrial&&heard.kind==='bell'?3.2:1.6;g.notice=.35;g.roofWatch=false;emit(s,'heard','The caretaker heard '+(heard.kind==='music'?'the music.':heard.kind==='pot'?'the crash.':'a noise.'));}
 }
 if(g.mode==='patrol'&&Math.abs(g.x-g.target)<8){g.target=g.target===BLOCK.patrol.max?BLOCK.patrol.min:BLOCK.patrol.max;g.wait=.65;}
 if((g.mode==='investigate'||g.mode==='search')&&Math.abs(g.x-g.target)<10){if(s.loopTrial&&s.loopAlarm&&g.target===1000)g.facing=1;g.wait-=dt;if(g.wait<=0){g.mode='patrol';g.roofWatch=false;g.target=g.x<1100?BLOCK.patrol.max:BLOCK.patrol.min;}}
 const speed=g.mode==='chase'?202:g.mode==='investigate'?145:78,dx=g.target-g.x;
 if(g.notice>0){if(Math.abs(dx)>8)g.facing=Math.sign(dx);}
 else if(g.mode==='patrol'&&g.wait>0)g.wait-=dt;
 else if(Math.abs(dx)>8){g.facing=Math.sign(dx);g.x+=Math.sign(dx)*Math.min(Math.abs(dx),speed*dt);}
 g.x=Math.max(s.powered?620:240,Math.min(BLOCK.width-70,g.x));
 g.moving=Math.abs(g.x-oldX)>.001;g.walk=(g.walk||0)+Math.abs(g.x-oldX)/65*Math.PI*2;
 const close=Math.abs(s.x-g.x)<42&&Math.abs(s.y-g.y)<54;
 if(close&&g.mode==='chase'&&g.suspicion>.75&&g.notice===0){s.status='dead';s.deathReason='caught';s.catches++;emit(s,'caught','Caught with your paws full. Another route?');}
}

export function stepMischief(s,input={},dt=STEP){if(s.status!=='playing')return s;
 if(s.theftFX){s.theftFX.time=Math.max(0,s.theftFX.time-dt);if(s.theftFX.time===0)s.theftFX=null;}
 if(!input.interact)s.requireRelease=false;advanceLoop(s,dt);
 const wasLift=s.powered&&s.ground&&Math.abs(s.y+34-s.liftY)<.2&&s.x+28>BLOCK.lift.x&&s.x<BLOCK.lift.x+BLOCK.lift.w;
 const nextLift=320+65*Math.cos((s.time+dt)*1.15);if(s.powered){if(wasLift)s.y+=nextLift-s.liftY;s.liftY=nextLift;}s.room=loopRoom(room(s.powered,s.liftY,s.movementTrial),s);
 s.actionCooldown=Math.max(0,s.actionCooldown-dt);if(input.drop){drop(s,input.dropId);s.actionCooldown=.28;}
 const a=nearbyAction(s);if(input.interact&&!s.requireRelease&&a&&s.actionCooldown===0&&!input.jump&&!input.dash&&!input.down){if(s.action!==a.id){s.action=a.id;s.actionTime=0;const at=a.id==='pot'?BLOCK.pot.x:a.id==='restore'?TREASURES.battery.x:s.items[a.id]?.x;if(at!==undefined&&Math.abs(at-s.x-14)>6)s.facing=Math.sign(at-s.x-14);}s.actionTime+=dt;stepRun(s,{...input,left:false,right:false},dt);if(s.actionTime>=a.hold){perform(s,a.id);s.requireRelease=true;s.action=null;s.actionTime=0;s.actionCooldown=.3;}}
 else{s.action=null;s.actionTime=0;stepRun(s,input,dt);}
 if(s.status!=='playing')return s;
 if(s.pot==='falling'){s.potTime-=dt;if(s.potTime<=0){s.pot='broken';noise(s,970,FLOOR-10,800,'pot');}}
 const music=s.items.music;if(music.playing&&s.time>=s.musicAt){noise(s,music.state==='carried'?s.x+14:music.x,music.state==='carried'?s.y:music.y,630,'music');s.musicAt=s.time+1.6;}
 guardStep(s,dt);return s;
}
export function jobObjective(s){if(s.loopTrial)return loopObjective(s);if(s.status==='won')return 'HOME WITH '+s.loot.length+' / 3 TREASURES';if(s.loot.length)return s.x<210?'LEAVE SAFELY · OR GO BACK FOR MORE':'← HOME IS OPEN · ONE MORE THING?';return s.x<250?'ANY ONE TREASURE IS ENOUGH':'WATCH. DISTRACT. TAKE YOUR CHANCE.';}
