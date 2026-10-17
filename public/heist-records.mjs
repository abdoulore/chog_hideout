import {MISSION_ID} from './heist.mjs';
export const RECORD_KEY='chog-heist:'+MISSION_ID;
export const emptyRecords=()=>({version:MISSION_ID,completed:false,bestClean:null,bestEscape:null,bestSparks:0});
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>0;
export function readRecords(storage){try{const r=JSON.parse(storage.getItem(RECORD_KEY));if(r?.version!==MISSION_ID)return emptyRecords();return {version:MISSION_ID,completed:r.completed===true,bestClean:valid(r.bestClean)?r.bestClean:null,bestEscape:valid(r.bestEscape)?r.bestEscape:null,bestSparks:Number.isInteger(r.bestSparks)&&r.bestSparks>=0&&r.bestSparks<=8?r.bestSparks:0};}catch{return emptyRecords();}}
export function recordFinish(records,run){
 if(run.status!=='won'||!run.hasSun||run.phase!=='escape'||!valid(run.time)||!valid(run.escapeTime))return {...records};
 const min=(old,value)=>valid(old)?Math.min(old,value):value;
 return {...records,completed:true,bestClean:run.clean?min(records.bestClean,run.time):records.bestClean,bestEscape:min(records.bestEscape,run.escapeTime),bestSparks:Math.max(records.bestSparks||0,Number.isInteger(run.coins)&&run.coins>=0&&run.coins<=8?run.coins:0)};
}
export function writeRecords(storage,records){try{storage.setItem(RECORD_KEY,JSON.stringify(records));return true;}catch{return false;}}
