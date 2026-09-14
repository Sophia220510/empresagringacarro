import fs from 'node:fs'

const [, , port = '9229', width = '1440', height = '1000', output = 'visual-check.png', anchor = '#repair', progress = '0'] = process.argv
const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`http://127.0.0.1:4173/${anchor}`)}`, { method: 'PUT' }).then((response) => response.json())
const socket = new WebSocket(target.webSocketDebuggerUrl)
const pending = new Map()
const issues = []
let id = 0

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result)
    pending.delete(message.id)
  }
  if (message.method === 'Runtime.exceptionThrown') issues.push(message.params.exceptionDetails.text)
  if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params.entry.level)) issues.push(message.params.entry.text)
})

await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }))
const call = (method, params = {}) => new Promise((resolve) => {
  const requestId = ++id
  pending.set(requestId, resolve)
  socket.send(JSON.stringify({ id: requestId, method, params }))
})

await call('Runtime.enable')
await call('Log.enable')
await call('Page.enable')
await call('Emulation.setDeviceMetricsOverride', { width: Number(width), height: Number(height), deviceScaleFactor: 1, mobile: Number(width) < 700 })
await call('Page.navigate', { url: 'http://127.0.0.1:4173/' })
await new Promise((resolve) => setTimeout(resolve, 3000))
await call('Runtime.evaluate', { expression: `(() => { const el = document.querySelector('${anchor}'); if (el) scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * ${Number(progress)}) })()` })
await new Promise((resolve) => setTimeout(resolve, 5000))
const screenshot = await call('Page.captureScreenshot', { format: 'png', fromSurface: true })
fs.writeFileSync(output, Buffer.from(screenshot.data, 'base64'))
const overflow = await call('Runtime.evaluate', { expression: 'document.documentElement.scrollWidth - document.documentElement.clientWidth', returnByValue: true })
console.log(JSON.stringify({ output, overflow: overflow.result.value, issues }, null, 2))
socket.close()
