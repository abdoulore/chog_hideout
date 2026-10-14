import {STEP} from './engine.mjs';
import {cameraBiasFor} from './scene-layout.mjs';
import {newHeist,stepHeist,retryEscape,missionProgress,missionObjective} from './heist.mjs';
import {readRecords,recordFinish,writeRecords,emptyRecords} from './heist-records.mjs';
import {loadArt,drawWorld} from './world-renderer.mjs';
import {createFeedback,snapshot} from './feedback.mjs';
import {createSound} from './sound.mjs';
const $=id=>document.getElementById(id),canvas=$('canvas'),ctx=canvas.getContext('2d');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const feedback=createFeedback({reducedMotion}),sound=createSound();
let run=newHeist(),previous=snapshot(run),images=null,started=false,paused=false,input={},acc=0,last=0,finishDelay=null,noticeTime=0,cameraBias=.28,recordSaved=true;
let records;try{records=readRecords(localStorage);}catch{records=emptyRecords();}
function recordsLine(){const fmt=n=>n===null?'—':`${n.toFixed(2)}s`;$('records').textContent=`Local best · Clean heist ${fmt(records.bestClean)} · Escape ${fmt(records.bestEscape)}`;}
recordsLine();
try{sound.setMuted(localStorage.getItem('chog-sound-muted')==='true');}catch{}
function soundLabel(){const off=sound.muted;$('sound').textContent=off?'♫̸':'♪';$('sound').setAttribute('aria-pressed',String(off));$('sound').setAttribute('aria-label',off?'Unmute sound':'Mute sound');$('sound').title=off?'Sound off':'Sound on';}
soundLabel();
async function unlockSound(){const ok=await sound.unlock();if(!ok){$('sound').disabled=true;$('sound').title='Sound unavailable in this browser';$('sound').setAttribute('aria-label','Sound unavailable');}}
const resetInput=()=>input={left:false,right:false,jump:false,dash:false};resetInput();
function fit(){const box=$('screen').getBoundingClientRect();canvas.width=900;canvas.height=Math.max(430,Math.min(1900,Math.round(900*box.height/Math.max(box.width,1))));cameraBias=cameraBiasFor(run.phase,box.width,canvas.width,canvas.height);}
fit();window.addEventListener('resize',fit);
function show(kicker,title,message,button){document.body.classList.toggle('playing',false);$('kicker').textContent=kicker;$('title').textContent=title;$('message').textContent=message;$('play').textContent=button;$('overlay').hidden=false;$('pause-actions').hidden=!paused;}
function begin(next){if(!images)return;run=next;previous=snapshot(run);feedback.reset();finishDelay=null;noticeTime=0;recordSaved=true;cameraBias=cameraBiasFor(run.phase,canvas.getBoundingClientRect().width,canvas.width,canvas.height);started=true;document.body.classList.toggle('playing',true);paused=false;acc=0;resetInput();document.body.classList.toggle('playing',true);void unlockSound();$('overlay').hidden=true;$('notice').hidden=true;$('whole-run').hidden=true;$('practice').hidden=true;$('pause').textContent='Ⅱ';canvas.focus({preventScroll:true});}
function start(){begin(newHeist());}
function retry(){begin(run.status==='dead'&&run.checkpoint?retryEscape(run):newHeist());}
function pause(){if(!started||run.status!=='playing'||paused)return;paused=true;resetInput();sound.pause();show('TAKE A BREATHER','Your rooftop can wait.','Resume your run, or take another route from the start.','Keep going →');}
function resume(){if(!started||run.status!=='playing'){start();return;}paused=false;acc=0;resetInput();document.body.classList.toggle('playing',true);void unlockSound();$('overlay').hidden=true;$('pause-actions').hidden=true;canvas.focus({preventScroll:true});}
function finish(){
 if(run.status==='won'){
  recordsLine();
  show(run.clean?'A CLEAN HEIST':'PRACTICE ESCAPE COMPLETE','Home, a little brighter.',`${run.coins} of ${run.room.orbs.length} sparks · ${run.clean?run.time.toFixed(2)+'s full heist':run.escapeTime.toFixed(2)+'s escape'}. The Pocket Sun is back where it belongs.`,run.clean?'Beat your time →':'Try a clean heist →');
  if(!recordSaved)$('records').textContent+=' · Saving unavailable';$('practice').hidden=false;
 }else{
  show(run.checkpoint?'THE SUN IS STILL WITH YOU':'A LITTLE SETBACK',run.deathReason==='gap'?'Mind the landing.':'Nearly had it.',run.checkpoint?'Retry from the vault with the Sun. For a clean record, restart the whole heist.':'Watch the next trap. Your next attempt begins at home.',run.checkpoint?'Retry escape →':'Try again →');$('whole-run').hidden=!run.checkpoint;
 }
}
function hud(){$('objective').textContent=missionObjective(run);$('time').textContent=`${(run.clean?run.time:run.escapeTime).toFixed(2)}s · ${run.clean?'HEIST':'PRACTICE ESCAPE'}`;$('gem-count').textContent=`${run.coins} / ${run.room.orbs.length}`;$('distance').value=missionProgress(run);$('distance').setAttribute('aria-label',run.phase==='entry'?'Journey to the Pocket Sun':'Journey home');$('dash-status').textContent=run.dashCooldown>0?`${run.dashCooldown.toFixed(1)}s`:'DASH';$('dash').classList.toggle('cooling',run.dashCooldown>0);}
function frame(t){
 const dt=Math.min((t-last)/1000||0,.05);last=t;
 if(images&&started&&!paused&&!document.hidden){
  feedback.update(dt);cameraBias+=( cameraBiasFor(run.phase,canvas.getBoundingClientRect().width,canvas.width,canvas.height)-cameraBias)*Math.min(1,dt*4);if(noticeTime>0){noticeTime-=dt;if(noticeTime<=0)$('notice').hidden=true;}
  if(finishDelay!==null){finishDelay-=dt;if(finishDelay<=0){finishDelay=null;finish();}}
  if(run.status==='playing'){
   acc+=dt;
   while(acc>=STEP){previous=snapshot(run);stepHeist(run,input);if(previous.phase==='entry'&&run.phase==='escape'){$('notice').textContent='The depot woke up. Bring the Pocket Sun home ←';$('notice').hidden=false;noticeTime=3;}for(const event of feedback.observe(previous,run))sound.play(event);input.jump=false;input.dash=false;acc-=STEP;
    if(run.status!=='playing'){if(run.status==='won'){records=recordFinish(records,run);recordSaved=false;try{recordSaved=writeRecords(localStorage,records);}catch{}}resetInput();finishDelay=run.status==='won'?.65:.3;acc=0;break;}
   }
  }
 }
 hud();
 if(images){const alpha=acc/STEP,present=run.status==='playing'&&!paused?{...run,x:previous.x+(run.x-previous.x)*alpha,y:previous.y+(run.y-previous.y)*alpha}:run;drawWorld(ctx,{...present,cameraBias},images,canvas.width,canvas.height,{displayWidth:canvas.getBoundingClientRect().width,reducedMotion,feedback:feedback.state});}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
$('sound').onclick=()=>{sound.setMuted(!sound.muted);soundLabel();try{localStorage.setItem('chog-sound-muted',String(sound.muted));}catch{}if(started&&!paused&&run.status==='playing')void unlockSound();};
$('play').onclick=()=>paused?resume():run.status==='dead'?retry():start();$('whole-run').onclick=start;$('practice').onclick=()=>begin(retryEscape(run));$('retry').onclick=start;$('pause').onclick=()=>paused?resume():pause();
$('focus').onclick=async()=>{document.body.classList.toggle('focus');$('focus').textContent=document.body.classList.contains('focus')?'⛶ Standard view':'⛶ Expand game';try{if(!document.fullscreenElement)await $('screen').requestFullscreen?.();else await document.exitFullscreen?.();}catch{}fit();};
for(const [id,key] of [['left','left'],['right','right'],['jump','jump'],['dash','dash']]){const b=$(id);b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(!started||paused||run.status!=='playing')return;input[key]=true;};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>{if(key==='left'||key==='right')input[key]=false;};}
window.addEventListener('keydown',e=>{if(['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' ','a','d','w','x','shift','r','escape'].includes(k))e.preventDefault();if(k==='escape'){paused?resume():pause();return;}if(k==='r'&&!e.repeat){start();return;}if(!started||paused||run.status!=='playing')return;if(k==='a'||k==='arrowleft')input.left=true;if(k==='d'||k==='arrowright')input.right=true;if([' ','w','arrowup'].includes(k)&&!e.repeat)input.jump=true;if(['shift','x'].includes(k)&&!e.repeat)input.dash=true;});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')input.left=false;if(k==='d'||k==='arrowright')input.right=false;});
window.addEventListener('blur',()=>{sound.pause();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){sound.pause();pause();}});
loadArt().then(result=>{images=result;$('play').disabled=false;show('THE MISSING LIGHT / FIRST HEIST','Borrowed Sunshine.','That light belongs in your window. Recover the Pocket Sun, then find your way home.','Bring it home →');}).catch(()=>{$('asset-error').hidden=false;$('title').textContent='The rooftops need a moment.';$('message').textContent='Please refresh to load the artwork again.';$('play').textContent='Artwork unavailable';});
