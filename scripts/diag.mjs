import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'http://127.0.0.1:5180/'
const OUT = 'C:/Temp/exit13'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  protocolTimeout: 60000,
  args: ['--no-sandbox', '--hide-scrollbars', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage()
const errs = []
page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()) })
page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message))
page.on('requestfailed', (r) => errs.push('REQFAIL: ' + (r.failure()?.errorText) + ' ' + r.url()))

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'load', timeout: 30000 })
await wait(5000)

const diag = await page.evaluate(() => {
  const root = document.getElementById('root')
  return {
    rootChildren: root ? root.childElementCount : -1,
    bodyText: document.body.innerText.slice(0, 120),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    hasCanvas: !!document.querySelector('canvas'),
    h1: document.querySelector('h1')?.innerText || null,
  }
})
console.log('DIAG:', JSON.stringify(diag, null, 2))
console.log('ERRORS:', errs.length ? errs.slice(0, 12).join('\n') : '(none)')
await page.screenshot({ path: `${OUT}/diag.png` })
await browser.close()
console.log('DONE')
