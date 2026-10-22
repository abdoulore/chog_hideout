import {missionRelays,missionVents,ventState,POWER_SOCKET,VAULT_SOCKET,VAULT_DOOR,guideVaultTarget} from '../vault-mission.mjs';
import {loopGate} from '../loop-escape.mjs';
import {spikeBounds} from '../engine.mjs';
export function vaultCues(s){return {source:s.powerRestored?'LIFT RESTORED':s.loot.includes('battery')?(s.loopAlarm?'RESTORE LIFT':'CELL TAKEN'):'LIFT SOURCE',destination:!s.vaultOpen?'INSTALL CELL':s.items.battery.state==='vault'?(s.loopAlarm?'RETRIEVE CELL':'CELL INSTALLED'):'CELL REMOVED',door:!s.vaultOpen?'VAULT LOCKED':s.loopGateClosed?'CLOSED · EXIT BELOW':s.loopAlarm?'CLOSING · DROP BELOW':'VAULT OPEN'};}
export function drawPixelVault(c,s,im,{rect,spr,label,reducedMotion}){
 const cues=vaultCues(s);if(s.lanternMission){rect(5139,273,42,37,'#bb8547');rect(5146,280,28,28,'#403045');if(s.powerRestored)spr('battery',5160-im.battery.width/2,304-im.battery.height);else rect(5155,285,10,16,'#ffe3a4');if(Math.abs(s.x-5160)<270)label(s.powerRestored?'EXIT POWERED':'INSTALL EXIT CELL',5160,260,s.powerRestored?'#b9e3c0':'#ffe3a4');}
 // Socket shapes differ: the lift source is a low cradle; the vault is a tall brass receptacle.
 const source=POWER_SOCKET,dest=VAULT_SOCKET;
 rect(source.x-20,source.y-10,40,10,'#32263b');rect(source.x-18,source.y-9,36,2,'#8c9fa1');
 for(const x of [source.x-17,source.x+14])rect(x,source.y-24,3,16,'#8c9fa1');
 rect(source.x+22,source.y-12,4,4,s.powered?'#b9e3c0':'#746675');
 if(s.powerRestored)spr('battery',source.x-im.battery.width/2,source.y-im.battery.height);
 if(Math.abs(s.x-source.x)<230){label(cues.source,source.x,source.y-38,s.powerRestored?'#b9e3c0':'#c6d4d5');if(s.loot.includes('battery')&&!s.loopAlarm)label('VAULT SOCKET →',source.x,source.y-54);}
 rect(dest.x-21,dest.y-37,42,37,'#251b30');rect(dest.x-19,dest.y-35,38,33,'#bb8547');rect(dest.x-14,dest.y-30,28,28,'#403045');
 for(const x of [dest.x-11,dest.x+8])rect(x,dest.y-27,3,9,'#ffe5a5');
 if(s.items.battery.state==='vault')spr('battery',dest.x-im.battery.width/2,dest.y-6-im.battery.height);
 else {rect(dest.x-5,dest.y-24,10,16,'#e6bb7555');rect(dest.x-3,dest.y-26,6,2,'#e6bb75');}
 if(Math.abs(s.x-dest.x)<240)label(!s.vaultOpen&&!s.loot.includes('battery')?'BRING CELL HERE':cues.destination,dest.x,dest.y-49);
 for(const relay of missionRelays(s)){const done=s.relays.includes(relay.id),color=done?'#b9e3c0':'#f2c071';rect(relay.x-16,relay.y-34,32,34,'#251b30');rect(relay.x-14,relay.y-32,28,30,'#705044');rect(relay.x-11,relay.y-28,22,23,'#302333');rect(relay.x-2,relay.y-25,4,18,color);rect(relay.x-8,relay.y-(done?10:24),16,4,color);if(Math.abs(s.x-relay.x)<260)label(done?'SEAL RELEASED':relay.name.toUpperCase(),relay.x,relay.y-45,color);}
 const gate=!s.vaultOpen?VAULT_DOOR:loopGate(s),closed=!s.vaultOpen||s.loopGateClosed;
 rect(gate.x-4,gate.y-4,gate.w+8,4,'#c99e63');rect(gate.x-4,gate.y,4,gate.h,'#69494d');rect(gate.x+gate.w,gate.y,4,gate.h,'#69494d');
 if(closed){c.save();c.beginPath();c.rect(gate.x,gate.y,gate.w,gate.h);c.clip();for(let y=gate.y;y<gate.y+gate.h;y+=im.shutter.height)for(let x=gate.x;x<gate.x+gate.w;x+=im.shutter.width)spr('shutter',x,y);c.restore();}else{rect(gate.x,gate.y,gate.w,8,'#bd915b');if(s.loopAlarm){for(let y=gate.y+16;y<gate.y+gate.h;y+=12)rect(gate.x+gate.w/2-1,y,2,6,'#ffbd81');}}
 if(Math.abs(s.x-gate.x)<260)label(cues.door,gate.x+17,260,s.loopAlarm?'#ffb59e':'#ffe3a4');
 for(const vent of missionVents(s)){const state=ventState(s.time,vent),active=state.phase==='active',warning=state.phase==='warning',color=active?'#fff0d0':warning?'#ffbf69':'#96baa6';
 rect(vent.x,450,vent.w,10,'#251b30');for(let x=vent.x+4;x<vent.x+vent.w;x+=10){rect(x,452,5,6,'#8e7978');rect(x,451,5,1,color);}
 if(active){rect(vent.x,350,vent.w,100,'#fbe6c028');for(let band=0;band<7;band++){const rise=reducedMotion?0:Math.floor(s.time*28)%15,y=450-band*14-rise,w=Math.min(vent.w,54+band*8),x=vent.x+(vent.w-w)/2;rect(x,Math.max(350,y),w,Math.min(12,460-Math.max(350,y)),band%2?'#fff2d887':'#eadcc777');rect(x+4,Math.max(350,y-3),w-8,4,'#fff5df66');}rect(vent.x,350,6,2,'#ffe3ac');rect(vent.x+vent.w-6,350,6,2,'#ffe3ac');}
 else if(warning){for(let x=vent.x+3;x<vent.x+vent.w;x+=12)rect(x,440,6,6,color);}
 if(Math.abs(s.x-(vent.x+vent.w/2))<300)label(active?'STEAM · WAIT':warning?'! STEAM IN '+state.remaining.toFixed(1)+'s':'CLEAR · '+state.remaining.toFixed(1)+'s',vent.x+vent.w/2,active?338:432,color);
 }
 // Trap teeth match spikeBounds exactly. The coral warning is separate from gold loot.
 for(const slot of s.room.spikes){const b=spikeBounds(slot),mid=b.x+b.w/2;rect(b.x-4,459,b.w+8,5,'#23182e');for(let x=b.x;x<b.x+b.w;x+=10){c.fillStyle='#f1dfcc';c.beginPath();c.moveTo(x,460);c.lineTo(x+5,b.y);c.lineTo(Math.min(x+10,b.x+b.w),460);c.fill();}rect(mid-7,b.y-24,14,16,'#2c1b32');rect(mid-5,b.y-22,10,12,'#ffb49e');rect(mid-1,b.y-20,2,6,'#402638');rect(mid-1,b.y-12,2,2,'#402638');}
 if(s.loopAlarm&&s.x>2300)label(s.lanternMission?'EXIT →':s.annexMission?'← ANNEX EXIT':'← STREET EXIT',Math.round(s.x+14),440,'#b9e3c0');
 if(!s.loopAlarm&&s.x>3650&&s.relays.length<missionRelays(s).length){const missing=missionRelays(s).find(r=>!s.relays.includes(r.id));label(guideVaultTarget(s,missing,missing.name.toUpperCase()),s.items.sun.x,270);}
}
