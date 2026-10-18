// Deliberately memory-only: playtest times are not competitive records.
export function createLoopMastery(){
 const best={sun:null,full:null};let lastRun=null,lastResult=null;
 const seconds=t=>(t/120).toFixed(2)+'s';
 return {
  summary(){return `Sun only: ${best.sun===null?'set your first time':seconds(best.sun)} · Sun + music: ${best.full===null?'bring both home':seconds(best.full)}`;},
  next(){return best.sun===null?'Next goal: bring the Sun home.':best.full===null?'Next goal: escape with the Sun and music box.':'Next goal: beat either time with the same haul.';},
  finish(run){
   if(run===lastRun)return lastResult;
   if(run.status!=='won'||!run.loot.includes('sun')||!Number.isFinite(run.time)||run.time<=0)return null;
   const category=run.loot.includes('music')?'full':'sun',ticks=Math.round(run.time*120),before=best[category];
   const message=before===null?'First time set.':ticks<before?`${seconds(before-ticks)} faster — new session best.`:ticks===before?'Matched your session best.':`${seconds(ticks-before)} behind your session best.`;
   best[category]=before===null?ticks:Math.min(before,ticks);lastRun=run;
   return lastResult={category,time:seconds(ticks),message};
  }
 };
}
