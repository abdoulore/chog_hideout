export const LANTERN_EXIT={x:5200,y:460};
export const EXIT_SOCKET={x:5160,y:310};
export const LANTERN_PLATFORMS=[{x:3850,y:385,w:240,h:12},{x:4100,y:310,w:180,h:12},{x:4340,y:245,w:180,h:12},{x:4580,y:310,w:180,h:12},{x:4700,y:235,w:100,h:12},{x:4820,y:385,w:180,h:12},{x:5060,y:310,w:220,h:12}];
export const LANTERN_VENTS=[{x:4180,w:100,offset:.5},{x:4560,w:100,offset:2},{x:4940,w:100,offset:3.1}];
export function prepareLantern(s){s.lanternMission=true;s.jobId='lantern-run-v1';s.x=3920;s.y=351;s.ground=true;s.vaultOpen=true;s.powered=false;Object.assign(s.items.sun,{x:4000,y:385,state:'world'});Object.assign(s.items.battery,{x:4440,y:245,state:'world'});Object.assign(s.items.music,{x:4750,y:235,state:'world'});}
export function lanternAction(s){if(!s.powerRestored&&s.loot.includes('battery')&&Math.abs(s.x+14-EXIT_SOCKET.x)<58&&Math.abs(s.y+34-EXIT_SOCKET.y)<45)return {id:'power-exit',label:'Power the exit',detail:'Install the cell to open the extraction door below.',hold:.65};return null;}
export function powerExit(s){s.items.battery.state='installed';s.loot=s.loot.filter(id=>id!=='battery');s.powerRestored=true;return 'Exit powered. Drop to the marked door below and bring the Sun out.';}
