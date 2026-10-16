// Grade scenery once at source resolution, then reuse the surface while scrolling.
// The playable plane, characters, treasures and hazards never use these filters.
const cache=new WeakMap();
export function createSceneSurface(width,height){if(typeof globalThis.OffscreenCanvas==='function')return new globalThis.OffscreenCanvas(width,height);const canvas=globalThis.document?.createElement?.('canvas');if(!canvas)return null;canvas.width=width;canvas.height=height;return canvas;}
export function sceneryImage(image,kind='city',createSurface=createSceneSurface){
 let variants=cache.get(image);if(variants?.has(kind))return variants.get(kind);
 const sourceWidth=image.naturalWidth||image.width,sourceHeight=image.naturalHeight||image.height;if(!sourceWidth||!sourceHeight)return image;const width=kind==='city'?Math.min(960,sourceWidth):sourceWidth,height=Math.round(sourceHeight*width/sourceWidth);
 try{const surface=createSurface(width,height),ctx=surface?.getContext('2d');if(!ctx)return image;
 ctx.fillStyle=kind==='city'?'#b4afc0':'#b9a6b2';ctx.fillRect(0,0,width,height);
 ctx.filter=kind==='city'?'saturate(0.68) contrast(0.74) brightness(0.98) blur(1.6px)':'saturate(0.68) contrast(0.80) brightness(0.90) blur(0.7px)';
 if(kind==='houses')ctx.clearRect(0,0,width,height);ctx.drawImage(image,0,0,width,height);ctx.filter='none';
 if(!variants){variants=new Map();cache.set(image,variants);}variants.set(kind,surface);return surface;
 }catch{return image;}
}
export function drawDistantCity(ctx,run,images,width,height,layout,{createSurface=createSceneSurface}={}){
 const {camera:cam,groundY,portrait}=layout,sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#8b9ab4');sky.addColorStop(.5,'#b5b8c6');sky.addColorStop(1,'#c2b4bd');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
 const city=sceneryImage(images.city,'city',createSurface),ratio=images.city.width/images.city.height,bgW=Math.max(width*1.08,height*ratio*(portrait?.86:.88)),bgH=bgW/ratio,bgY=groundY-bgH*.78,offset=cam.x*.10;
 for(let tile=-1;tile<3;tile++){const x=tile*bgW-offset;ctx.save();if(tile%2){ctx.translate(x+bgW,bgY);ctx.scale(-1,1);ctx.drawImage(city,0,0,bgW,bgH);}else ctx.drawImage(city,x,bgY,bgW,bgH);ctx.restore();}
 const air=ctx.createLinearGradient(0,0,0,groundY);air.addColorStop(0,'rgba(170,183,203,.05)');air.addColorStop(.45,'rgba(184,181,196,.10)');air.addColorStop(1,'rgba(184,176,190,.25)');ctx.fillStyle=air;ctx.fillRect(0,0,width,height);
}
