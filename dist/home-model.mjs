import {readRecords} from './heist-records.mjs';
export const HOME_KEY='chog-home:v1',DEFAULT_NAME='The Lantern Loft';
export function normaliseName(value){return typeof value==='string'?Array.from(value.replace(/\s+/g,' ').trim()).slice(0,32).join('')||DEFAULT_NAME:DEFAULT_NAME;}
export function readHome(storage){let name=DEFAULT_NAME;try{const data=JSON.parse(storage.getItem(HOME_KEY));if(data?.version===1)name=normaliseName(data.name);}catch{}return {name,records:readRecords(storage)};}
export function saveHomeName(storage,name){const clean=normaliseName(name);try{storage.setItem(HOME_KEY,JSON.stringify({version:1,name:clean}));return {name:clean,saved:true};}catch{return {name:clean,saved:false};}}
export function keepsakes(records){return [
 {id:'sun',name:'The Pocket Sun',earned:records.completed,rule:'Bring the Pocket Sun home.',story:'Afternoon light, bottled badly. Back where it belongs.'},
 {id:'clean',name:'A Clean Getaway',earned:records.completed&&records.bestClean!==null,rule:'Finish the whole heist without using the vault checkpoint.',story:'In, out, and not a tile out of place. Almost.'},
 {id:'sparks',name:'Every Last Spark',earned:records.completed&&records.bestSparks===8,rule:'Reach home with all eight sparks in one completed attempt.',story:'Even the little pieces of afternoon made it home.'}
];}
