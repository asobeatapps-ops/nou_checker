import {ELEMENTS} from './data.js?v=1.0.3';
export const ELEMENT_EMOJI=Object.freeze(['🍔','😴','💰','😍','🎮','🛍️','🛋️','🥺','🚀','📱','🔥','🕊️','😈','💭','🫥','🎲','💢','🔍','💖','🤩']);
// Flat, symmetric top view. The exact percentages remain in the adjacent list/bar.
export function brainOutline(c){c.beginPath();c.moveTo(0,-105);c.bezierCurveTo(-20,-140,-76,-139,-94,-111);c.bezierCurveTo(-137,-118,-166,-88,-157,-61);c.bezierCurveTo(-192,-35,-183,8,-160,20);c.bezierCurveTo(-181,56,-151,90,-128,91);c.bezierCurveTo(-117,128,-51,140,-16,116);c.quadraticCurveTo(0,104,16,116);c.bezierCurveTo(51,140,117,128,128,91);c.bezierCurveTo(151,90,181,56,160,20);c.bezierCurveTo(183,8,192,-35,157,-61);c.bezierCurveTo(166,-88,137,-118,94,-111);c.bezierCurveTo(76,-139,20,-140,0,-105);c.closePath()}
export function drawBrain2D(c,x,y,w,h,parts){
 if(!parts?.length)return;
 c.save();const scale=Math.min(w/400,h/300);c.translate(x+w/2,y+h/2);c.scale(scale,scale);
 brainOutline(c);c.save();c.clip();let top=-140;
 for(const part of parts){const height=280*part.percent/100,e=ELEMENTS[part.id-1];c.fillStyle=e.color;c.fillRect(-190,top,380,height+.5);c.strokeStyle='#071624';c.lineWidth=1.5;c.beginPath();c.moveTo(-190,top);c.lineTo(190,top);c.stroke();if(part.percent>=8){const cy=top+height/2,font=part.percent>=50?28:part.percent>=15?19:14;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#061321';c.font=`800 ${font}px sans-serif`;c.fillText(`${ELEMENT_EMOJI[part.id-1]} ${e.name} ${part.percent}%`,0,cy,285)}top+=height}
 c.restore();brainOutline(c);c.strokeStyle='#D9F7FF';c.lineWidth=3;c.stroke();
 c.strokeStyle='#07162455';c.lineWidth=2.2;c.lineCap='round';for(const side of[-1,1]){c.beginPath();c.moveTo(side*20,-93);c.bezierCurveTo(side*52,-111,side*92,-86,side*75,-64);c.bezierCurveTo(side*40,-52,side*66,-23,side*106,-40);c.bezierCurveTo(side*146,-44,side*147,-6,side*118,5);c.stroke();c.beginPath();c.moveTo(side*39,26);c.bezierCurveTo(side*81,3,side*109,29,side*84,47);c.bezierCurveTo(side*54,64,side*114,77,side*112,92);c.stroke()}
 c.restore();
}
export class ResultBrainView{
 constructor(root){this.root=root;this.canvas=document.createElement('canvas');this.canvas.dataset.renderer='2d';this.canvas.setAttribute('role','img');this.canvas.style.cssText='display:block;width:100%;height:100%;';root.append(this.canvas);this.ctx=this.canvas.getContext('2d');this.dirty=true;this.width=0;this.height=0}
 setResult(result){this.result=result;this.dirty=true;this.canvas.setAttribute('aria-label','脳内の2D構成図：'+result.elements.map(p=>`${ELEMENTS[p.id-1].name} ${p.percent}%`).join('、'))}
 render(){const{width,height}=this.root.getBoundingClientRect(),d=Math.min(globalThis.devicePixelRatio||1,2);if(!width||!height||!this.ctx)return;if(width!==this.width||height!==this.height||d!==this.dpr){this.width=width;this.height=height;this.dpr=d;this.canvas.width=Math.round(width*d);this.canvas.height=Math.round(height*d);this.dirty=true}if(!this.dirty)return;const c=this.ctx;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,width,height);drawBrain2D(c,8,26,width-16,height-38,this.result?.elements);this.dirty=false}
 capture(){try{this.render();return this.canvas.toDataURL('image/png')}catch{return null}}
}
