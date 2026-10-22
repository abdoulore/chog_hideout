import {newMischief,stepMischief,lootValue} from '../public/mischief.mjs';
import {MAX_TICKS,MISSIONS,decodeCommand} from '../public/competitive-replay.mjs';
export function verifyReplay(mission,frames){
 if(!Object.hasOwn(MISSIONS,mission)||!Array.isArray(frames)||!frames.length||frames.length>4000)throw Error('Invalid replay.');
 let count=0;for(const pair of frames){if(!Array.isArray(pair)||pair.length!==2||!Number.isInteger(pair[0])||pair[0]<0||pair[0]>511||!Number.isInteger(pair[1])||pair[1]<1)throw Error('Invalid replay input.');count+=pair[1];if(count>MAX_TICKS)throw Error('Attempt exceeds five minutes of gameplay.');}
 const s=newMischief({vaultMission:true,annexMission:mission==='annex',lanternMission:mission==='lantern'});let ticks=0;
 for(const [mask,n] of frames)for(let i=0;i<n;i++){if(s.status!=='playing')throw Error('Replay continues after the attempt ended.');stepMischief(s,decodeCommand(mask));ticks++;}
 if(s.status!=='won'||!s.banked||!s.loot.includes('sun'))throw Error('This replay does not complete the mission.');
 return {ticks,haul:lootValue(s)};
}
