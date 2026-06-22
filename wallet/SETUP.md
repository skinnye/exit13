# EXIT 13 — карта Apple Wallet + push. Настройка

Бэкенд выпускает подписанные карты `.pkpass`, регистрирует iPhone'ы и шлёт
push-обновления через APNs. Сам сайт (GitHub Pages) не может подписывать карты и
слать пуши — поэтому нужен этот небольшой сервер.

## 1. Apple Developer (нужен аккаунт, $99/год)

1. **Pass Type ID.** Apple Developer → Certificates, Identifiers & Profiles →
   Identifiers → «+» → **Pass Type IDs** → создай `pass.com.exit13.club`.
2. **Сертификат для него.** На этом Pass Type ID → Create Certificate → загрузи CSR
   (сделай в «Связке ключей» → Ассистент сертификации → запросить сертификат) →
   скачай `pass.cer`.
3. **Team ID** — вверху справа в аккаунте (10 символов).
4. **WWDR-сертификат** — apple.com/certificateauthority (Worldwide Developer
   Relations G4), скачай `AppleWWDRCAG4.cer`.

## 2. Превратить сертификаты в PEM (в терминале macOS/Linux)

```bash
# pass-сертификат
openssl x509 -inform der -in pass.cer -out signerCert.pem
# приватный ключ: экспортируй из Связки ключей как .p12 (с паролем), затем:
openssl pkcs12 -in Certificates.p12 -nocerts -out signerKey.pem
# WWDR
openssl x509 -inform der -in AppleWWDRCAG4.cer -out wwdr.pem
```

Положи `signerCert.pem`, `signerKey.pem`, `wwdr.pem` в `wallet/certs/`.

## 3. Запуск бэкенда

```bash
cd wallet
npm install
python make_assets.py        # картинки карты (один раз)
cp .env.example .env          # заполни TEAM_ID, BASE_URL, ADMIN_TOKEN, пароль ключа
npm start                     # http://localhost:4000/health
```

Деплой: Render / Railway / любой VPS с Node 18+. Важно: **HTTPS** и публичный
домен — его укажи в `BASE_URL` и в `VITE_WALLET_API` сайта.

## 4. Подключить кнопку на сайте

В `exit13-site` собери сайт с переменной окружения:

```bash
VITE_WALLET_API=https://твой-бэкенд npm run build
```

(или добавь `VITE_WALLET_API` в GitHub → Settings → Secrets/Variables и в workflow).
После этого на сайте в разделе «Клубная карта» появится рабочая кнопка
**«Добавить в Apple Wallet»**: форма создаёт карту и отдаёт `.pkpass`, iPhone
предлагает добавить её в Wallet.

## 5. Как слать уведомления / обновлять карту

```bash
# начислить бонусы и обновить карту (iPhone сам подтянет новую версию):
curl -X POST https://бэкенд/api/update/<serial> \
  -H "X-Admin-Token: <ADMIN_TOKEN>" -H "Content-Type: application/json" \
  -d '{"bonus": 500, "level": "VIP"}'

# просто пнуть обновление одной карты:
curl -X POST https://бэкенд/api/push/<serial> -H "X-Admin-Token: <ADMIN_TOKEN>"

# разослать всем держателям (например, перед вечеринкой):
curl -X POST https://бэкенд/api/broadcast -H "X-Admin-Token: <ADMIN_TOKEN>"
```

> Push на карту = «тихий» сигнал, после которого iPhone скачивает свежий `.pkpass`.
> Чтобы у гостя на экране появился текст — меняй поле карты (напр. `bonus` или
> добавь сообщение в поле), тогда iPhone покажет уведомление об изменении карты.

## Заметки

- `certs/`, `data/`, `.env` — в `.gitignore`, в репозиторий не попадают.
- Если APNs отвечает не 200 — проверь, что сертификат именно Pass Type ID,
  `apns-topic` = твой Pass Type ID, и используется прод-хост `api.push.apple.com`.
