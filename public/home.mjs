import {readCampaign,VAULT_URL,ANNEX_URL} from './campaign.mjs';
import {TREASURES} from './mischief.mjs';
import {readHome,saveHomeName,keepsakes} from './home-model.mjs';
import {loadHomeArt,drawHomeScene} from './home-scene.mjs';
function browserStorage(){try{return globalThis.localStorage;}catch{return null;}}
export function mountHome({doc=globalThis.document,storage=browserStorage(),events=globalThis.window,location=globalThis.location,loadArt=loadHomeArt,raf=globalThis.requestAnimationFrame,reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false}={}){
 const $=id=>doc.getElementById(id),ctx=$('home-canvas').getContext('2d');let model=readHome(storage),images=null,stopped=false,last=0;
 const fmt=n=>n===null?'—':n.toFixed(2)+'s';
 function draw(time=0){if(images)drawHomeScene(ctx,images,{...model.records,completed:model.records.completed||model.job.treasures.includes('sun'),job:model.job},{time,reducedMotion});}
 function render(){
  const r=model.records,job=model.job,hasSun=r.completed||job.treasures.includes('sun'),items=keepsakes(r,job);$('home-name').textContent=model.name;doc.title=model.name+' · Chog Hideout';
  $('arrival').textContent=job.escapes||r.completed?'BACK WHERE YOU BELONG':'YOUR LITTLE CORNER OF TROUBLE';
  $('story-title').textContent=job.escapes?'One more thing.\nOne more story.':'A little room.\nA little trouble.';
  $('story-copy').textContent=job.escapes?'You made it home with '+job.lastHaul.map(id=>TREASURES[id].name.toLowerCase()).join(' and ')+'. The caretaker will be looking. There is always one more thing.':'A caretaker, three temptations, and two ways through the block. Take something and come home. Only you decide when you have enough.';
  $('hook-caption').textContent=hasSun?'Your Pocket Sun':'An empty hook';
  $('scene-caption').textContent=hasSun?'Afternoon, back where it belongs.':'A little room for a little trouble.';
  const campaign=readCampaign(storage);$('start-heist').textContent=campaign.vault?(campaign.annex?'Replay The East Annex →':'Continue · The East Annex →'):'Start Mission 01 · The Sun Vault →';$('start-heist').href=campaign.vault?ANNEX_URL:VAULT_URL;if(!job.escapes){$('story-title').textContent=campaign.annex?'Two jobs. One way home.':campaign.vault?'The east wing awaits.':'Your first rooftop job.';$('story-copy').textContent=campaign.annex?'Both missions complete. Return for the optional music box, or find a faster escape.':campaign.vault?'The Sun Vault is behind you. Enter the East Annex from its rooftop entrance and bring the next Sun to the extraction door.':'Recover the power cell, open the Sun Vault and bring its light home. Finish the job to unlock the East Annex.';}$('replay-vault').hidden=!campaign.vault;$('annex-link').hidden=!campaign.vault;$('campaign-status').textContent=campaign.annex?'2 / 2 missions complete · Replay either mission':campaign.vault?'1 / 2 complete · The East Annex unlocked':'Mission 01 ready · Finish it to unlock the East Annex';
  $('job-best').textContent=job.bestValue+' / 6';$('job-escapes').textContent=String(job.escapes);$('job-time').textContent=job.bestTime===null?'—':job.bestTime.toFixed(1)+'s';
  for(const id of ['battery','sun','music']){$('haul-'+id).classList.toggle('earned',job.treasures.includes(id));$('haul-'+id+'-state').textContent=job.treasures.includes(id)?'BROUGHT HOME':'STILL OUT THERE';}
  $('clean-best').textContent=fmt(r.bestClean);$('escape-best').textContent=fmt(r.bestEscape);$('spark-best').textContent=r.bestSparks+' / 8';
  $('keepsake-count').textContent=items.filter(i=>i.earned).length+' of 3 keepsakes';
  for(const item of items){$('inspect-'+item.id).classList.toggle('earned',item.earned);$(item.id+'-hook').classList.toggle('earned',item.earned);$(item.id+'-earned').textContent=item.earned?'HOME':'TO EARN';}
  $('sun-state').textContent=hasSun?'The light is back on its hook.':'Bring the light home.';
  $('clean-state').textContent=r.bestClean!==null?'Your cleanest getaway: '+fmt(r.bestClean):'A whole heist, without a checkpoint.';
  $('sparks-state').textContent=r.bestSparks===8?'Every last one made it home.':'Most brought home: '+r.bestSparks+' / 8';
  $('home-canvas').setAttribute('aria-label',hasSun?'Your rooftop workshop. The Pocket Sun shines on its hook, with your earned keepsakes.':'Your rooftop workshop. The central Pocket Sun hook is empty.');
  $('return-note').hidden=!((r.completed||job.escapes>0)&&new URLSearchParams(location?.search||'').get('returned')==='1');draw();
 }
 function open(id){const d=$(id);if(d.showModal)d.showModal();else d.setAttribute('open','');}
 function close(id){const d=$(id);if(d.close)d.close();else d.removeAttribute('open');}
 function inspect(id){const item=keepsakes(model.records,model.job).find(i=>i.id===id);$('detail-title').textContent=item.name;$('detail-status').textContent=item.earned?'A PLACE ON YOUR SHELF':'A LITTLE SOMETHING TO EARN';$('detail-copy').textContent=item.earned?item.story:item.rule;$('detail-play').href=id==='sun'?'mischief.html':'play.html';$('detail-play').textContent=item.earned?'Return to the rooftops →':'Head to the rooftops →';open('keepsake-dialog');}
 for(const id of ['sun','clean','sparks']){$(id+'-hook').onclick=()=>inspect(id);$('inspect-'+id).onclick=()=>inspect(id);}
 $('close-detail').onclick=()=>close('keepsake-dialog');$('close-rename').onclick=()=>close('rename-dialog');
 $('rename').onclick=()=>{$('name-input').value=model.name;open('rename-dialog');$('name-input').focus();};
 $('rename-form').onsubmit=e=>{e.preventDefault();const result=saveHomeName(storage,$('name-input').value);model.name=result.name;render();$('save-note').textContent=result.saved?'Guest hideout · Saved on this browser':'Changes will last for this visit. Browser saving is unavailable.';close('rename-dialog');};
 function refresh(){model=readHome(storage);render();}
 function frame(t){if(stopped)return;if(t-last>=40&&!doc.hidden){last=t;draw(t/1000);}raf?.(frame);}
 render();events?.addEventListener('storage',refresh);events?.addEventListener('pageshow',refresh);
 const ready=loadArt().then(result=>{if(stopped)return;images=result;draw();if(!reducedMotion)raf?.(frame);}).catch(()=>{$('art-error').hidden=false;});
 return {ready,refresh,destroy(){stopped=true;events?.removeEventListener?.('storage',refresh);events?.removeEventListener?.('pageshow',refresh);}};
}
if(typeof document!=='undefined')mountHome();
