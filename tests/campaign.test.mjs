import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGN_KEY,readCampaign,completeCampaign} from '../public/campaign.mjs';
test('campaign rejects failures, tolerates corrupt storage, and never relocks a completed mission',()=>{
 const m=new Map(),store={getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};
 m.set(CAMPAIGN_KEY,'broken');assert.deepEqual(readCampaign(store),{vault:false,annex:false,lantern:false});const run={vaultMission:true,status:'dead',banked:false,loot:['sun']};completeCampaign(store,run);assert.equal(readCampaign(store).vault,false);run.status='won';run.banked=true;assert(completeCampaign(store,run).saved);run.annexMission=true;completeCampaign(store,run);run.annexMission=false;completeCampaign(store,run);assert.deepEqual(readCampaign(store),{vault:true,annex:true,lantern:false});
});

test('existing two-mission saves migrate without losing progress; third completion survives earlier replay',()=>{const m=new Map([[CAMPAIGN_KEY,JSON.stringify({version:1,vault:true,annex:true})]]),store={getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};assert.deepEqual(readCampaign(store),{vault:true,annex:true,lantern:false});const run={vaultMission:true,annexMission:true,lanternMission:true,status:'won',banked:true,loot:['sun']};completeCampaign(store,run);completeCampaign(store,{...run,lanternMission:false,annexMission:false});assert.equal(readCampaign(store).lantern,true);});
