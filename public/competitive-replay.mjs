// Shared encoding only. The server derives the result from the simulation.
export const RULESET='chog-competition-v1';
export const MAX_TICKS=36000;
export const MISSIONS={heist:'The Sun Vault',annex:'The East Annex',lantern:'The Lantern Run'};
const keys=['left','right','jump','dash','interact','drop','down'],items=[null,'battery','sun','music'];
export function encodeCommand(c){return keys.reduce((n,k,i)=>n|(c[k]?1<<i:0),0)|(Math.max(0,items.indexOf(c.dropId))<<7);}
export function decodeCommand(n){return {...Object.fromEntries(keys.map((k,i)=>[k,!!(n&(1<<i))])),dropId:items[(n>>7)&3]};}
export function recorder(){const frames=[];let ticks=0,overflow=false;return {frames,get ticks(){return ticks;},get overflow(){return overflow;},push(c){if(++ticks>MAX_TICKS){overflow=true;return;}const mask=encodeCommand(c),last=frames.at(-1);if(last&&last[0]===mask)last[1]++;else if(frames.length>=4000)overflow=true;else frames.push([mask,1]);}};}
