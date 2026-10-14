// Code-drawn mascot reference for movement calibration, not a Genesis NFT sprite.
export function drawChog(ctx,x,y,size=40,facing=1,pose='idle',phase=0){
 ctx.save();ctx.translate(x,y);ctx.scale(facing*size/48,size/48);
 const moving=pose==='run',stride=moving?Math.sin(phase)*5:0;
 ctx.strokeStyle='#402259';ctx.lineWidth=1.6;ctx.lineJoin='round';
 const shape=(points,fill)=>{ctx.fillStyle=fill;ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();ctx.stroke();};
 ctx.globalAlpha=.14;ctx.fillStyle='#302329';ctx.beginPath();ctx.ellipse(0,25,20,4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 shape([[-9,10],[-2,10],[-2,21+stride],[-13,23+stride],[-16,19+stride]],'#ee79b9');
 shape([[2,10],[10,9],[13,19-stride],[21,20-stride],[20,25-stride],[6,24-stride]],'#ee79b9');
 shape([[-15,-5],[7,-8],[14,11],[4,16],[-13,12],[-19,3]],'#7337c0');
 shape([[-12,-5],[-29,-4],[-23,-12],[-33,-18],[-20,-20],[-29,-31],[-13,-28],[-17,-41],[-3,-32],[4,-38],[10,-24],[16,-14],[9,-1]],'#803cd0');
 shape([[-14,-10],[-16,-22],[-8,-24],[-2,-29],[4,-24],[9,-22],[12,-13],[6,-6],[-6,-5]],'#ffe9b0');
 ctx.fillStyle='#fffdf5';ctx.beginPath();ctx.ellipse(5,-18,4.6,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2f203d';ctx.beginPath();ctx.ellipse(7,-18,2.7,4.2,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#f686ad';ctx.beginPath();ctx.ellipse(-5,-12,4,2.8,.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7b324d';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(4,-9);ctx.lineTo(9,-11);ctx.stroke();
 const arm=pose==='dash'?[[4,-2],[21,-4],[25,1],[20,5],[7,5]]:[[3,-1],[14,3+stride*.4],[19,1],[23,5],[18,10],[6,6]];shape(arm,'#ee79b9');
 ctx.restore();
}
