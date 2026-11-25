import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {BrainView,ELEMENT_EMOJI} from '../js/brain3d.js';

function fixture(){
 const glyphs=[];
 const ctx=new Proxy({fillText(text,x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));glyphs.push(text)}},{get(o,k){return k in o?o[k]:()=>{}},set(o,k,v){o[k]=v;return true}});
 globalThis.document={hidden:false,createElement(){return{style:{},dataset:{},setAttribute(){},addEventListener(){},remove(){},getContext(){return ctx},toDataURL(){return'data:image/png;base64,AA=='}}}};
 globalThis.devicePixelRatio=1;
 const root={dataset:{},append(){},addEventListener(){},remove(){},getBoundingClientRect(){return{width:390,height:320}}};
 class Renderer{setClearColor(){}setPixelRatio(){}setSize(){}render(){this.frames=(this.frames||0)+1}dispose(){this.disposed=true}}
 const view=new BrainView(root);view.init3D({...THREE,WebGLRenderer:Renderer});return{view,glyphs};
}
const result=id=>({elements:[{id,percent:100}]});
test('all twenty diagnosis elements have a glyph; 3D glyph textures are reused and released',()=>{
 const{view,glyphs}=fixture();assert.equal(ELEMENT_EMOJI.length,20);assert.equal(new Set(ELEMENT_EMOJI).size,20);assert.equal(view.emojiSprites.length,14);assert.equal(view.emojiGroup.visible,false);
 for(let id=1;id<=20;id++){view.setResult(result(id));assert.equal(view.emojiGroup.visible,true);assert.ok(view.emojiSprites.every(sprite=>sprite.material.map===view.emojiTextures.get(id)))}
 assert.deepEqual(glyphs,ELEMENT_EMOJI);const count=view.resources.length;
 for(let n=0;n<100;n++)view.setResult(result(n%20+1));assert.equal(view.resources.length,count);assert.equal(view.emojiTextures.size,20);
 const texture=view.emojiTextures.get(3);let disposed=false;texture.addEventListener('dispose',()=>disposed=true);view.setResult(null);assert.equal(view.emojiGroup.visible,false);view.dispose();assert.equal(disposed,true);assert.equal(view.emojiTextures.size,0);
});
test('result burst settles, reduced motion suppresses burst and glyphs stay result-only',()=>{
 const{view}=fixture();view.setResult(result(20));view.configure('result');view.triggerReveal(10);view.render(10.4);assert.ok(view.group.scale.x>1);assert.ok(view.uniforms.uBurst.value>0);assert.equal(view.emojiGroup.visible,true);
 view.render(12);assert.equal(view.group.scale.x,1);assert.equal(view.uniforms.uBurst.value,0);
 view.configure('result',1,true);view.triggerReveal(13);view.render(13.4);assert.equal(view.group.scale.x,1);assert.equal(view.uniforms.uBurst.value,0);
 view.configure('scan',.5,false);view.render(14);assert.equal(view.emojiGroup.visible,false);view.dispose();
});
test('Canvas fallback and exported snapshot include result glyphs without adding canvases',()=>{
 const{view,glyphs}=fixture();view.setResult(result(3));view.fallback();glyphs.length=0;view.configure('result',1,true);view.render(20);assert.ok(glyphs.length>0);assert.ok(glyphs.every(g=>g==='💰'));assert.match(view.capture(),/^data:image\/png/);
 glyphs.length=0;view.configure('title',0,true);view.render(21);assert.equal(glyphs.length,0);view.dispose();
});
