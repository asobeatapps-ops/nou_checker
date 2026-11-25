import {TITLES} from './data.js?v=1.0.6';
export const STORAGE_KEY='asobeat_brain_checker_v1';
const RARITY_ORDER=Object.freeze(['NORMAL','RARE','CRITICAL','LEGENDARY']);
export function sanitize(raw){const o=raw&&typeof raw==='object'?raw:{},s=o.settings&&typeof o.settings==='object'?o.settings:{};const data={schemaVersion:1,titles:[...new Set(Array.isArray(o.titles)?o.titles.filter(id=>Number.isInteger(id)&&id>=1&&id<=TITLES.length):[])].sort((a,b)=>a-b),settings:{sound:typeof s.sound==='boolean'?s.sound:true,reduced:typeof s.reduced==='boolean'?s.reduced:false}};if(o.rarityByTitle&&typeof o.rarityByTitle==='object'){data.rarityByTitle={};for(const id of data.titles){const rarity=o.rarityByTitle[id];if(RARITY_ORDER.includes(rarity))data.rarityByTitle[id]=rarity}}return data}
export class Collection{
 constructor(storage){this.storage=storage;this.failed=false;try{this.data=sanitize(JSON.parse(storage.getItem(STORAGE_KEY)||'{}'))}catch{this.failed=true;this.data=sanitize({})}}
 persist(){try{this.storage.setItem(STORAGE_KEY,JSON.stringify(this.data));this.failed=false}catch{this.failed=true}}
 unlock(id,rarity){if(!Number.isInteger(id)||id<1||id>TITLES.length)throw Error('Invalid title');const before=this.data.titles.length,fresh=!this.data.titles.includes(id);let changed=fresh;if(fresh){this.data.titles.push(id);this.data.titles.sort((a,b)=>a-b)}if(RARITY_ORDER.includes(rarity)){const records=this.data.rarityByTitle||(this.data.rarityByTitle={});if(RARITY_ORDER.indexOf(rarity)>RARITY_ORDER.indexOf(records[id])){records[id]=rarity;changed=true}}if(changed)this.persist();return{fresh,complete:fresh&&before===TITLES.length-1&&this.data.titles.length===TITLES.length}}
 setting(key,value){if(!['sound','reduced'].includes(key)||typeof value!=='boolean')return;this.data.settings[key]=value;this.persist()}
 reset(){this.data.titles=[];delete this.data.rarityByTitle;this.persist()}
}
