const tones={button:[550,.035],auth:[780,.08],activate:[130,.16],formation:[440,.2],scan:[620,.1],desire:[830,.12],final:[990,.16],count:[660,.025],release:[80,.3],new:[1040,.12]};
export class AudioSystem{
 constructor(enabled=true){this.enabled=enabled;this.ctx=null;this.voices=new Set();this.bgm=false;this.nextBeat=0;this.beat=0}
 async unlock(){if(!this.enabled)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx??=new C();if(this.ctx.state==='suspended')await this.ctx.resume()}catch{}}
 tone(freq,duration=.1,type='sine',volume=.055,delay=0){if(!this.enabled||!this.ctx||this.ctx.state!=='running')return;const c=this.ctx,o=c.createOscillator(),g=c.createGain(),at=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.008);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(c.destination);const v={o,g};this.voices.add(v);o.onended=()=>{o.disconnect();g.disconnect();this.voices.delete(v)};o.start(at);o.stop(at+duration+.01)}
 cue(name){const p=tones[name]||tones.button;this.tone(...p);if(name==='release'){this.tone(640,.24,'sine',.055,.04);this.tone(960,.18,'sine',.035,.1)}if(name==='new'){this.tone(1318,.18,'sine',.04,.1);this.tone(1568,.22,'sine',.035,.2)}}
 startBgm(){if(!this.enabled||!this.ctx)return;this.bgm=true;this.nextBeat=this.ctx.currentTime;this.beat=0}
 tick(){if(!this.bgm||!this.enabled||!this.ctx||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(now-this.nextBeat>.5)this.nextBeat=now;while(this.nextBeat<now+.1){const offset=Math.max(0,this.nextBeat-now),notes=[146.83,220,293.66,349.23,293.66,220,440,349.23];this.tone(notes[this.beat%8],.14,'triangle',.027,offset);if(this.beat%4===0)this.tone(55,.18,'sine',.05,offset);this.beat++;this.nextBeat+=.19}}
 stopAll(){this.bgm=false;for(const{o,g}of this.voices){try{o.stop()}catch{}o.disconnect();g.disconnect()}this.voices.clear()}
 setEnabled(value){this.enabled=value;if(!value)this.stopAll()}
 fanfare(){if(!this.enabled)return;[523.25,659.25,783.99,1046.5].forEach((f,i)=>this.tone(f,.35,'triangle',.045,i*.13))}
}
