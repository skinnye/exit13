import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'https://skinnye.github.io/exit13/'
const OUT = 'C:/Temp/exit13'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
const bad = []
page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`) })
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const resp = await page.goto(URL, { waitUntil: 'load', timeout: 45000 })
console.log('PAGE', resp.status())
await wait(2500)
await page.evaluate(async () => { await new Promise((res)=>{let y=0;const t=setInterval(()=>{window.scrollTo(0,y);y+=600;if(y>=document.body.scrollHeight){clearInterval(t);window.scrollTo(0,0);res()}},60)}) })
await wait(2000)
const broken = await page.evaluate(() => [...document.images].filter((i)=>!i.complete||i.naturalWidth===0).map((i)=>i.currentSrc))
console.log('broken images:', broken.length, broken.slice(0,6).join(' | '))
console.log('bad responses:', bad.slice(0,8).join(' | ') || '(none)')
await page.screenshot({ path: `${OUT}/live.png` })
await browser.close()
console.log('DONE')
