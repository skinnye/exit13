// Контент Exit13. Меню (с ценами) выгружено с exit13.space; афиша/резиденты —
// из Telegram @exit13_ekb; контакты/часы — 2ГИС/Zoon. Фото — из аккаунта клуба.

export const VENUE = {
  name: 'EXIT 13',
  tagline: 'Пивной бар до полуночи. Техно-рейв до утра.',
  city: 'Екатеринбург',
  address: 'ул. 8 Марта, 13',
  metro: 'м. Площадь 1905 года — 80 м',
  phone: '+7 (922) 027-23-32',
  phoneRaw: '+79220272332',
  tg: 'https://t.me/exit13_ekb',
  vk: 'https://vk.com/exit13_ekb',
  ig: 'https://www.instagram.com/exit13_ekb',
  door: '21+ · face / dress control',
  payments: 'Карта · наличные · QR / СБП',
}

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

// Раздел кальянов — добавлен по запросу клуба. Позиции/цены ориентировочные.
export const HOOKAH = {
  intro:
    'Густой дым под бит. Готовим кальян под вкус и компанию — на воде, фруктах, молоке или соке. Премиальные табаки и фирменные миксы от кальянной команды Exit 13.',
  options: [
    { name: 'Классический', desc: 'На воде, табак на выбор — Darkside, MustHave, Element', price: 'от 900 ₽' },
    { name: 'На фрукте', desc: 'Чаша из грейпфрута, ананаса или яблока', price: 'от 1 300 ₽' },
    { name: 'На соке / молоке', desc: 'Мягкая тяга, насыщенный вкус', price: 'от 1 100 ₽' },
    { name: 'Авторский микс', desc: 'Фирменный купаж от кальянщика под ваш запрос', price: 'от 1 400 ₽' },
  ],
  combo: 'Кальян + лимонад 1 л — выгоднее в комбо. Спрашивайте у бара.',
}

// Мобильное приложение Exit 13 — карта, афиша, брони и оплата в одном месте.
// Оплата картой идёт через платёжного провайдера (эквайринг); на месте — по QR.
export const APP = {
  intro:
    'Афиша, клубная карта, брони столов и оплата входа — в одном приложении. Карта лояльности всегда в телефоне, а вход и бронь можно оплатить картой прямо в приложении или по QR на месте.',
  features: [
    { t: 'Карта в телефоне', d: 'Клубная карта и бонусы всегда с собой — код на входе и в Apple Wallet.' },
    { t: 'Афиша и «Я иду»', d: 'Ближайшие вечеринки, отметка «иду» и пуш-напоминание перед событием.' },
    { t: 'Бронь столов', d: 'Выбираешь стол на схеме зала — менеджер подтверждает бронь.' },
    { t: 'Оплата входа и брони', d: 'Оплата банковской картой в приложении — безопасно, через платёжного провайдера.' },
    { t: 'Оплата на месте по QR', d: 'На входе персонал выставляет сумму — гость платит картой, отсканировав QR.' },
    { t: 'Бонусы и возвраты', d: 'Кешбэк баллами, отмена входа и возврат — без звонков и очередей.' },
  ],
  stores: [
    { name: 'App Store', status: 'скоро' },
    { name: 'RuStore', status: 'скоро' },
    { name: 'Google Play', status: 'скоро' },
  ],
  // Реальные экраны приложения (скриншоты). Лежат в public/img/app/.
  screens: [
    { src: '/img/app/afisha.png', alt: 'Афиша событий в приложении Exit 13' },
    { src: '/img/app/card.png', alt: 'Клубная карта в приложении Exit 13' },
    { src: '/img/app/pay.png', alt: 'Оплата по QR в приложении Exit 13' },
  ],
}

// Объединённый раздел «Клубная карта + приложение»: карта живёт в приложении,
// поэтому привилегии карты и возможности приложения показываем вместе.
export const CLUBAPP = {
  eyebrow: 'Клубная карта · приложение',
  intro:
    'Клубная карта Exit 13 живёт в приложении: скидки и бонусы, афиша с записью «Я иду», бронь столов и оплата входа — всё в телефоне. Карту можно добавить в Apple Wallet, а вход и бронь — оплатить картой в приложении или по QR на месте.',
  features: [
    { t: '−15% на бар и кухню', d: 'Постоянная скидка по карте на всё меню.' },
    { t: 'Проход без очереди', d: 'Отдельный вход для держателей карты в пятницу и субботу.' },
    { t: 'Афиша и «Я иду»', d: 'Ближайшие вечеринки, запись и пуш-напоминание перед событием.' },
    { t: 'Бронь столов', d: 'Выбираешь стол на схеме зала — менеджер подтверждает бронь.' },
    { t: 'Оплата картой и по QR', d: 'Вход и бронь — картой прямо в приложении или по QR на месте.' },
    { t: 'Бонусы и подарки', d: 'Кешбэк баллами и комплимент в день рождения.' },
  ],
  stores: [
    { name: 'App Store', status: 'скоро' },
    { name: 'RuStore', status: 'скоро' },
    { name: 'Google Play', status: 'скоро' },
  ],
  screens: [
    { src: '/img/app/afisha.png', alt: 'Афиша событий в приложении Exit 13' },
    { src: '/img/app/card.png', alt: 'Клубная карта в приложении Exit 13' },
    { src: '/img/app/pay.png', alt: 'Оплата входа в приложении Exit 13' },
  ],
}

// Клубная карта — лояльность/привилегии. Условия ориентировочные, согласовать.
export const CLUB = {
  intro: 'Своя карта Exit 13 — это привилегии для тех, кто здесь как дома. Оформи за минуту, забирай на баре.',
  perks: [
    { t: '−15% на бар и кухню', d: 'Постоянная скидка по карте на всё меню.' },
    { t: 'Проход без очереди', d: 'Отдельный вход для держателей карты в пятницу и субботу.' },
    { t: 'Закрытые вечеринки', d: 'Приглашения на гостевые сеты и афтепати только для своих.' },
    { t: 'Бонусы и подарки', d: 'Кешбэк баллами и комплимент в день рождения.' },
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

export type Ev = { day: string; date: string; time: string; title: string; lineup: string[]; badge?: string; past?: boolean }

export const EVENTS: Ev[] = [
  { day: 'ПТ', date: '12.06', time: '00:00', title: 'RAINY NIGHT', lineup: ['KARPENKO', 'LUDA PRO', 'DOBRO', 'KARINA NIU'] },
  { day: 'СБ', date: '13.06', time: '00:00', title: 'WEEKEND RAVE', lineup: ['DAILYDOSE', 'SVETA POPOVA', 'YAMAKASI', 'KATA', 'ESSMINA'] },
  { day: 'ЧТ', date: '19.06', time: '17:00', title: 'URAL MUSIC NIGHT', lineup: ['AVERKIEV', 'DEVA LOKA', 'KARPENKO', 'MALEK', 'DOBRO', 'LETAEV', 'SVETA POPOVA'], badge: 'Фестиваль' },
  { day: 'СБ', date: '20.06', time: '00:00', title: 'NIGHT SHIFT', lineup: ['NO CONTROL', 'NVKY', 'VAN VICE', 'MAXXKOO'] },
  { day: 'ПТ', date: '27.02', time: '23:00', title: 'OUTSIDER · ПАТИФОН', lineup: ['OUTSIDER', 'PASHALSKIY', 'FARBER', 'ILIA GLITCH', 'FILIMONOV'], badge: 'Гость из Москвы', past: true },
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
  { t: 'Крафт и классика', d: 'Большая пивная карта и закуски, которые её дополняют — в лучших пивных традициях.' },
  { t: 'Тапочки на входе', d: 'Сдаёшь обувь — получаешь мягкие тапки. Фирменный уют Exit 13.' },
  { t: 'Танцпол', d: 'Вечером — бар, ближе к ночи — танцпол и звук. Один адрес, два состояния.' },
  { t: 'Оплата как удобно', d: 'Карта, наличные, QR / СБП. Без лишних движений.' },
]
