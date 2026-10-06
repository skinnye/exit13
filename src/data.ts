// Контент EXIT 13. Меню (с ценами) выгружено с exit13.space; резиденты и архив афиши —
// из Telegram @exit13_ekb; телефон для гостей и часы — 2ГИС/Zoon; фото — из аккаунта клуба.
// Приложение, кешбэк, бронь и оплата — как в приложении EXIT 13 и на app.exit13.space
// (сверено 06.10.2026). Юрлицо и документы — с app.exit13.space/legal/*.

export const VENUE = {
  name: 'EXIT 13',
  tagline: 'Пивной бар до полуночи. Техно-рейв до утра.',
  city: 'Екатеринбург',
  address: 'ул. 8 Марта, 13',
  metro: 'м. Площадь 1905 года — 80 м',
  // Телефон для гостей (бронь, вопросы) — из 2ГИС. Телефон организации — в ORG.
  phone: '+7 (922) 027-23-32',
  phoneRaw: '+79220272332',
  tg: 'https://t.me/exit13_ekb',
  vk: 'https://vk.com/exit13_ekb',
  ig: 'https://www.instagram.com/exit13_ekb',
  door: 'Строго 21+ по документу · face / dress control',
  payments: 'Карта · наличные · QR / СБП',
}

// Юрлицо клуба — как на app.exit13.space/legal/contacts.
export const ORG = {
  short: 'ООО «БЕЗ НАЗВАНИЯ»',
  full: 'Общество с ограниченной ответственностью «Без названия»',
  inn: '6671295025',
  kpp: '667101001',
  ogrn: '1246600012350',
  address: '620014, Свердловская обл., г. Екатеринбург, ул. 8 Марта, стр. 13',
  phone: '+7 (912) 277-00-10',
  phoneRaw: '+79122770010',
  email: 'no_name_ekb@bk.ru',
  ceo: 'Суворов Дмитрий Сергеевич',
  bank: {
    account: '40702810916750005268',
    name: 'УРАЛЬСКИЙ БАНК ПАО СБЕРБАНК',
    corr: '30101810500000000674',
    bik: '046577674',
  },
}

// Сайт клуба на собственном сервере: афиша с ценами, оферта, реквизиты, политика.
// Юридические документы живут только там — здесь краткие пересказы со ссылками.
export const CLUB_SITE = 'https://app.exit13.space'

export const DOCS = {
  offer: `${CLUB_SITE}/legal/offer`,
  contacts: `${CLUB_SITE}/legal/contacts`,
  privacy: `${CLUB_SITE}/legal/privacy`,
  deleteAccount: `${CLUB_SITE}/legal/delete-account`,
}

export const DOC_LINKS = [
  { label: 'Публичная оферта', href: DOCS.offer },
  { label: 'Реквизиты и контакты', href: DOCS.contacts },
  { label: 'Политика конфиденциальности', href: DOCS.privacy },
  { label: 'Удаление аккаунта', href: DOCS.deleteAccount },
]

// Поддержка приложения — Telegram-бот клуба.
export const SUPPORT_BOT = { label: '@EXIT13_AUTHBOT', href: 'https://t.me/EXIT13_AUTHBOT' }

export const NAV = [
  { label: 'Афиша', href: '#afisha' },
  { label: 'Меню', href: '#menu' },
  { label: 'Кальян', href: '#hookah' },
  { label: 'Приложение', href: '#club' },
  { label: 'Фото', href: '#gallery' },
  { label: 'Инфо', href: '#info' },
]

export const MENU_URL = 'http://exit13.space/'

export type MenuItem = { name: string; vol?: string; price: string; desc?: string }
export type MenuSub = { sub: string; items: MenuItem[] }
export type MenuGroup = { group: string; subs: MenuSub[] }

// Полное меню с ценами — выгружено с exit13.space.
export const MENU: MenuGroup[] = [
  {
    group: 'Коктейли',
    subs: [
      {
        sub: 'Алкогольные',
        items: [
          { name: 'Long Island Ice Tea', price: '750' },
          { name: 'Aperol Spritz', price: '700' },
          { name: 'Mojito', price: '700' },
          { name: 'Pina Colada', price: '700' },
          { name: 'Mai Tai', price: '700' },
          { name: 'Sex on the Beach', price: '700' },
          { name: 'Tequila Sunrise', price: '700' },
          { name: 'PornStar Martini', price: '700' },
          { name: 'Clover Club', price: '700' },
          { name: 'Negroni', price: '650' },
          { name: 'Margarita', price: '650' },
          { name: 'White Russian', price: '650' },
          { name: 'Blue Lagoon', price: '650' },
          { name: 'Martini Fiero Tonic', price: '650' },
          { name: 'Daiquiri', price: '600' },
          { name: 'Б-52 / Б-53', price: '550' },
        ],
      },
      {
        sub: 'Безалкогольные',
        items: [
          { name: 'Pina Colada б/а', price: '400' },
          { name: 'Mojito б/а', price: '400' },
        ],
      },
    ],
  },
  {
    group: 'Крепкое',
    subs: [
      {
        sub: 'Whiskey',
        items: [
          { name: 'Macallan 12 Years Old', vol: '50 мл', price: '1 200' },
          { name: 'Glenfiddich 12 Years Old', vol: '50 мл', price: '800' },
          { name: 'Auchentoshan 12 Years Old', vol: '50 мл', price: '750' },
          { name: 'Singleton of Dufftown 12', vol: '50 мл', price: '750' },
          { name: 'Chivas Regal 12 Years Old', vol: '50 мл', price: '700' },
          { name: 'Jack Daniel’s', vol: '50 мл', price: '600' },
          { name: 'Ballantine’s', vol: '50 мл', price: '600' },
          { name: 'Jameson', vol: '50 мл', price: '600' },
        ],
      },
      {
        sub: 'Cognac',
        items: [
          { name: 'Daniel Bouju VSOP', vol: '50 мл', price: '2 000' },
          { name: 'Hennessy VSOP', vol: '50 мл', price: '900' },
          { name: 'Hennessy VS', vol: '50 мл', price: '800' },
          { name: 'Courvoisier VSOP', vol: '50 мл', price: '750' },
          { name: 'Martell VS', vol: '50 мл', price: '700' },
          { name: 'Ararat Apricot', vol: '50 мл', price: '600' },
        ],
      },
      {
        sub: 'Gin · Tequila · Rum',
        items: [
          { name: "Hendrick’s Gin", vol: '50 мл', price: '750' },
          { name: 'Roku Gin', vol: '50 мл', price: '750' },
          { name: 'Bombay', vol: '50 мл', price: '650' },
          { name: 'Olmeca Gold / Sauza / Espolon', vol: '50 мл', price: '600' },
          { name: 'Bacardi (Blanca / Negra / Oro)', vol: '50 мл', price: '600' },
          { name: 'Olmeca Silver', vol: '50 мл', price: '550' },
        ],
      },
      {
        sub: 'Vodka · Liqueur',
        items: [
          { name: 'Jagermeister', vol: '50 мл', price: '600' },
          { name: 'Beluga / Absolut / Finlandia', vol: '50 мл', price: '550' },
          { name: 'Mamont / Онегин / Nerpa Gold', vol: '50 мл', price: '550' },
        ],
      },
    ],
  },
  {
    group: 'Пиво и вино',
    subs: [
      {
        sub: 'Пиво',
        items: [
          { name: 'Corona Extra', vol: '0,355 л', price: '450' },
          { name: 'Hoegaarden', vol: '0,44 л', price: '400' },
          { name: 'Blanche', vol: '0,45 л', price: '400' },
          { name: 'Spaten', vol: '0,45 л', price: '400' },
          { name: 'Stella Artois', vol: '0,44 л', price: '400' },
          { name: 'Stella Artois «0» (б/а)', vol: '0,44 л', price: '300' },
        ],
      },
      {
        sub: 'Вино',
        items: [
          { name: 'Martini Prosecco / Asti', vol: '0,75 л', price: '3 000' },
          { name: 'Chianti «Astrale», красное сухое', vol: '0,75 л', price: '2 500' },
          { name: 'Pinot Grigio, белое сухое', vol: '0,75 л', price: '2 500' },
          { name: 'Primitivo, красное полусухое', vol: '0,75 л', price: '2 500' },
          { name: '«Gaumen Spiel», белое полусладкое', vol: '0,75 л', price: '2 500' },
        ],
      },
    ],
  },
  {
    group: 'Кухня',
    subs: [
      {
        sub: 'Основные',
        items: [
          { name: 'Паста с морепродуктами', vol: '260 г', price: '650', desc: 'Спагетти, креветки, кальмар, сливочный соус, томаты, базилик' },
          { name: 'Гречневая лапша WOK с говядиной', vol: '250 г', price: '600', desc: 'Соба, говядина, овощи, соус терияки, кунжут' },
          { name: 'Куриные котлеты с пюре', vol: '270 г', price: '550', desc: 'Картофельное пюре, цыплёнок, сырный соус' },
          { name: 'Удон с курицей и овощами', vol: '250 г', price: '500', desc: 'Лапша удон, цыплёнок, овощи, кисло-сладкий соус' },
          { name: 'Спагетти Карбонара', vol: '230 г', price: '500', desc: 'Копчёный цыплёнок, сливочный соус, пармезан' },
          { name: 'Пельмени куриные в сливочном соусе', vol: '250 г', price: '500' },
        ],
      },
      {
        sub: 'Супы',
        items: [
          { name: 'Солянка по-кубански', vol: '300 г', price: '550' },
          { name: 'Куриный суп-лапша', vol: '300 г', price: '450' },
          { name: 'Грибной суп-пюре', vol: '300 г', price: '400' },
        ],
      },
      {
        sub: 'Выпечка и десерты',
        items: [
          { name: 'Блины с курицей и грибами', vol: '2 шт', price: '350' },
          { name: 'Блины с сыром и ветчиной', vol: '2 шт', price: '350' },
          { name: 'Рулетики из омлета', vol: '4 шт', price: '400' },
          { name: 'Сырники с малиновым вареньем', vol: '4 шт', price: '400' },
          { name: 'Шоколадный брауни', vol: '120 г', price: '400' },
          { name: 'Панкейки с кленовым сиропом', vol: '3 шт', price: '400' },
        ],
      },
    ],
  },
  {
    group: 'Напитки',
    subs: [
      {
        sub: 'Лимонады и авторские',
        items: [
          { name: 'Авторский лимонад (7 вкусов)', vol: '0,25 / 1 л', price: '300 / 700' },
          { name: 'Signature NEA, авторский', vol: '1 л', price: '400' },
        ],
      },
      {
        sub: 'Кофе и чай',
        items: [
          { name: 'Латте / Капучино', vol: '200–250 мл', price: '300' },
          { name: 'Американо', vol: '200 мл', price: '250' },
          { name: 'Эспрессо', vol: '90 мл', price: '200' },
          { name: 'Листовой чай (13 вкусов)', vol: '800 мл', price: '250' },
        ],
      },
      {
        sub: 'Безалкогольное',
        items: [
          { name: 'Red Bull', vol: '0,25 л', price: '300' },
          { name: 'Напиток АШ-ТАУ', vol: '0,5 л', price: '300' },
          { name: 'Добрый Cola / Sprite / Orange', vol: '0,33 л', price: '250' },
          { name: 'Соки (7 вкусов)', vol: '0,25 л', price: '250' },
          { name: 'Вода газ. / негаз.', vol: '0,33 л', price: '200' },
        ],
      },
    ],
  },
]

// Раздел кальянов — добавлен по запросу клуба. Цены не подтверждены — на сайте их нет,
// только форматы; стоимость гость уточняет у кальянщика.
export const HOOKAH = {
  intro:
    'Кальян под вкус и компанию — на воде, фрукте, соке или молоке. Табак и микс подберёт кальянщик под ваш запрос.',
  options: [
    { name: 'Классический', desc: 'На воде, табак и вкус — на выбор' },
    { name: 'На фрукте', desc: 'Чаша из грейпфрута, ананаса или яблока' },
    { name: 'На соке / молоке', desc: 'Мягкая тяга, насыщенный вкус' },
    { name: 'Авторский микс', desc: 'Купаж от кальянщика под ваш запрос' },
  ],
  priceNote: 'Цены и наличие табаков уточняйте у кальянщика или по телефону.',
}

// Кешбэк бонусами — накопительная система клуба в кассе (FusionPOS, «Карты»):
// процент растёт с суммой покупок. Копия порогов — backend LOYALTY_LEVELS.
export const CASHBACK = {
  welcome: 200,
  levels: [
    { percent: 3, from: 0 },
    { percent: 5, from: 20_000 },
    { percent: 7, from: 50_000 },
    { percent: 10, from: 100_000 },
  ],
}

// Клубная карта живёт в приложении: здесь только то, что в приложении есть на самом деле.
export const CLUBAPP = {
  eyebrow: 'Клубная карта · приложение',
  intro:
    'Клубная карта EXIT 13 — в приложении: один QR для входа и бара, кешбэк бонусами, афиша с «Я иду» и бесплатная бронь столов. Вход по номеру телефона, только для гостей 21+.',
  features: [
    { t: 'Вход по телефону', d: 'Регистрация по номеру телефона за минуту. Приложение — только для гостей 21+.' },
    { t: 'Афиша и «Я иду»', d: 'Вечеринки свайпом: постер, LINE-UP, цена. Нажал «Я иду» — ты в списке гостей.' },
    { t: 'Один QR', d: 'Клубная карта — личный QR-код. Показываешь его на входе и на баре.' },
    { t: 'Кешбэк бонусами', d: 'От 3% до 10% с покупок в клубе — процент растёт с суммой. 200 бонусов при регистрации.' },
    { t: 'Карта в Apple Wallet', d: 'На iPhone клубную карту можно добавить в Apple Wallet.' },
    { t: 'Бронь стола', d: 'Стол на плане зала — бесплатно и без предоплаты. Бронь действует сразу, подтверждать не нужно.' },
    { t: 'Меню бара', d: 'Бар и кухня с ценами — с поиском по всем разделам.' },
    { t: 'Приглашай друзей', d: 'Бонусы получаете оба — после первого визита друга в клуб.' },
    { t: 'Уведомления', d: 'Сервисные пуши — например, о брони. Рекламные рассылки — только с твоего согласия.' },
  ],
  payment: {
    now: 'Оплата входа — на месте: карта, наличные, QR / СБП.',
    soon: 'Онлайн-оплата в приложении — скоро.',
  },
  stores: [
    { name: 'App Store', status: 'скоро' },
    { name: 'Google Play', status: 'скоро' },
    { name: 'RuStore', status: 'скоро' },
  ],
}

export const PHOTOS = [
  { src: '/img/photos/p1.webp', alt: 'DJ-зона и неоновый экран EXIT 13' },
  { src: '/img/photos/p6.webp', alt: 'DJ-сет: Pioneer и неон EXIT 13' },
  { src: '/img/photos/p2.webp', alt: 'Зал: диваны и столы-слэбы' },
  { src: '/img/photos/p4.webp', alt: 'Оранжевые диваны и барная стойка' },
  { src: '/img/photos/p3.webp', alt: 'Экран и зона отдыха' },
  { src: '/img/photos/p5.webp', alt: 'Живая зелень и тёплый свет бара' },
]

export const GENRES = [
  'TECHNO', 'HARD TECHNO', 'HYPNOTIC', 'BROKEN', 'ELECTRO', 'HOUSE', 'ACID', 'RAVE', 'UNDERGROUND',
]

// Живая афиша — GET /events на сервере клуба (тот же источник, что у приложения).
// Для запроса с сайта на GitHub Pages сервер должен разрешить CORS для его origin
// (ALLOWED_ORIGINS на бэке). Пока не разрешил — показываем архив ниже.
export const EVENTS_API = `${CLUB_SITE}/events`

export type ArchiveEvent = {
  date: string // YYYY-MM-DD
  time: string
  title: string
  lineup: string[]
  badge?: string
}

// Архив — прошедшие вечеринки из Telegram @exit13_ekb. Показываем, когда живая афиша
// недоступна или в ней нет ближайших дат.
export const EVENTS_ARCHIVE: ArchiveEvent[] = [
  { date: '2026-06-20', time: '00:00', title: 'NIGHT SHIFT', lineup: ['NO CONTROL', 'NVKY', 'VAN VICE', 'MAXXKOO'] },
  { date: '2026-06-19', time: '17:00', title: 'URAL MUSIC NIGHT', lineup: ['AVERKIEV', 'DEVA LOKA', 'KARPENKO', 'MALEK', 'DOBRO', 'LETAEV', 'SVETA POPOVA'], badge: 'Фестиваль' },
  { date: '2026-06-13', time: '00:00', title: 'WEEKEND RAVE', lineup: ['DAILYDOSE', 'SVETA POPOVA', 'YAMAKASI', 'KATA', 'ESSMINA'] },
  { date: '2026-06-12', time: '00:00', title: 'RAINY NIGHT', lineup: ['KARPENKO', 'LUDA PRO', 'DOBRO', 'KARINA NIU'] },
  { date: '2026-02-27', time: '23:00', title: 'OUTSIDER · ПАТИФОН', lineup: ['OUTSIDER', 'PASHALSKIY', 'FARBER', 'ILIA GLITCH', 'FILIMONOV'], badge: 'Гость из Москвы' },
]

export const RESIDENTS = [
  'KARPENKO', 'DOBRO', 'SVETA POPOVA', 'LUDA PRO', 'KARINA NIU', 'DAILYDOSE',
  'YAMAKASI', 'KATA', 'ESSMINA', 'AVERKIEV', 'DEVA LOKA', 'MALEK',
  'LETAEV', 'NO CONTROL', 'NVKY', 'VAN VICE', 'MAXXKOO', 'OUTSIDER',
  'PASHALSKIY', 'FARBER', 'ILIA GLITCH', 'VOLODINA',
]

export const HOURS = [
  { d: 'Вт — Чт', h: '17:00 — 00:00', club: false },
  { d: 'Пт — Сб', h: '17:00 — 07:00', club: true },
  { d: 'Вс — Пн', h: 'Закрыто', club: false },
]

export const BAR_FEATURES = [
  { t: 'Бар и кухня', d: 'Пиво, коктейли, крепкое и горячая кухня — всё меню с ценами ниже.' },
  { t: 'Тапочки на входе', d: 'Сдаёшь обувь — получаешь мягкие тапки. Фирменный уют EXIT 13.' },
  { t: 'Танцпол', d: 'Вечером — бар, ближе к ночи — танцпол и звук. Один адрес, два состояния.' },
  { t: 'Оплата как удобно', d: 'Карта, наличные, QR / СБП. Без лишних движений.' },
]
