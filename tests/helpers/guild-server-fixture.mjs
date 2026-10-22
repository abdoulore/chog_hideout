import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {generatePrivateKey,privateKeyToAccount} from 'viem/accounts';
import {verifyMessage} from 'viem';
import {createGuildApi} from '../../server/guild-api.mjs';
import {ORIGIN} from '../../server/chain.mjs';
export const account=()=>privateKeyToAccount(generatePrivateKey());
export function setup(){
 const sqlite=new DatabaseSync(':memory:');for(const file of fs.readdirSync(new URL('../../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(fs.readFileSync(new URL('../../drizzle/'+file,import.meta.url),'utf8'));sqlite.exec('PRAGMA foreign_keys=ON');
 const db={prepare(sql){let values=[];return {bind(...v){values=v;return this;},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},runSync(){const r=sqlite.prepare(sql).run(...values);return {success:true,meta:{changes:Number(r.changes)}};},async run(){return this.runSync();}};},async batch(statements){sqlite.exec('BEGIN');try{const result=statements.map(s=>s.runSync());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 let now=1792248000000,offline=false;const owner=account(),owners=new Map([['701',owner.address.toLowerCase()]]),chain={async ownerOf(id){if(offline)throw Error('offline');return owners.get(id)||'0x0000000000000000000000000000000000000000';},verify:args=>verifyMessage(args)};
 let handle=createGuildApi({db,chain,clock:()=>now});
 async function call(user,action,body,headers={}){const r=await handle(new Request(ORIGIN+'/api/guild/'+action,{method:body===undefined?'GET':'POST',headers:{...(user?{'oai-authenticated-user-id':user}:{}),...(body===undefined?{}:{origin:ORIGIN,'content-type':'application/json'}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})}));return {status:r.status,data:await r.json()};}
 async function link(user,a=owner){const c=await call(user,'challenge',{address:a.address});assert.equal(c.status,200,JSON.stringify(c.data));const signature=await a.signMessage({message:c.data.message});const r=await call(user,'verify',{nonce:c.data.nonce,signature});assert.equal(r.status,200,JSON.stringify(r.data));return {challenge:c.data,signature};}
 async function found(){await link('founder');const r=await call('founder','create',{tokenId:'701',name:'Night Lanterns',alias:'Ari'});assert.equal(r.status,201,JSON.stringify(r.data));return r.data.guildId;}
 async function invite(id){const r=await call('founder','invite',{guildId:id});assert.equal(r.status,200,JSON.stringify(r.data));return new URLSearchParams(new URL(r.data.url).hash.slice(1)).get('invite');}
 return {db,sqlite,owner,owners,call,link,found,invite,advance:n=>now+=n,offline:v=>offline=v,restart(){handle=createGuildApi({db,chain,clock:()=>now});}};
}
