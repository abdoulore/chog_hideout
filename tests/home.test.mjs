import test from 'node:test';
import assert from 'node:assert/strict';
import {readHome,saveHomeName,keepsakes,HOME_KEY,DEFAULT_NAME} from '../public/home-model.mjs';
import {emptyRecords,readRecords,recordFinish,writeRecords,RECORD_KEY} from '../public/heist-records.mjs';
import {newHeist,stepHeist} from '../public/heist.mjs';
import {controlHeist} from './helpers/heist-controller.mjs';
const store=()=>{const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};};

test('existing heist saves restore Sun and clean keepsake without inventing an old spark count',()=>{
 const storage=store();storage.setItem(RECORD_KEY,JSON.stringify({version:emptyRecords().version,completed:true,bestClean:25,bestEscape:11}));const home=readHome(storage);assert(home.records.completed);assert.equal(home.records.bestSparks,0);assert.deepEqual(keepsakes(home.records).map(k=>k.earned),[true,true,false]);
});
test('a complete heist persists into a newly loaded home, with separate all-sparks recognition',()=>{
 const storage=store(),s=newHeist();for(let i=0;i<8000&&s.status==='playing';i++)stepHeist(s,controlHeist(s));assert.equal(s.status,'won');assert(writeRecords(storage,recordFinish(emptyRecords(),s)));assert(readHome(storage).records.completed);assert.equal(keepsakes(readHome(storage).records)[0].earned,true);
 const all={...s,clean:false,coins:8};const records=recordFinish(readRecords(storage),all);writeRecords(storage,records);assert(keepsakes(readHome(storage).records)[2].earned);assert.equal(readHome(storage).records.bestClean,s.time);
 const failed={...s,status:'dead',coins:8};assert.deepEqual(recordFinish(emptyRecords(),failed),emptyRecords());
});
test('renaming survives reload, is bounded plain text, and reports unavailable saving',()=>{
 const storage=store();const out=saveHomeName(storage,'  My   little loft  ');assert(out.saved);assert.equal(readHome(storage).name,'My little loft');assert.equal(saveHomeName(storage,' ').name,DEFAULT_NAME);assert.equal(Array.from(saveHomeName(storage,'a'.repeat(50)).name).length,32);
 const blocked={getItem(){throw Error();},setItem(){throw Error();}};assert.equal(saveHomeName(blocked,'Tiny home').saved,false);assert.equal(readHome(blocked).name,DEFAULT_NAME);storage.setItem(HOME_KEY,'corrupt');assert.equal(readHome(storage).name,DEFAULT_NAME);
});
