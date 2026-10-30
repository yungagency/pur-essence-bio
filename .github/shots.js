const {chromium}=require('playwright');const fs=require('fs');
const pages=['/confidentialite','/','/produits','/produits/neroli','/produits/synergie-insomnie','/produits/argan','/produits/lavande-vraie','/services','/a-propos','/avis','/consultation','/contact','/mentions-legales','/admin/login','/page-inexistante'];
(async()=>{const b=await chromium.launch();let txt='';
for(const [n,w,h] of [['d',1366,900],['m',390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});
 const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push(e.message));
 for(const u of pages){errs.length=0;let st='?';try{const r=await p.goto('http://localhost:3000'+u,{waitUntil:'networkidle',timeout:30000});st=r.status();}catch(e){st='ERR '+e.message}
  await p.waitForTimeout(500);const f=n+u.replace(/\//g,'_')+'.jpg';await p.screenshot({path:'out/'+f,fullPage:true,type:'jpeg',quality:60});
  const broken=await p.$$eval('img',im=>im.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')));
  const ovf=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  txt+=`\n\n##### [${n}] ${u} [${st}] overflowX=${ovf} broken=${JSON.stringify(broken)} errors=${JSON.stringify(errs)}\n`;
  if(n==='d')txt+=(await p.innerText('body')).slice(0,5000);
 }}
fs.writeFileSync('out/text.txt',txt);await b.close();})();
