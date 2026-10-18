import test from 'node:test';
import assert from 'node:assert/strict';
import {createGestureInput,readControlMode,saveControlMode,GESTURE_KEY} from '../public/gesture-input.mjs';
import {newMischief,nearbyAction} from '../public/mischief.mjs';
import {projectTarget} from '../public/mischief-target.mjs';
function fixture(){const events=[],bounds=()=>({left:10,top:20,width:360,height:720}),g=createGestureInput({bounds,onMove:v=>events.push(['move',v]),onJump:()=>events.push(['jump']),onDash:v=>events.push(['dash',v])});const e=(id,x,y,t)=>({pointerId:id,clientX:x+10,clientY:y+20,timeStamp:t,pointerType:'touch',preventDefault(){},currentTarget:{setPointerCapture(){}}});return {g,e,events};}

test('upward swipe jumps before release; continued motion and release cannot also dash',()=>{const {g,e,events}=fixture();g.down(e(1,260,600,0));g.move(e(1,267,580,25));assert.deepEqual(events,[]);g.move(e(1,270,575,45));assert.deepEqual(events,[['jump']]);g.move(e(1,320,570,70));g.up(e(1,330,570,90));assert.deepEqual(events,[['jump']]);});

test('sideways swipe dashes once; continuing upward does not also jump',()=>{const {g,e,events}=fixture();g.down(e(2,280,600,100));g.move(e(2,245,590,145));g.move(e(2,240,530,170));g.up(e(2,240,520,200));assert.deepEqual(events,[['dash',-1]]);});

test('diagonal intent waits for a clear direction and final pointerup coordinates can complete a swipe',()=>{const {g,e,events}=fixture();g.down(e(1,280,600,0));g.move(e(1,250,570,40));assert.deepEqual(events,[]);g.move(e(1,247,555,70));assert.deepEqual(events,[['jump']]);g.up(e(1,247,555,90));g.down(e(2,280,600,100));g.up(e(2,320,590,150));assert.deepEqual(events,[['jump'],['dash',1]]);});

test('dragging and jumping work with separate thumbs; cancel, lost capture and reset cannot leave movement held',()=>{const {g,e,events}=fixture();g.down(e(1,60,650,0));g.move(e(1,100,645,30));assert.deepEqual(events.at(-1),['move',1]);g.down(e(2,280,600,40));g.move(e(2,285,570,75));g.up(e(2,285,570,95));assert.deepEqual(events.at(-1),['jump']);g.move(e(1,35,650,100));assert.deepEqual(events.at(-1),['move',-1]);g.cancel(e(1,35,650,110));assert.deepEqual(events.at(-1),['move',0]);const before=events.length;g.down(e(3,280,600,150));g.cancel(e(3,280,600,180));assert.equal(events.length,before);g.down(e(4,60,650,200));g.move(e(4,100,650,230));g.reset();assert.deepEqual(events.at(-1),['move',0]);g.up(e(4,100,650,260));assert.deepEqual(events.at(-1),['move',0]);});

test('taps, downward drags, slow swipes and long rests do not trigger actions',()=>{const {g,e,events}=fixture();g.down(e(1,280,600,0));g.move(e(1,283,660,50));g.up(e(1,283,660,90));g.down(e(2,280,600,200));g.move(e(2,320,600,600));g.up(e(2,320,600,650));g.down(e(3,280,600,800));g.up(e(3,280,600,1200));g.down(e(4,280,600,1300));g.up(e(4,281,601,1350));g.down(e(5,280,600,1400));g.move(e(5,280,570,1800));g.up(e(5,280,565,1850));assert.deepEqual(events,[]);});

test('button preference tolerates blocked storage; nearby object targets follow the gameplay camera',()=>{const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};assert.equal(readControlMode(storage),'gestures');assert(saveControlMode(storage,'buttons'));assert.equal(map.get(GESTURE_KEY),'buttons');assert.equal(readControlMode(storage),'buttons');assert.equal(readControlMode({getItem(){throw Error();}}),'gestures');assert.equal(saveControlMode({setItem(){throw Error();}},'buttons'),false);const s=newMischief();s.x=430;const a=nearbyAction(s);assert.equal(a.id,'battery');for(const [displayWidth,displayHeight,width,height] of [[360,720,900,1800],[800,450,900,506]]){const target=projectTarget(s,a,{width,height,displayWidth,displayHeight,cameraBias:.2});assert(target.x>20&&target.x<displayWidth-20);assert(target.y>120&&target.y<displayHeight);assert.equal(target.label,'TAKE');}});


test('a resting thumb can begin a fresh swipe without lifting, and the stroke still fires once',()=>{
 const {g,e,events}=fixture();g.down(e(1,270,600,0));g.move(e(1,271,598,900));assert.deepEqual(events,[]);g.move(e(1,273,570,940));assert.deepEqual(events,[['jump']]);g.move(e(1,320,560,960));g.up(e(1,330,550,980));assert.deepEqual(events,[['jump']]);
 g.down(e(2,270,600,1100));g.move(e(2,271,601,2000));g.cancel(e(2,271,601,2010));g.move(e(2,310,600,2050));assert.deepEqual(events,[['jump']]);
});
