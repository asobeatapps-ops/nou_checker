import {ELEMENTS} from './data.js?v=1.0.5';
export const ELEMENT_EMOJI=Object.freeze(['🍔','😴','💰','😍','🎮','🛍️','🛋️','🥺','🚀','📱','🔥','🕊️','😈','💭','🫥','🎲','💢','🔍','💖','🤩','💋']);
// Flat, symmetric top view. The exact percentages remain in the adjacent list/bar.
export function brainOutline(c){c.beginPath();c.moveTo(0,-105);c.bezierCurveTo(-20,-140,-76,-139,-94,-111);c.bezierCurveTo(-137,-118,-166,-88,-157,-61);c.bezierCurveTo(-192,-35,-183,8,-160,20);c.bezierCurveTo(-181,56,-151,90,-128,91);c.bezierCurveTo(-117,128,-51,140,-16,116);c.quadraticCurveTo(0,104,16,116);c.bezierCurveTo(51,140,117,128,128,91);c.bezierCurveTo(151,90,181,56,160,20);c.bezierCurveTo(183,8,192,-35,157,-61);c.bezierCurveTo(166,-88,137,-118,94,-111);c.bezierCurveTo(76,-139,20,-140,0,-105);c.closePath()}
// One character for each percentage point, in fixed positions inside the existing outline.
export const ELEMENT_WORDS=Object.freeze(['食','眠','金','愛','遊','物','休','認','逃','携','向','穏','悪','妄','無','運','怒','好','優','乱','H']);
function outlinePolygon(){const points=[];let previous=[0,0];const path={beginPath(){},moveTo(x,y){previous=[x,y];points.push(previous)},bezierCurveTo(ax,ay,bx,by,x,y){const[px,py]=previous;for(let i=1;i<=20;i++){const t=i/20,u=1-t;points.push([u*u*u*px+3*u*u*t*ax+3*u*t*t*bx+t*t*t*x,u*u*u*py+3*u*u*t*ay+3*u*t*t*by+t*t*t*y])}previous=[x,y]},quadraticCurveTo(ax,ay,x,y){const[px,py]=previous;for(let i=1;i<=20;i++){const t=i/20,u=1-t;points.push([u*u*px+2*u*t*ax+t*t*x,u*u*py+2*u*t*ay+t*t*y])}previous=[x,y]},closePath(){}};brainOutline(path);return points}
const POLYGON=outlinePolygon();
function inside(x,y){let hit=false;for(let i=0,j=POLYGON.length-1;i<POLYGON.length;j=i++){const[a,b]=POLYGON[i],[u,v]=POLYGON[j];if((b>y)!==(v>y)&&x<(u-a)*(y-b)/(v-b)+a)hit=!hit}return hit}
const WORD_POSITIONS=(()=>{const cells=[];for(let y=-110;y<=110;y+=22)for(let x=-165;x<=165;x+=22){if([[-10,-10],[10,-10],[-10,10],[10,10]].every(([dx,dy])=>inside(x+dx,y+dy)))cells.push({x,y})}cells.sort((a,b)=>a.y-b.y||a.x-b.x);if(cells.length<100)throw Error('Brain word grid must fit 100 cells');const selected=Array.from({length:100},(_,i)=>cells[Math.floor((i+.5)*cells.length/100)]);return Object.freeze(selected.sort((a,b)=>(a.x*.7+a.y)-(b.x*.7+b.y)||a.y-b.y).map(Object.freeze))})();
export function brainWordLayout(parts){let offset=0;const glyphs=[];for(const part of parts){for(let i=0;i<part.percent;i++){const position=WORD_POSITIONS[offset++];if(position)glyphs.push({...position,id:part.id,text:ELEMENT_WORDS[part.id-1],color:ELEMENTS[part.id-1].color})}}return glyphs}
export function drawBrain2D(c,x,y,w,h,parts){
 if(!parts?.length)return;
 c.save();const scale=Math.min(w/400,h/300);c.translate(x+w/2,y+h/2);c.scale(scale,scale);
 brainOutline(c);c.fillStyle='#0D2030';c.fill();c.save();c.clip();c.textAlign='center';c.textBaseline='middle';c.font='800 20px "Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';
 for(const glyph of brainWordLayout(parts)){c.fillStyle=glyph.color;c.fillText(glyph.text,glyph.x,glyph.y,21)}
 c.restore();brainOutline(c);c.strokeStyle='#D9F7FF';c.lineWidth=3;c.stroke();c.restore();
}
export class ResultBrainView{
 constructor(root){this.root=root;this.canvas=document.createElement('canvas');this.canvas.dataset.renderer='2d';this.canvas.setAttribute('role','img');this.canvas.style.cssText='display:block;width:100%;height:100%;';root.append(this.canvas);this.ctx=this.canvas.getContext('2d');this.dirty=true;this.width=0;this.height=0}
 setResult(result){this.result=result;this.dirty=true;this.canvas.setAttribute('aria-label','脳内の2D構成図：'+result.elements.map(p=>`${ELEMENTS[p.id-1].name} ${p.percent}%`).join('、'))}
 render(){const{width,height}=this.root.getBoundingClientRect(),d=Math.min(globalThis.devicePixelRatio||1,2);if(!width||!height||!this.ctx)return;if(width!==this.width||height!==this.height||d!==this.dpr){this.width=width;this.height=height;this.dpr=d;this.canvas.width=Math.round(width*d);this.canvas.height=Math.round(height*d);this.dirty=true}if(!this.dirty)return;const c=this.ctx;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,width,height);drawBrain2D(c,8,26,width-16,height-38,this.result?.elements);this.dirty=false}
 capture(){try{this.render();return this.canvas.toDataURL('image/png')}catch{return null}}
}
