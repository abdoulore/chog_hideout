import {COLLECTION,CHAIN_ID,ORIGIN,canonicalAddress,walletMessage,makeChain} from './chain.mjs';
const FIVE_MIN=300_000,DAY=86_400_000;
class Problem extends Error{constructor(status,message){super(message);this.status=status;}}
const fail=(status,message)=>{throw new Problem(status,message);};
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');
async function hash(s){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
function text(value,min,max,label){if(typeof value!=='string')fail(400,`${label} is required.`);const s=value.trim().normalize('NFKC');if(s.length<min||s.length>max||/[\p{Cc}\p{Cf}<>]/u.test(s))fail(400,`${label} must be ${min}–${max} characters without control characters or angle brackets.`);return s;}
function token(value){if(typeof value!=='string'||! /^(0|[1-9][0-9]{0,77})$/.test(value)||BigInt(value)>=2n**256n)fail(400,'Enter the on-chain token ID, not the artwork number.');return value;}
function address(value){try{return canonicalAddress(value);}catch{fail(400,'Choose a valid Ethereum wallet address.');}}
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
export function createGuildApi({db,chain=makeChain(),clock=Date.now,origin=ORIGIN}){
 const stmt=(sql,...args)=>db.prepare(sql).bind(...args),one=(sql,...args)=>stmt(sql,...args).first();
 async function owner(g){try{return await chain.ownerOf(g.token_id);}catch{fail(503,'Monad ownership could not be checked. Please try again. No permission was granted.');}}
 async function rate(user,kind,max){const now=clock(),key=user+':'+kind;const row=await one('INSERT INTO guild_rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<=? THEN ? ELSE expires END RETURNING count',key,now+60_000,now,now,now+60_000);if(row.count>max)fail(429,'Too many requests. Please wait a minute.');}
 async function proof(user){const w=await one('SELECT * FROM guild_wallets WHERE user_id=?',user);if(!w||w.proof_expires<=clock())fail(401,'Verify your wallet with a fresh signature to continue.');return w;}
 async function master(user,id){const w=await proof(user),g=await one('SELECT * FROM guilds WHERE id=?',id);if(!g)fail(404,'Guild not found.');if(await owner(g)!==w.address)fail(403,'Only the current owner of this founding Chog can manage the guild.');return {w,g};}
 async function inviteInfo(code){if(typeof code!=='string'||! /^[a-f0-9]{48}$/.test(code))fail(404,'This invitation is not valid.');const i=await one('SELECT i.*,g.name,g.motto,g.token_id FROM guild_invites i JOIN guilds g ON g.id=i.guild_id WHERE i.hash=?',await hash(code));if(!i||i.revoked||i.expires<=clock())fail(410,'This invitation has expired or been replaced. Ask the guild master for a new one.');if(await owner(i)!==i.issuer)fail(410,'The founding Chog changed owners. Ask its current owner for a new invitation.');return i;}
 async function state(user,code){const w=await one('SELECT * FROM guild_wallets WHERE user_id=?',user);let guild=null,ownershipError=null;
  {const g=await one('SELECT g.* FROM guilds g JOIN guild_members m ON m.guild_id=g.id WHERE m.user_id=?',user);if(g){let currentOwner=null;try{currentOwner=await owner(g);}catch(e){ownershipError=e.message;}
   const rows=(await stmt('SELECT m.user_id,m.alias,m.joined_at,w.address FROM guild_members m LEFT JOIN guild_wallets w ON w.user_id=m.user_id WHERE guild_id=? ORDER BY joined_at,m.user_id',g.id).all()).results;
   guild={id:g.id,name:g.name,motto:g.motto,tokenId:g.token_id,createdAt:g.created_at,isMaster:!!w&&currentOwner===w.address,ownershipChecked:!!currentOwner,members:rows.map(r=>({alias:r.alias,isYou:r.user_id===user,isMaster:!!r.address&&currentOwner===r.address})),memberCount:rows.length};
  }}
  let invitation=null,invitationError=null;if(code){try{const i=await inviteInfo(code);invitation={guildId:i.guild_id,name:i.name,motto:i.motto,expires:i.expires};}catch(e){invitationError=e.message;}}
  return {signedIn:true,wallet:w?{address:w.address,verified:w.proof_expires>clock(),proofExpires:w.proof_expires}:null,guild,ownershipError,invitation,invitationError,collection:COLLECTION,chainId:CHAIN_ID};
 }
 return async function handle(request){try{
  if(!db)fail(503,'Guild storage is unavailable. Solo play is still available.');
  const u=new URL(request.url),action=u.pathname.split('/').pop(),user=request.headers.get('oai-authenticated-user-id');
  if(action==='health'&&request.method==='GET')return json({ok:true,storage:!!(await one('SELECT count(*) AS total FROM guilds')),collection:COLLECTION,chainId:CHAIN_ID});
  if(!user)fail(401,'Sign in with ChatGPT to save your guild membership across devices.');
  if(request.method==='GET'&&action==='state')return json(await state(user,u.searchParams.get('invite')));
  if(request.method!=='POST')fail(405,'Method not allowed.');
  if(request.headers.get('origin')!==origin)fail(403,'This request must come from Chog Hideout.');
  if(!request.headers.get('content-type')?.startsWith('application/json'))fail(415,'Send JSON.');
  // Stream-bound the body rather than trusting Content-Length.
  let raw='',bytes=0;const reader=request.body?.getReader();if(reader){const decoder=new TextDecoder();while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>8192){await reader.cancel();fail(413,'Request too large.');}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();}
  let body;try{body=JSON.parse(raw);}catch{fail(400,'Invalid request.');}if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'Invalid request.');
  await rate(user,'writes',30);
  const now=clock();
  if(action==='challenge'){
   await rate(user,'signatures',5);const a=address(body.address),existing=await one('SELECT address FROM guild_wallets WHERE user_id=?',user);
   if(existing&&existing.address!==a)fail(409,'This account is linked to another wallet. Leave your guild and unlink it before changing wallets.');
   const nonce=random(),message=walletMessage({address:a,nonce,now,origin});
   await stmt('INSERT INTO guild_challenges (user_id,nonce,address,message,expires,used) VALUES (?,?,?,?,?,0) ON CONFLICT(user_id) DO UPDATE SET nonce=excluded.nonce,address=excluded.address,message=excluded.message,expires=excluded.expires,used=0',user,nonce,a,message,now+FIVE_MIN).run();
   return json({nonce,message,expires:now+FIVE_MIN});
  }
  if(action==='verify'){
   const c=await one('SELECT * FROM guild_challenges WHERE user_id=? AND nonce=?',user,typeof body.nonce==='string'?body.nonce:'');
   if(!c||c.used||c.expires<=now)fail(401,'That signature request expired or was already used. Connect again.');
   if(typeof body.signature!=='string'||! /^0x[0-9a-fA-F]{130}$/.test(body.signature))fail(400,'The wallet signature is invalid.');
   let valid=false;try{valid=await chain.verify({address:c.address,message:c.message,signature:body.signature});}catch{fail(503,'Wallet verification is temporarily unavailable. Try again.');}
   if(!valid)fail(401,'The signature did not verify. Use a standard wallet account; contract wallets are not supported in this alpha.');
   const used=await stmt('UPDATE guild_challenges SET used=1 WHERE user_id=? AND nonce=? AND used=0 AND expires>?',user,c.nonce,clock()).run();if(used.meta.changes!==1)fail(401,'This signature request has already been used or expired.');
   const saved=await stmt('INSERT INTO guild_wallets (user_id,address,proof_expires,created_at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET proof_expires=excluded.proof_expires WHERE address=excluded.address',user,c.address,clock()+DAY,now).run();if(saved.meta.changes!==1)fail(409,'This account already uses another wallet.');
   return json({verified:true,address:c.address});
  }
  if(action==='disconnect'){await stmt('UPDATE guild_wallets SET proof_expires=0 WHERE user_id=?',user).run();return json({disconnected:true});}
  if(action==='unlink'){
   const w=await proof(user);const r=await stmt('DELETE FROM guild_wallets WHERE user_id=? AND NOT EXISTS (SELECT 1 FROM guild_members WHERE user_id=?)',user,user).run();if(r.meta.changes!==1)fail(409,'Leave your guild before unlinking this wallet.');await stmt('DELETE FROM guild_challenges WHERE user_id=?',user).run();return json({unlinked:true});
  }
  if(action==='create'){
   const w=await proof(user),id=random(),t=token(body.tokenId),name=text(body.name,3,32,'Guild name'),motto=text(body.motto||'A little trouble. Together.',3,100,'Guild motto'),alias=text(body.alias,2,24,'Player name');
   if(await owner({token_id:t})!==w.address)fail(403,'This wallet does not own that Chog Genesis NFT. Check its on-chain token ID.');
   await db.batch([stmt('INSERT INTO guilds (id,token_id,name,name_key,motto,created_by,created_at) VALUES (?,?,?,?,?,?,?)',id,t,name,name.toLowerCase(),motto,w.address,now),stmt('INSERT INTO guild_members (user_id,guild_id,alias,joined_at) VALUES (?,?,?,?)',user,id,alias,now)]);
   return json({created:true,guildId:id},201);
  }
  if(action==='claim'){
   const w=await proof(user),t=token(body.tokenId),g=await one('SELECT * FROM guilds WHERE token_id=?',t);if(!g)fail(404,'No guild exists for that token yet. You can found one.');
   if(await owner(g)!==w.address)fail(403,'Only the current owner of the founding Chog can claim leadership.');
   const alias=text(body.alias,2,24,'Player name');const r=await stmt('INSERT INTO guild_members (user_id,guild_id,alias,joined_at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET alias=excluded.alias WHERE guild_id=excluded.guild_id',user,g.id,alias,now).run();if(r.meta.changes!==1)fail(409,'Leave your current guild before claiming another.');
   // New ownership invalidates older invitations even before an invite is replaced.
   await stmt('UPDATE guild_invites SET revoked=1 WHERE guild_id=? AND issuer<>?',g.id,w.address).run();return json({claimed:true,guildId:g.id});
  }
  if(action==='invite'){
   const {w,g}=await master(user,body.guildId);const code=random(),expires=now+7*DAY;
   await stmt('INSERT INTO guild_invites (hash,guild_id,issuer,expires,revoked) VALUES (?,?,?,?,0) ON CONFLICT(guild_id) DO UPDATE SET hash=excluded.hash,issuer=excluded.issuer,expires=excluded.expires,revoked=0',await hash(code),g.id,w.address,expires).run();return json({url:origin+'/guild.html#invite='+code,expires});
  }
  if(action==='revoke'){const {g}=await master(user,body.guildId);await stmt('UPDATE guild_invites SET revoked=1 WHERE guild_id=?',g.id).run();return json({revoked:true});}
  if(action==='join'){
   const i=await inviteInfo(body.code),alias=text(body.alias,2,24,'Player name');
   const r=await stmt('INSERT INTO guild_members (user_id,guild_id,alias,joined_at) SELECT ?,?,?,? WHERE EXISTS (SELECT 1 FROM guild_invites WHERE hash=? AND revoked=0 AND expires>?) AND (SELECT count(*) FROM guild_members WHERE guild_id=?)<50',user,i.guild_id,alias,now,await hash(body.code),now,i.guild_id).run();
   if(r.meta.changes!==1)fail(409,'This invitation changed or the guild is full. Refresh before joining.');return json({joined:true,guildId:i.guild_id});
  }
  if(action==='leave'){await stmt('DELETE FROM guild_members WHERE user_id=?',user).run();return json({left:true});}
  fail(404,'Unknown guild action.');
 }catch(e){if(e instanceof Problem)return json({error:e.message},e.status);if(/UNIQUE constraint/i.test(e.message||''))return json({error:'That wallet, guild name or Chog is already registered. You can belong to one guild at a time; a founding NFT can have one guild.'},409);console.error('Guild operation failed:',e.name);return json({error:'The guild service could not complete this request. Please try again.'},503);}};
}
