export function effectiveReduced(saved,media){return!!saved||!!media.matches}
export function bindSettings({store,soundToggle,motionToggle,onChange,onReset}){
 soundToggle.checked=store.data.settings.sound;motionToggle.checked=store.data.settings.reduced;
 soundToggle.addEventListener('change',()=>{store.setting('sound',soundToggle.checked);onChange()});motionToggle.addEventListener('change',()=>{store.setting('reduced',motionToggle.checked);onChange()});
 document.querySelector('#resetCollection').addEventListener('click',onReset);
}
