import {createPublicClient,http,fallback,getAddress,parseAbi,verifyMessage} from 'viem';
export const CHAIN_ID=143;
export const COLLECTION='0xc96d31f8626c6d03fae5dcd3d61e3fb9f4a73763';
export const ORIGIN='https://chog-playtest-lab.fondbuddy6.chatgpt.site';
const abi=parseAbi(['function ownerOf(uint256 tokenId) view returns (address)','function name() view returns (string)']);
const chain={id:CHAIN_ID,name:'Monad',nativeCurrency:{name:'MON',symbol:'MON',decimals:18},rpcUrls:{default:{http:['https://rpc.monad.xyz']}}};
export function makeChain(){
 const client=createPublicClient({chain,transport:fallback([http('https://rpc.monad.xyz',{timeout:7000,retryCount:0}),http('https://rpc1.monad.xyz',{timeout:7000,retryCount:0})])});
 return {
  async ownerOf(tokenId){
   if(await client.getChainId()!==CHAIN_ID)throw Error('Wrong network from RPC');
   return (await client.readContract({address:COLLECTION,abi,functionName:'ownerOf',args:[BigInt(tokenId)],blockTag:'finalized'})).toLowerCase();
  },
  // This alpha deliberately accepts externally owned wallets only, without ambiguous contract-session validity.
  async verify({address,message,signature}){
   const code=await client.getCode({address});
   if(code&&code!=='0x')return false;
   return verifyMessage({address,message,signature});
  }
 };
}
export function canonicalAddress(value){return getAddress(value).toLowerCase();}
export function walletMessage({address,nonce,now,origin=ORIGIN}){
 return `${new URL(origin).host} wants you to sign in with your Ethereum account:\n${getAddress(address)}\n\nVerify your wallet for Chog Hideout guilds. No payment, token approval or NFT transfer.\n\nURI: ${origin}/guild.html\nVersion: 1\nChain ID: ${CHAIN_ID}\nNonce: ${nonce}\nIssued At: ${new Date(now).toISOString()}\nExpiration Time: ${new Date(now+5*60_000).toISOString()}`;
}
