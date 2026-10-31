const {chromium}=require('playwright');const fs=require('fs');const {execSync}=require('child_process');
const pages=['/','/produits','/produits/lavande-vraie','/produits/synergie-insomnie','/services','/a-propos','/avis','/consultation','/contact','/commande','/confidentialite','/mentions-legales'];
(async()=>{const b=await chromium.launch();const p=await b.newPage();let out='';
for(const u of pages){await p.goto('http://localhost:3000'+u,{waitUntil:'networkidle'});
 const d=await p.evaluate(()=>{const m=n=>document.querySelector(`meta[name="${n}"]`)?.content||document.querySelector(`meta[property="${n}"]`)?.content||'';
  return {title:document.title,desc:m('description'),canon:document.querySelector('link[rel=canonical]')?.href||'',robots:m('robots'),ogt:m('og:title'),ogi:m('og:image'),ogu:m('og:url'),tw:m('twitter:card'),lang:document.documentElement.lang,
   h1:[...document.querySelectorAll('h1')].map(h=>h.textContent.trim()),h2:document.querySelectorAll('h2').length,
   imgNoAlt:[...document.querySelectorAll('img')].filter(i=>!i.alt).length,imgs:document.querySelectorAll('img').length,
   jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)['@type']}catch(e){return 'ERR'}}),
   links:document.querySelectorAll('a').length,words:document.body.innerText.split(/\s+/).length,favicon:!!document.querySelector('link[rel*=icon]'),
   hreflang:document.querySelectorAll('link[hreflang]').length}});
 out+=`\n### ${u}\n${JSON.stringify(d)}\n`;}
for(const f of ['/sitemap.xml','/robots.txt','/favicon.ico','/manifest.webmanifest','/opengraph-image']){const r=await p.goto('http://localhost:3000'+f).catch(()=>null);const t=r?await r.text():'';out+=`\n### ${f} [${r?r.status():'ERR'}]\n${t.slice(0,700)}\n`;}
await b.close();
const chrome=require('playwright').chromium.executablePath();
for(const u of ['/','/produits','/produits/lavande-vraie']){
 try{execSync(`npx -y lighthouse@12 http://localhost:3000${u} --quiet --output=json --output-path=/tmp/lh.json --chrome-flags="--headless=new --no-sandbox"`,{env:{...process.env,CHROME_PATH:chrome},stdio:'ignore',timeout:240000});
  const j=JSON.parse(fs.readFileSync('/tmp/lh.json'));out+=`\n### LIGHTHOUSE mobile ${u}\n`;
  for(const k in j.categories)out+=`${k}=${Math.round(j.categories[k].score*100)} `;
  out+='\n';for(const a of Object.values(j.audits)){if(a.score!==null&&a.score<0.9&&a.scoreDisplayMode!=='informative'&&a.scoreDisplayMode!=='notApplicable')out+=`- ${a.id} (${a.score}) ${a.displayValue||''}\n`;}
  for(const k of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','total-byte-weight'])out+=`  ${k}: ${j.audits[k].displayValue}\n`;
 }catch(e){out+=`\nLH FAIL ${u} ${e.message.slice(0,200)}\n`}}
fs.writeFileSync('out/seo.txt',out);})();
