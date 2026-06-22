// EXIT 13 — бэкенд клубных карт Apple Wallet.
// Выпускает подписанные .pkpass, регистрирует устройства (PassKit Web Service)
// и шлёт push-обновления через APNs. Требует сертификат Pass Type ID (см. SETUP.md).
import express from 'express'
import cors from 'cors'
import http2 from 'node:http2'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'
import { PKPass } from 'passkit-generator'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const env = process.env
const PASS_TYPE_ID = env.PASS_TYPE_ID || 'pass.com.exit13.club'
const TEAM_ID = env.TEAM_ID || 'REPLACE_TEAM_ID'
const BASE_URL = env.BASE_URL || 'http://localhost:4000' // публичный URL этого бэкенда
const ADMIN_TOKEN = env.ADMIN_TOKEN || 'change-me'
const PORT = env.PORT || 4000

const certs = {
  wwdr: read(env.WWDR || 'certs/wwdr.pem'),
  signerCert: read(env.SIGNER_CERT || 'certs/signerCert.pem'),
  signerKey: read(env.SIGNER_KEY || 'certs/signerKey.pem'),
  signerKeyPassphrase: env.SIGNER_KEY_PASSPHRASE || '',
}

function read(p) {
  const abs = path.isAbsolute(p) ? p : path.join(__dirname, p)
  return fs.existsSync(abs) ? fs.readFileSync(abs) : null
}

// --- простое файловое хранилище ---
const DATA = path.join(__dirname, 'data')
fs.mkdirSync(DATA, { recursive: true })
const load = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f))) } catch { return {} } }
const save = (f, o) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(o, null, 2))
let members = load('members.json') // serial -> {name, phone, bday, number, bonus, level, authToken, updatedAt}
let regs = load('registrations.json') // serial -> { deviceId: pushToken }

// --- сборка подписанного .pkpass ---
async function buildPass(m) {
  if (!certs.signerCert || !certs.signerKey || !certs.wwdr) {
    throw new Error('Нет сертификатов — положи certs/ (см. SETUP.md)')
  }
  const pass = await PKPass.from(
    { model: path.join(__dirname, 'passModel'), certificates: certs },
    {
      serialNumber: m.serial,
      authenticationToken: m.authToken,
      webServiceURL: `${BASE_URL}/wallet`,
      passTypeIdentifier: PASS_TYPE_ID,
      teamIdentifier: TEAM_ID,
    },
  )
  pass.headerFields.push({ key: 'level', label: 'СТАТУС', value: m.level || 'MEMBER' })
  pass.primaryFields.push({ key: 'name', label: 'ДЕРЖАТЕЛЬ', value: m.name || '—' })
  pass.secondaryFields.push(
    { key: 'number', label: 'КАРТА №', value: m.number },
    { key: 'since', label: 'С НАМИ С', value: '2026' },
  )
  pass.auxiliaryFields.push({ key: 'bonus', label: 'БОНУСЫ', value: String(m.bonus ?? 0) })
  pass.backFields.push(
    { key: 'perks', label: 'Привилегии', value: '−15% на бар и кухню · проход без очереди · закрытые вечеринки · бонусы и подарок в день рождения' },
    { key: 'addr', label: 'Адрес', value: 'Екатеринбург, ул. 8 Марта, 13 (м. Площадь 1905 года)' },
    { key: 'tg', label: 'Telegram', value: 'https://t.me/exit13_ekb' },
  )
  pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: m.serial, messageEncoding: 'iso-8859-1', altText: m.number })
  return pass.getAsBuffer()
}

function sendPkpass(res, buf, filename = 'exit13.pkpass') {
  res.set('Content-Type', 'application/vnd.apple.pkpass')
  res.set('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(buf)
}

// --- APNs push (cert-based, HTTP/2) ---
function pushTo(token) {
  return new Promise((resolve) => {
    if (!certs.signerCert || !certs.signerKey) return resolve({ token, ok: false, err: 'no cert' })
    const client = http2.connect('https://api.push.apple.com', {
      cert: certs.signerCert,
      key: certs.signerKey,
      passphrase: certs.signerKeyPassphrase,
    })
    client.on('error', (e) => resolve({ token, ok: false, err: String(e) }))
    const req = client.request({
      ':method': 'POST',
      ':path': `/3/device/${token}`,
      'apns-topic': PASS_TYPE_ID,
      'apns-push-type': 'background',
      'apns-priority': '5',
      'content-type': 'application/json',
    })
    let status = 0
    req.on('response', (h) => { status = h[':status'] })
    req.setEncoding('utf8')
    let body = ''
    req.on('data', (d) => (body += d))
    req.on('end', () => { client.close(); resolve({ token, ok: status === 200, status, body }) })
    req.write(JSON.stringify({})) // для passes payload пустой
    req.end()
  })
}

async function pushSerial(serial) {
  const devs = regs[serial] || {}
  const results = []
  for (const token of Object.values(devs)) results.push(await pushTo(token))
  return results
}

// --- app ---
const app = express()
app.use(cors())
app.use(express.json())

const newMember = (name, phone, bday) => {
  const serial = crypto.randomUUID()
  const number = '13-' + String(Math.floor(Math.random() * 9000) + 1000) + '-' + String(Math.floor(Math.random() * 9000) + 1000)
  const m = { serial, name, phone, bday, number, bonus: 0, level: 'MEMBER', authToken: crypto.randomBytes(16).toString('hex'), updatedAt: Math.floor(Date.now() / 1000) }
  members[serial] = m
  save('members.json', members)
  return m
}

// Выпуск карты с сайта: POST {name, phone, bday} -> .pkpass
app.post('/api/issue', async (req, res) => {
  try {
    const { name, phone, bday } = req.body || {}
    if (!name || !phone) return res.status(400).json({ error: 'name и phone обязательны' })
    const m = newMember(name, phone, bday)
    sendPkpass(res, await buildPass(m))
  } catch (e) { res.status(500).json({ error: String(e.message || e) }) }
})
// Тот же выпуск по ссылке (GET) — удобно для кнопки/QR
app.get('/api/issue', async (req, res) => {
  try {
    const { name = 'Гость', phone = '', bday = '' } = req.query
    const m = newMember(String(name), String(phone), String(bday))
    sendPkpass(res, await buildPass(m))
  } catch (e) { res.status(500).json({ error: String(e.message || e) }) }
})

const auth = (req, serial) => {
  const h = req.get('Authorization') || ''
  const token = h.replace('ApplePass ', '').trim()
  return members[serial] && token === members[serial].authToken
}

// --- PassKit Web Service (webServiceURL = BASE_URL/wallet) ---
// Регистрация устройства
app.post('/wallet/v1/devices/:device/registrations/:passType/:serial', (req, res) => {
  const { device, serial } = req.params
  if (!auth(req, serial)) return res.sendStatus(401)
  const token = (req.body && req.body.pushToken) || ''
  regs[serial] = regs[serial] || {}
  const existed = !!regs[serial][device]
  regs[serial][device] = token
  save('registrations.json', regs)
  res.sendStatus(existed ? 200 : 201)
})
// Отмена регистрации
app.delete('/wallet/v1/devices/:device/registrations/:passType/:serial', (req, res) => {
  const { device, serial } = req.params
  if (!auth(req, serial)) return res.sendStatus(401)
  if (regs[serial]) { delete regs[serial][device]; save('registrations.json', regs) }
  res.sendStatus(200)
})
// Список обновлённых серийников для устройства
app.get('/wallet/v1/devices/:device/registrations/:passType', (req, res) => {
  const { device } = req.params
  const since = Number(req.query.passesUpdatedSince || 0)
  const serials = Object.keys(regs).filter((s) => regs[s][device] && (members[s]?.updatedAt || 0) > since)
  if (!serials.length) return res.sendStatus(204)
  res.json({ serialNumbers: serials, lastUpdated: String(Math.floor(Date.now() / 1000)) })
})
// Отдать актуальный .pkpass
app.get('/wallet/v1/passes/:passType/:serial', async (req, res) => {
  const { serial } = req.params
  if (!auth(req, serial)) return res.sendStatus(401)
  const m = members[serial]
  if (!m) return res.sendStatus(404)
  try { sendPkpass(res, await buildPass(m)) } catch (e) { res.status(500).send(String(e)) }
})
// Логи от устройств
app.post('/wallet/v1/log', (req, res) => { console.log('[PassKit log]', JSON.stringify(req.body)); res.sendStatus(200) })

// --- админ: обновить карту и/или отправить push ---
const admin = (req, res, next) => (req.get('X-Admin-Token') === ADMIN_TOKEN ? next() : res.sendStatus(403))

app.post('/api/update/:serial', admin, async (req, res) => {
  const m = members[req.params.serial]
  if (!m) return res.sendStatus(404)
  Object.assign(m, req.body || {})       // напр. { bonus: 500, level: 'VIP' }
  m.updatedAt = Math.floor(Date.now() / 1000)
  save('members.json', members)
  const pushed = await pushSerial(m.serial) // уведомить iPhone -> он подтянет новую карту
  res.json({ ok: true, member: m, pushed })
})
app.post('/api/push/:serial', admin, async (req, res) => res.json({ pushed: await pushSerial(req.params.serial) }))
app.post('/api/broadcast', admin, async (req, res) => {
  const all = []
  for (const s of Object.keys(regs)) all.push(...(await pushSerial(s)))
  res.json({ pushed: all.length, results: all })
})

app.get('/health', (_, res) => res.json({ ok: true, members: Object.keys(members).length, hasCerts: !!certs.signerCert }))

app.listen(PORT, () => console.log(`EXIT13 wallet backend on :${PORT}  (certs: ${certs.signerCert ? 'OK' : 'MISSING'})`))
