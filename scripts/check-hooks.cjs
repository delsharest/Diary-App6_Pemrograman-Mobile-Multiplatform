const fs=require('fs'), vm=require('vm'), assert=require('node:assert/strict');
const ts=require(process.cwd()+'/node_modules/typescript');
function runner(file, name) {
 let slots=[], index=0, effects=[], pending=[], timers=new Map(), tid=0;
 const same=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 const react={
  useState(init){let i=index++;if(!(i in slots)) slots[i]=typeof init==='function'?init():init;return [slots[i],v=>slots[i]=typeof v==='function'?v(slots[i]):v];},
  useMemo(fn,deps){let i=index++;if(!slots[i]||!same(slots[i].deps,deps)) slots[i]={deps,value:fn()};return slots[i].value;},
  useCallback(fn,deps){return react.useMemo(()=>fn,deps);},
  useEffect(fn,deps){let i=index++;if(!effects[i]||!same(effects[i].deps,deps)){pending.push(()=>{effects[i]?.cleanup?.();effects[i]={deps,cleanup:fn()};});}},
 };
 const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React}}).outputText;
 const context={exports:{},require:n=>{if(n==='react') return react;throw Error(n)},setTimeout:fn=>{timers.set(++tid,fn);return tid;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(source,context);
 return {render(...args){index=0;let result=context.exports[name](...args);pending.splice(0).forEach(fn=>fn());return result;},tick(){let tasks=[...timers.values()];timers.clear();tasks.forEach(fn=>fn());},get timers(){return timers.size},unmount(){effects.forEach(e=>e?.cleanup?.());}};
}
const entries=[{id:1,title:'Kuliah React',preview:'Belajar',date:'2026-11-04',mood:'😊'},{id:2,title:'Kuliah pagi',preview:'Diskusi',date:'2026-11-03',mood:'😴'},{id:3,title:'Jalan sore',preview:'Santai',date:'2026-11-02',mood:'😊'}];
const ids=r=>Array.from(r.filteredEntries,e=>e.id);
const r=runner('src/hooks/useDiarySearch.ts','useDiarySearch');
let out=r.render(entries,'');assert.deepEqual(ids(out),[1,2,3]);
out.setQuery('KULIAH');out=r.render(entries,'😊');assert.deepEqual(ids(out),[1,3]);assert.equal(r.timers,1);
r.tick();out=r.render(entries,'😊');assert.deepEqual(ids(out),[1]);
out=r.render(entries,'😴');assert.deepEqual(ids(out),[2]);
out.setQuery('nothing');r.render(entries,'😴');out.setQuery('sore');out=r.render(entries,'😴');assert.equal(r.timers,1);
out.resetSearch();out=r.render(entries,'');assert.deepEqual(ids(out),[1,2,3]);r.tick();out=r.render(entries,'');assert.deepEqual(ids(out),[1,2,3]);
out.setQuery('sore');r.render(entries,'');r.unmount();assert.equal(r.timers,0);
const fav=runner('src/hooks/useLikedEntries.ts','useLikedEntries');
assert.deepEqual(Array.from(fav.render(entries,new Set())),[]);
assert.deepEqual(Array.from(fav.render(entries,new Set([1,3])),e=>e.id),[1,3]);
assert.deepEqual(Array.from(fav.render(entries,new Set([3])),e=>e.id),[3]);
assert.deepEqual(Array.from(fav.render(entries.slice(0,2),new Set([3]))),[]);
console.log('PASS: mood + query, case-insensitive search, debounce cleanup, immediate reset with pending timer, unmount cleanup, favorites add/remove and changed entries.');
