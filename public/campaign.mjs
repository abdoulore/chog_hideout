// Local solo progression only; never used as ownership or tournament evidence.
export const CAMPAIGN_KEY='chog-campaign:v1';
export const VAULT_URL='mischief.html?route=heist&renderer=pixel';
export const ANNEX_URL='mischief.html?route=annex&renderer=pixel';
export function readCampaign(store){try{const p=JSON.parse(store?.getItem(CAMPAIGN_KEY)||'null');return {vault:p?.version===1&&p.vault===true,annex:p?.version===1&&p.vault===true&&p.annex===true};}catch{return {vault:false,annex:false};}}
export function completeCampaign(store,run){
 const progress=readCampaign(store);
 if(!run.vaultMission||run.status!=='won'||!run.banked||!run.loot.includes('sun'))return {progress,saved:false};
 progress.vault=true;if(run.annexMission)progress.annex=true;
 try{if(!store)throw Error('No storage');store.setItem(CAMPAIGN_KEY,JSON.stringify({version:1,...progress}));return {progress,saved:true};}catch{return {progress,saved:false};}
}
