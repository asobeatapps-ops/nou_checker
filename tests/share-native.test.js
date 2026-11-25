import test from 'node:test';
import assert from 'node:assert/strict';
import {PreparedShareImage,nativeShare} from '../js/share.js';
import {diagnose} from '../js/diagnosis.js';

test('prepared image is bounded, matches result/privacy and ignores stale generation',async()=>{
 const cache=new PreparedShareImage(),result=diagnose('秘密の名前');let release;
 const old=cache.prepare(result,false,()=>new Promise(resolve=>release=resolve));
 const current=new Blob(['named'],{type:'image/png'});await cache.prepare(result,true,async()=>current);
 release(new Blob(['old']));assert.equal(await old,false);assert.equal(cache.get(result,false),null);assert.equal(cache.get(result,true),current);assert.equal(cache.get(diagnose('秘密の名前'),true),null);
 cache.clear();assert.equal(cache.get(result,true),null);await cache.prepare(result,false,async()=>{throw Error('failed')});assert.equal(cache.get(result,false),null);
});
test('native image sharing passes PNG plus text, respects privacy and treats cancellation normally',async()=>{
 const result=diagnose('秘密の名前'),blob=new Blob(['png'],{type:'image/png'});let payload;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{canShare:({files})=>files[0].type==='image/png',share(data){payload=data;return Promise.resolve()}}});
 assert.deepEqual(await nativeShare(blob,result),{supported:true,cancelled:false});assert.equal(payload.files[0].name,'brain-checker-square.png');assert.equal(await payload.files[0].text(),'png');assert.ok(!payload.text.includes(result.displayName));
 await nativeShare(blob,result,{includeName:true});assert.ok(payload.text.includes(result.displayName));
 navigator.share=()=>Promise.reject(new DOMException('Cancelled','AbortError'));assert.deepEqual(await nativeShare(blob,result),{supported:true,cancelled:true});
 navigator.canShare=()=>false;assert.deepEqual(await nativeShare(blob,result),{supported:false});
 navigator.canShare=()=>true;navigator.share=()=>Promise.reject(new DOMException('Denied','NotAllowedError'));await assert.rejects(()=>nativeShare(blob,result),{name:'NotAllowedError'});
 delete globalThis.navigator;
});
