import {readCampaign,VAULT_URL,ANNEX_URL,LANTERN_URL} from './campaign.mjs';
// Solo navigation stays independent of account requests and wallet availability.
export function updateCampaignLinks(doc=globalThis.document,win=globalThis.window){
 let store;try{store=win.localStorage;}catch{/* Fall back to the first mission. */}
 const progress=readCampaign(store);
 const href=progress.annex?LANTERN_URL:progress.vault?ANNEX_URL:VAULT_URL;
 for(const link of doc.querySelectorAll('[data-campaign-play]'))link.href=href;
}
if(typeof document!=='undefined'){
 const refresh=()=>updateCampaignLinks();
 refresh();
 window.addEventListener('pageshow',refresh);
 window.addEventListener('storage',refresh);
}
