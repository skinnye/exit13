import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'http://127.0.0.1:5180/'
const OUT = 'C:/Temp/exit13'
mkdirSync(OUT, { recursive: true })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const autoScroll = (page) =>
  page.evaluate(
    () =>
      new Promise((res) => {
        let y = 0
        const t = setInterval(() => {
          window.scrollTo(0, y)
          y += 500
          if (y >= document.body.scrollHeight) {
            clearInterval(t)
            window.scrollTo(0, 0)
            res()
          }
        }, 60)
      }),
  )

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  protocolTimeout: 60000,
  args: ['--no-sandbox', '--hide-scrollbars', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
console.log('launched')
const page = await browser.newPage()
page.setDefaultNavigationTimeout(30000)

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'domcontentloaded' })
console.log('loaded')
await wait(2800)
const webgl = await page.evaluate(() => {
  const c = document.createElement('canvas')
  return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
})
console.log('WebGL:', webgl)
await page.screenshot({ path: `${OUT}/hero.png` })
console.log('hero OK')

await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await wait(1500)
await autoScroll(page)
await wait(600)
await page.screenshot({ path: `${OUT}/desktop.png`, fullPage: true })
console.log('desktop OK')

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
await page.goto(URL, { waitUntil: 'domcontentloaded' })
await wait(1200)
await autoScroll(page)
await wait(600)
await page.screenshot({ path: `${OUT}/mobile.png`, fullPage: true })
console.log('mobile OK')

await browser.close()
console.log('DONE')
