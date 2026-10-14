// Original synthesized effects: no network audio, autoplay, or third-party files.
export function createSound({getContext=()=>{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;return Audio?new Audio():null;}}={}){
 let ctx=null,master=null,muted=false,active=false,available=true,suspendTask=Promise.resolve();const voices=new Set();let sparkle=0;
 function silence(){for(const node of voices){try{node.stop();}catch{}}voices.clear();}
 function gain(){if(master&&ctx)master.gain.setTargetAtTime(muted||!active?0:.38,ctx.currentTime,.015);}
 function tone(freq,at,duration,volume=.2,type='sine',end=freq){
  if(!ctx||!master)return;const osc=ctx.createOscillator(),amp=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+.008);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(amp);amp.connect(master);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();amp.disconnect();};osc.start(at);osc.stop(at+duration+.02);
 }
 function noise(duration,volume,cutoff){const count=Math.ceil(ctx.sampleRate*duration),buffer=ctx.createBuffer(1,count,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<count;i++)data[i]=(Math.random()*2-1)*(1-i/count);const node=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),amp=ctx.createGain();node.buffer=buffer;filter.type='lowpass';filter.frequency.value=cutoff;amp.gain.value=volume;node.connect(filter);filter.connect(amp);amp.connect(master);voices.add(node);node.onended=()=>{voices.delete(node);node.disconnect();filter.disconnect();amp.disconnect();};node.start();node.stop(ctx.currentTime+duration);}
 return {
  get muted(){return muted;},get available(){return available;},
  async unlock(){active=true;try{if(!ctx){ctx=getContext();if(!ctx){available=false;return false;}master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);}await suspendTask;if(!active)return true;if(ctx.state==='suspended')await ctx.resume();gain();return true;}catch{available=false;return false;}},
  setMuted(value){muted=!!value;if(muted)silence();gain();},
  pause(){active=false;silence();gain();if(ctx?.state==='running')suspendTask=Promise.resolve(ctx.suspend?.()).catch(()=>{});},
  play(event){if(!ctx||!available||muted||!active||ctx.state!=='running')return;const t=ctx.currentTime;
   if(event==='step')noise(.045,.055,650);
   if(event==='jump'){tone(240,t,.13,.12,'sine',540);noise(.08,.035,1400);}
   if(event==='land'){noise(.09,.12,750);tone(115,t,.07,.07,'sine',75);}
   if(event==='dash'){noise(.18,.18,2400);tone(420,t,.16,.065,'triangle',140);}
   if(event==='spark'){const notes=[784,988,1175,1568],note=notes[sparkle++%notes.length];tone(note,t,.22,.16);tone(note*1.5,t+.04,.26,.055);}
   if(event==='pickup')[392,523.25,783.99].forEach((f,i)=>tone(f,t+i*.085,.35,.13));
   if(event==='hurt'){tone(180,t,.2,.15,'triangle',65);noise(.14,.12,950);}
   if(event==='win')[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.095,.5,.15));
  }
 };
}
