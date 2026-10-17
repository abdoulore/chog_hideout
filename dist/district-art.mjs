// Painted foreground art, loaded only by One More Thing.
export const districtAssets={
 districtHome:{url:'assets/burrows-hideout-v2.webp',width:768,height:569,frame:[25,48,720,456]},
 districtProps:{url:'assets/burrows-district-props-v2.webp',width:800,height:800,frames:{battery:[98,59,204,293],music:[421,104,366,248],planter:[9,456,445,283],motor:[469,455,322,281]}}
};
export async function loadDistrictArt(){return Object.fromEntries(await Promise.all(Object.entries(districtAssets).map(([key,m])=>new Promise((resolve,reject)=>{const image=new Image(),timer=setTimeout(()=>reject(Error('District artwork timed out')),15000);image.onload=()=>{clearTimeout(timer);resolve([key,image]);};image.onerror=()=>{clearTimeout(timer);reject(Error('District artwork unavailable'));};image.src=new URL(m.url,import.meta.url).href;}))));}
export function districtSprite(ctx,images,id,x,y,w,h){const m=id==='home'?districtAssets.districtHome:districtAssets.districtProps,image=images[id==='home'?'districtHome':'districtProps'],frame=id==='home'?m.frame:m.frames[id];if(!image)return false;ctx.drawImage(image,...frame,x,y,w,h);return true;}
