import {TITLES} from './data.js?v=1.1.0';
export const STORAGE_KEY='asobeat_brain_checker_v1';
const RARITY_ORDER=Object.freeze(['NORMAL','RARE','EPIC','LEGENDARY']);
export function sanitize(raw){
 const o=raw&&typeof raw==='object'?raw:{},s=o.settings&&typeof o.settings==='object'?o.settings:{},legacy=o.schemaVersion!==2;
 const mapId=id=>Number.isInteger(id)?legacy?(id>=1&&id<=20?id:id===31?21:null):(id>=1&&id<=TITLES.length?id:null):null;
 const data={schemaVersion:2,titles:[...new Set((Array.isArray(o.titles)?o.titles:[]).map(mapId).filter(id=>id!==null))].sort((a,b)=>a-b),settings:{sound:typeof s.sound==='boolean'?s.sound:true,reduced:typeof s.reduced==='boolean'?s.reduced:false}};
 if(o.rarityByTitle&&typeof o.rarityByTitle==='object'){data.rarityByTitle={};for(const[key,value]of Object.entries(o.rarityByTitle)){const id=mapId(Number(key)),rarity=value==='CRITICAL'?'EPIC':value;if(id!==null&&data.titles.includes(id)&&RARITY_ORDER.includes(rarity))data.rarityByTitle[id]=rarity}}
 return data
}
export class Collection{
 constructor(storage){this.storage=storage;this.failed=false;try{this.data=sanitize(JSON.parse(storage.getItem(STORAGE_KEY)||'{}'))}catch{this.failed=true;this.data=sanitize({})}}
 persist(){try{this.storage.setItem(STORAGE_KEY,JSON.stringify(this.data));this.failed=false}catch{this.failed=true}}
 unlock(id,rarity){if(!Number.isInteger(id)||id<1||id>TITLES.length)throw Error('Invalid title');const before=this.data.titles.length,fresh=!this.data.titles.includes(id);let changed=fresh;if(fresh){this.data.titles.push(id);this.data.titles.sort((a,b)=>a-b)}if(RARITY_ORDER.includes(rarity)){const records=this.data.rarityByTitle||(this.data.rarityByTitle={});if(RARITY_ORDER.indexOf(rarity)>RARITY_ORDER.indexOf(records[id])){records[id]=rarity;changed=true}}if(changed)this.persist();return{fresh,complete:fresh&&before===TITLES.length-1&&this.data.titles.length===TITLES.length}}
 setting(key,value){if(!['sound','reduced'].includes(key)||typeof value!=='boolean')return;this.data.settings[key]=value;this.persist()}
 reset(){this.data.titles=[];delete this.data.rarityByTitle;this.persist()}
}
