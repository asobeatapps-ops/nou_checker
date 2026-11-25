export const PHASES=Object.freeze([
 {at:0,id:'activate',label:'SYSTEM ACTIVATED',text:'被験者を認証しています',progress:0},
 {at:500,id:'formation',label:'NEURAL CONNECTION',text:'ニューロンを接続しています',progress:10},
 {at:1500,id:'scan',label:'BRAIN SCANNING',text:'思考の深層をスキャン中',progress:30},
 {at:2500,id:'desire',label:'DESIRE DETECTED',text:'欲望反応を検出しました',progress:50},
 {at:3500,id:'final',label:'FINAL ANALYSIS',text:'最終解析。まもなく解放します',progress:99},
 {at:4200,id:'silence',label:'AWAITING RELEASE',text:'解析結果を解放します',progress:99},
 {at:4400,id:'release',label:'SCAN COMPLETE',text:'解析完了',progress:100}
].map(Object.freeze));
export function phaseAt(ms){return [...PHASES].reverse().find(p=>ms>=p.at)||PHASES[0]}
export class ScanSession{
 constructor(onFinish){this.onFinish=onFinish;this.serial=0;this.mode='idle'}
 start(result,now){this.serial++;this.result=result;this.elapsed=0;this.last=now;this.paused=false;this.mode='scan';return this.serial}
 tick(now){if(this.mode!=='scan'||this.paused)return;this.elapsed+=Math.max(0,now-this.last);this.last=now;if(this.elapsed>=5000)this.finish(false,this.serial)}
 finish(skipped=false,serial=this.serial){if(this.mode!=='scan'||serial!==this.serial)return false;this.mode='result';this.paused=false;this.onFinish(this.result,{skipped,serial});return true}
 pause(now){if(this.mode!=='scan')return;this.tick(now);if(this.mode==='scan')this.paused=true}
 resume(now){this.last=now;this.paused=false}
 cancel(){this.serial++;this.mode='idle';this.paused=false;this.result=null;this.elapsed=0}
}
