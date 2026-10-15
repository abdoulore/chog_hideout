import {readHome,saveHomeName,keepsakes} from './home-model.mjs';
import {loadHomeArt,drawHomeScene} from './home-scene.mjs';
function browserStorage(){try{return globalThis.localStorage;}catch{return null;}}
export function mountHome({doc=globalThis.document,storage=browserStorage(),events=globalThis.window,location=globalThis.location,loadArt=loadHomeArt,raf=globalThis.requestAnimationFrame,reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false}={}){
 const $=id=>doc.getElementById(id),ctx=$('home-canvas').getContext('2d');let model=readHome(storage),images=null,stopped=false,last=0;
 const fmt=n=>n===null?'—':n.toFixed(2)+'s';
 function draw(time=0){if(images)drawHomeScene(ctx,images,model.records,{time,reducedMotion});}
 function render(){
  const r=model.records,items=keepsakes(r);$('home-name').textContent=model.name;doc.title=model.name+' · Chog Hideout';
  $('arrival').textContent=r.completed?'BACK WHERE YOU BELONG':'YOUR LITTLE CORNER OF TROUBLE';
  $('story-title').textContent=r.completed?'A little brighter.\nA little more yours.':'One empty hook.\nOne small job.';
  $('story-copy').textContent=r.completed?'The Pocket Sun is back on its hook. Keep your trophies close, and find a cleaner, quicker route through the Burrows.':'Someone put your afternoon light in a confiscation depot. Cross the roofs, recover the Pocket Sun, and find a different way home.';
  $('hook-caption').textContent=r.completed?'Your Pocket Sun':'An empty hook';
  $('scene-caption').textContent=r.completed?'Afternoon, back where it belongs.':'A little room for a little trouble.';
  $('start-heist').textContent=r.completed?'Return to the rooftops →':'Head to the rooftops →';
  $('clean-best').textContent=fmt(r.bestClean);$('escape-best').textContent=fmt(r.bestEscape);$('spark-best').textContent=r.bestSparks+' / 8';
  $('keepsake-count').textContent=items.filter(i=>i.earned).length+' of 3 keepsakes';
  for(const item of items){$('inspect-'+item.id).classList.toggle('earned',item.earned);$(item.id+'-hook').classList.toggle('earned',item.earned);$(item.id+'-earned').textContent=item.earned?'HOME':'TO EARN';}
  $('sun-state').textContent=r.completed?'The light is back on its hook.':'Bring the light home.';
  $('clean-state').textContent=r.bestClean!==null?'Your cleanest getaway: '+fmt(r.bestClean):'A whole heist, without a checkpoint.';
  $('sparks-state').textContent=r.bestSparks===8?'Every last one made it home.':'Most brought home: '+r.bestSparks+' / 8';
  $('home-canvas').setAttribute('aria-label',r.completed?'Your rooftop workshop. The Pocket Sun shines on its hook, with your earned keepsakes.':'Your rooftop workshop. The central Pocket Sun hook is empty.');
  $('return-note').hidden=!(r.completed&&new URLSearchParams(location?.search||'').get('returned')==='1');draw();
 }
 function open(id){const d=$(id);if(d.showModal)d.showModal();else d.setAttribute('open','');}
 function close(id){const d=$(id);if(d.close)d.close();else d.removeAttribute('open');}
 function inspect(id){const item=keepsakes(model.records).find(i=>i.id===id);$('detail-title').textContent=item.name;$('detail-status').textContent=item.earned?'A PLACE ON YOUR SHELF':'A LITTLE SOMETHING TO EARN';$('detail-copy').textContent=item.earned?item.story:item.rule;$('detail-play').textContent=item.earned?'Return to the rooftops →':'Head to the rooftops →';open('keepsake-dialog');}
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
