export const STORAGE_KEY='asobeat_brain_checker_v1';
export function sanitize(raw){const o=raw&&typeof raw==='object'?raw:{},s=o.settings&&typeof o.settings==='object'?o.settings:{};return{schemaVersion:1,titles:[...new Set(Array.isArray(o.titles)?o.titles.filter(id=>Number.isInteger(id)&&id>=1&&id<=30):[])].sort((a,b)=>a-b),settings:{sound:typeof s.sound==='boolean'?s.sound:true,reduced:typeof s.reduced==='boolean'?s.reduced:false}}}
export class Collection{
 constructor(storage){this.storage=storage;this.failed=false;try{this.data=sanitize(JSON.parse(storage.getItem(STORAGE_KEY)||'{}'))}catch{this.failed=true;this.data=sanitize({})}}
 persist(){try{this.storage.setItem(STORAGE_KEY,JSON.stringify(this.data));this.failed=false}catch{this.failed=true}}
 unlock(id){if(!Number.isInteger(id)||id<1||id>30)throw Error('Invalid title');const before=this.data.titles.length,fresh=!this.data.titles.includes(id);if(fresh){this.data.titles.push(id);this.data.titles.sort((a,b)=>a-b);this.persist()}return{fresh,complete:fresh&&before===29&&this.data.titles.length===30}}
 setting(key,value){if(!['sound','reduced'].includes(key)||typeof value!=='boolean')return;this.data.settings[key]=value;this.persist()}
 reset(){this.data.titles=[];this.persist()}
}
