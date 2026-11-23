/* Pegasus Youth Voice — The Birth of a Voice | Canvas-driven particle identity reveal.
 * Original SVG feather geometry is preserved in /assets/wing-feathers.svg.
 * No blue endpoint, incoming blue line or banner. */
(()=>{
"use strict";
const host=document.querySelector(".hero-wing-frame .wing-composition");
if(!host)return;
const canvas=host.querySelector("canvas.particle-canvas");
if(!canvas||!canvas.getContext)return;
const ctx=canvas.getContext("2d",{alpha:true});
if(!ctx)return;
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
if(reduced.matches){canvas.hidden=true;return;}
const W=720,H=600,CX=360,CY=300,R=288,N=999;
const SHAPES=[
 {d:"M173 99 C240 205 366 218 486 182 C421 228 378 271 357 334 C322 287 255 258 215 207 C183 165 171 122 173 99Z",min:[172,98,488,335],c:"#1787c7"},
 {d:"M167 222 C230 297 302 322 379 322 C446 321 508 287 550 243 C493 324 434 369 354 383 C271 394 208 335 167 222Z",min:[166,221,552,395],c:"#43b2b5"},
 {d:"M209 344 C296 405 381 406 453 373 C493 354 518 334 538 304 C521 379 483 423 428 444 C345 472 261 422 209 344Z",min:[208,302,540,475],c:"#9165bb"},
 {d:"M292 469 C358 495 431 472 490 421 C463 480 419 513 371 525 C339 517 311 497 292 469Z",min:[290,419,493,528],c:"#efac36"}
];
let seed=362711;function random(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296}
const hit=document.createElement("canvas").getContext("2d");
const shapes=SHAPES.map(x=>({...x,path:new Path2D(x.d)}));
function target(shape){let b=shape.min;for(let i=0;i<1600;i++){let x=b[0]+random()*(b[2]-b[0]),y=b[1]+random()*(b[3]-b[1]);if(hit.isPointInPath(shape.path,x,y))return{x,y}}return{x:(b[0]+b[2])/2,y:(b[1]+b[3])/2}}
const particles=Array.from({length:N},(_,i)=>{
 const shape=shapes[i%4],angle=i*2.399963229728653+(random()-.5)*.67,r=34+Math.pow(random(),.68)*201;
 return {dest:target(shape),bx:CX+Math.cos(angle)*r,by:CY+Math.sin(angle)*r,
   angle,curve:(random()-.5)*55,phase:random()*Math.PI*2,
   rad:.48+random()*1.38,col:shape.c,variation:.8+random()*.3};
});
let cssW=0,cssH=0,dpr=1;
function resize(){
 let rect=host.getBoundingClientRect();
 cssW=rect.width;cssH=rect.height;
 dpr=Math.min(window.devicePixelRatio||1,2);
 const pw=Math.max(1,Math.round(cssW*dpr)),ph=Math.max(1,Math.round(cssH*dpr));
 if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph}
}
if("ResizeObserver"in window)new ResizeObserver(resize).observe(host);
else window.addEventListener("resize",resize,{passive:true});
resize();
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeOut=x=>1-Math.pow(1-clamp(x),3);
function drawSpark(x,y,size,opacity){
 if(opacity<=0)return;
 ctx.save();ctx.globalAlpha=opacity;
 const glow=ctx.createRadialGradient(x,y,0,x,y,size*5);
 glow.addColorStop(0,"rgba(246,177,47,.33)");glow.addColorStop(.4,"rgba(246,177,47,.12)");glow.addColorStop(1,"rgba(246,177,47,0)");
 ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,size*5,0,2*Math.PI);ctx.fill();
 ctx.fillStyle="#F4AF2F";ctx.beginPath();ctx.arc(x,y,size,0,2*Math.PI);ctx.fill();
 ctx.fillStyle="#FFF8D9";ctx.beginPath();ctx.arc(x-1,y-1,Math.max(.8,size*.3),0,2*Math.PI);ctx.fill();
 ctx.restore();
}
function renderParticles(t){
 if(t<.9||t>6.35)return;
 const scatter=easeOut((t-.90)/1.35), gather=smooth((t-3.1)/2.95);
 const opacity=smooth((t-.86)/.36)*(1-smooth((t-4.6)/1.75));
 if(opacity<=0)return;
 const suspended=smooth((t-2.3)/.5)*(1-smooth((t-3.15)/.35));
 for(let i=0;i<particles.length;i++){
  const p=particles[i],drift=6*suspended;
  let bx=CX+(p.bx-CX)*scatter+Math.cos(p.phase+t*1.3)*drift;
  let by=CY+(p.by-CY)*scatter+Math.sin(p.phase+t*1.1)*drift;
  let x=bx+(p.dest.x-bx)*gather+p.curve*Math.sin(gather*Math.PI);
  let y=by+(p.dest.y-by)*gather+p.curve*.3*Math.sin(gather*Math.PI);
  ctx.globalAlpha=opacity*p.variation;
  ctx.fillStyle=p.col;
  ctx.beginPath();ctx.arc(x,y,p.rad*(1-.32*gather),0,2*Math.PI);ctx.fill();
 }
 ctx.globalAlpha=1;
}
function drawOrbit(t){
 const begin=6.3;
 if(t<begin)return;
 let elapsed=t-begin,angle=elapsed*2*Math.PI/12;
 const len=Math.min(1.63,angle); // tail develops only as the particle moves
 // Draw from oldest (transparent) to newest (brightest); never draw a fixed full ring.
 const steps=42;
 for(let i=0;i<steps;i++){
  let frac=i/steps;
  const a=angle-len+len*frac,b=angle-len+len*(i+1)/steps;
  const alpha=.03+.47*Math.pow(frac,2.2);
  ctx.strokeStyle="rgba(31,132,194,"+alpha.toFixed(3)+")";
  ctx.lineWidth=1.15+1.25*frac;
  ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(CX+R*Math.sin(a),CY-R*Math.cos(a));
  ctx.lineTo(CX+R*Math.sin(b),CY-R*Math.cos(b));ctx.stroke();
 }
 ctx.lineCap="butt";
 drawSpark(CX+R*Math.sin(angle),CY-R*Math.cos(angle),4.5,1);
}
let start=null,pausedAt=null,raf=0,hasFocus=true;
function draw(now){
 if(!document.documentElement.contains(canvas))return;
 if(start===null)start=now;
 const t=(now-start)/1000;
 if(!cssW||!cssH){resize();}
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
 ctx.clearRect(0,0,W,H);
 if(t<.90)drawSpark(CX,CY,4.7+(Math.sin(t*13)**2)*1.65,smooth(t/.35));
 renderParticles(t);
 // The SAME original spark survives the cloud; it travels to orbit entry.
 if(t>=.9&&t<6.3){
  const scatter=smooth((t-.9)/1.35),gather=smooth((t-3.45)/2.85);
  const x=CX-87*scatter+87*gather;
  const y=CY-112*scatter-176*gather;
  drawSpark(x,y,5.2,.88);
 }
 if(t>=6.3)drawOrbit(t);
 raf=requestAnimationFrame(draw);
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;pausedAt=performance.now()}
document.addEventListener("visibilitychange",()=>{
 if(document.hidden)stop();
 else if(pausedAt!==null){if(start!==null)start+=performance.now()-pausedAt;pausedAt=null;raf=requestAnimationFrame(draw)}
});
raf=requestAnimationFrame(draw);
})();
