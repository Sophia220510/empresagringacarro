const port = process.argv[2] || '9229'
const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://127.0.0.1:4173/')}`, { method:'PUT' }).then(response => response.json())
const socket = new WebSocket(target.webSocketDebuggerUrl)
const pending = new Map()
const issues = []
let id = 0
socket.addEventListener('message', ({data}) => {
  const message=JSON.parse(data)
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message.result); pending.delete(message.id) }
  if (message.method === 'Runtime.exceptionThrown') issues.push(message.params.exceptionDetails.text)
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') issues.push(message.params.entry.text)
})
await new Promise(resolve => socket.addEventListener('open',resolve,{once:true}))
const call=(method,params={})=>new Promise(resolve=>{const requestId=++id;pending.set(requestId,resolve);socket.send(JSON.stringify({id:requestId,method,params}))})
const evaluate=async expression=>(await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result.value
await call('Runtime.enable');await call('Log.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
await call('Page.navigate',{url:'http://127.0.0.1:4173/'});await new Promise(resolve=>setTimeout(resolve,2200))

const navigation=await evaluate(`(async()=>{const out=[];for(const link of document.querySelectorAll('header nav a')){link.click();await new Promise(r=>setTimeout(r,450));const target=document.querySelector(link.hash);out.push({href:link.hash,delta:Math.round(target.getBoundingClientRect().top),active:link.classList.contains('active')})}return out})()`)
const links=await evaluate(`[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter((href,index,all)=>all.indexOf(href)===index).map(href=>({href,exists:Boolean(document.querySelector(href))}))`)
const images=await evaluate(`[...document.images].map(img=>({src:img.getAttribute('src'),complete:img.complete,width:img.naturalWidth})).filter(img=>img.complete&&img.width===0)`)
const comparator=await evaluate(`(()=>{const input=document.querySelector('.compare input');input.value='72';input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));return {value:input.value,label:input.getAttribute('aria-label')}})()`)
const form=await evaluate(`(async()=>{const form=document.querySelector('.estimate-form');const initial=form.checkValidity();const input=form.querySelector('#photos');const transfer=new DataTransfer();transfer.items.add(new File(['image'], 'damage.jpg', {type:'image/jpeg'}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,80));const previews=form.querySelectorAll('.file-previews figure').length;for(const field of form.querySelectorAll('[required]')){if(field.type==='checkbox')field.checked=true;else if(field.tagName==='SELECT')field.value='Collision damage';else if(field.type==='email')field.value='test@example.com';else if(field.type==='tel')field.value='5551234567';else if(field.id==='zip')field.value='10001';else field.value='Test value'}const filled=form.checkValidity();form.dispatchEvent(new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:form.querySelector('.submit')}));await new Promise(r=>setTimeout(r,100));return{initial,filled,previews,status:document.querySelector('.form-status')?.textContent}})()`)
const reverse3D=await evaluate(`(async()=>{const repair=document.querySelector('#repair');const travel=repair.offsetHeight-innerHeight;scrollTo(0,repair.offsetTop+travel*.96);await new Promise(r=>setTimeout(r,160));const end=document.querySelector('.repair-status span').textContent;scrollTo(0,repair.offsetTop+travel*.02);await new Promise(r=>setTimeout(r,160));const start=document.querySelector('.repair-status span').textContent;return{end,start}})()`)
await evaluate(`sessionStorage.removeItem('blackline-intro-v2')`);await call('Page.reload');await new Promise(r=>setTimeout(r,350));const introDuring=await evaluate(`Boolean(document.querySelector('.intro'))`);await new Promise(r=>setTimeout(r,1450));const introAfter=await evaluate(`({visible:Boolean(document.querySelector('.intro')),locked:document.documentElement.classList.contains('intro-active')})`);await call('Page.reload');await new Promise(r=>setTimeout(r,180));const introCached=await evaluate(`Boolean(document.querySelector('.intro'))`)
const fastScroll=await evaluate(`(async()=>{scrollTo(0,document.documentElement.scrollHeight);await new Promise(r=>setTimeout(r,120));const bottom=scrollY;scrollTo(0,0);await new Promise(r=>setTimeout(r,120));return{bottom,top:scrollY,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,canvas:Boolean(document.querySelector('.car-canvas canvas'))}})()`)
console.log(JSON.stringify({navigation,links,brokenImages:images,comparator,form,reverse3D,intro:{during:introDuring,after:introAfter,cached:introCached},fastScroll,issues},null,2))
socket.close()
