const {chromium,devices}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({...devices['Moto G4']});const p=await ctx.newPage();
await p.addInitScript(()=>{window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__ls.push({v:e.value,src:(e.sources||[]).map(s=>{const n=s.node;return n?(n.nodeName+'.'+(n.className||'')+' '+JSON.stringify(s.previousRect)+'->'+JSON.stringify(s.currentRect)):'?'})})}}).observe({type:'layout-shift',buffered:true});});
await p.goto('http://localhost:3000/produits',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
const ls=await p.evaluate(()=>window.__ls);fs.writeFileSync('out/seo.txt',JSON.stringify(ls,null,1));await b.close();})();
