const {chromium}=require('playwright');const fs=require('fs');const {execSync}=require('child_process');
const ids=fs.readFileSync(process.argv[2],'utf8').split('\n').map(s=>s.trim()).filter(Boolean);
(async()=>{const b=await chromium.launch();const p=await b.newPage({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'});
let log='';
for(const id of ids){try{
  await p.goto('https://unsplash.com/photos/'+id,{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForSelector('meta[property="og:image"]',{state:'attached',timeout:60000});
  let u=await p.$eval('meta[property="og:image"]',m=>m.content);
  u=u.split('?')[0]+'?w=1600&q=80&fm=jpg';
  execSync(`curl -sSL -o /tmp/a/${id}.jpg "${u}"`);log+=id+' '+u+'\n';
}catch(e){log+=id+' FAIL '+e.message.split('\n')[0]+'\n';}}
fs.writeFileSync('/tmp/a/log.txt',log);await b.close();})();
