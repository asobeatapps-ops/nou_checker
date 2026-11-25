import {ELEMENTS,TITLES,PATTERNS} from './data.js?v=1.0.5';
export const ALGORITHM_VERSION='brain-v2-fnv1a-avalanche-mulberry32';
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ja',{granularity:'grapheme'}):null;
export function graphemes(text){if(segmenter)return Array.from(segmenter.segment(text),s=>s.segment);const out=[];let join=false,regional=0;for(const c of Array.from(text)){const mark=/[\p{M}\uFE0F\u{1F3FB}-\u{1F3FF}]/u.test(c),flag=/[\u{1F1E6}-\u{1F1FF}]/u.test(c);if(out.length&&(join||mark||c==='\u200d'||flag&&regional%2))out[out.length-1]+=c;else out.push(c);join=c==='\u200d';regional=flag?regional+1:0}return out}
export function normalizeName(raw){if(typeof raw!=='string')throw Error('名前を入力してください。');const clean=raw.replace(/[\t\n\r\f\v]/g,' ').replace(/[\p{Cc}\u202A-\u202E\u2066-\u2069\u200B\uFEFF]/gu,'').trim(),normalized=clean.normalize('NFKC').replace(/\s+/gu,' ').toLowerCase();if(!normalized||!/[\p{L}\p{N}\p{P}\p{S}\p{M}]/u.test(normalized))throw Error('名前を入力してください。');if(graphemes(clean).length>24||graphemes(normalized).length>24)throw Error('名前は24文字以内で入力してください。');return{displayName:clean,normalized}}
export function hashName(text){let h=0x811c9dc5;for(const b of new TextEncoder().encode(ALGORITHM_VERSION+'\0'+text)){h^=b;h=Math.imul(h,0x01000193)}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);return(h^(h>>>16))>>>0}
export function seeded(seed){let a=seed>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
function shuffle(a,r){a=[...a];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]]}return a}
export function partition(total,n,r,min=1,max=total){if(total<n*min||total>n*max)throw Error('Invalid integer allocation');const a=[];for(let i=0;i<n;i++){const left=n-i-1,lo=Math.max(min,total-left*max),hi=Math.min(max,total-left*min),v=int(r,lo,hi);a.push(v);total-=v}return shuffle(a,r)}
export function patternFor(v){if(v<0||v>=1)throw Error('PRNG range');return PATTERNS[v<.3?0:v<.6?1:v<.8?2:v<.95?3:4]}
const PAIRS=[[1,2,21],[5,7,22],[3,14,23],[9,7,24],[3,4,25],[18,14,26],[12,11,28]];
export function titleFor(pattern,parts){const first=parts[0];if(pattern==='pure'&&first.id===20)return TITLES[29];if(pattern==='bipolar'){for(const[a,b,id]of PAIRS)if(parts.slice(0,2).some(p=>p.id===a)&&parts.slice(0,2).some(p=>p.id===b)&&(id!==25||parts.find(p=>p.id===3).percent>=parts.find(p=>p.id===4).percent))return TITLES[id-1]}if(pattern==='balanced'){if(parts.length===7)return TITLES[26];if(parts[0].percent-parts.at(-1).percent<=5)return TITLES[28]}return TITLES[ELEMENTS[first.id-1].titleId-1]}
export function diagnose(raw){const{displayName,normalized}=normalizeName(raw),r=seeded(hashName(normalized)),pattern=patternFor(r());let ids=shuffle(ELEMENTS.map(e=>e.id),r),values;
 if(pattern.id==='balanced'){const n=int(r,4,7);if(n<7&&r()<.20){values=Array.from({length:n},(_,i)=>Math.floor(100/n)+(i<100%n?1:0))}else values=partition(100,n,r,1,35);ids=ids.slice(0,n)}
 if(pattern.id==='biased'){const n=int(r,3,6),v=int(r,51,79);values=[v,...partition(100-v,n-1,r)];ids=ids.slice(0,n)}
 if(pattern.id==='bipolar'){const special=r()<.35,pair=special?PAIRS[int(r,0,6)]:null;if(pair)ids=[pair[0],pair[1],...ids.filter(id=>!pair.slice(0,2).includes(id))];const n=int(r,2,5);if(n===2)values=[50,50];else{const sum=int(r,72,Math.min(98,100-(n-2))),a=int(r,Math.max(30,sum-50),Math.min(50,sum-30)),b=sum-a;values=[a,b,...partition(100-sum,n-2,r,1,Math.min(a,b)-1)]}if(pair?.[2]===25&&values[0]<values[1])[values[0],values[1]]=[values[1],values[0]];ids=ids.slice(0,n)}
 if(pattern.id==='extreme'){const v=int(r,80,99),n=int(r,2,Math.min(5,101-v));values=[v,...partition(100-v,n-1,r)];ids=ids.slice(0,n)}
 if(pattern.id==='pure'){ids=ids.slice(0,1);values=[100]}
 const elements=ids.map((id,i)=>Object.freeze({id,percent:values[i]})).sort((a,b)=>b.percent-a.percent||a.id-b.id),title=titleFor(pattern.id,elements);
 return Object.freeze({algorithmVersion:ALGORITHM_VERSION,displayName,patternId:pattern.id,rarity:pattern.rarity,elements:Object.freeze(elements),titleId:title.id,comment:title.comment})
}
