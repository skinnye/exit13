// Контент EXIT 13. Меню (с ценами) выгружено с exit13.space; резиденты и архив афиши —
// из Telegram @exit13_ekb; телефон для гостей и часы — 2ГИС/Zoon; фото — из аккаунта клуба.
// Приложение, кешбэк, бронь и оплата — как в приложении EXIT 13 и на app.exit13.space
// (сверено 06.10.2026). Юрлицо и документы — с app.exit13.space/legal/*.

// Депозит за стол (решение клуба 2026-11-06) — для текстов сайта; в самой брони сумма
// каждого стола приходит с сервера (Table.deposit), засчитывается в счёт бара.
export const TABLE_DEPOSIT = 5000 // наименьший — «от 5 000 ₽»
export const TABLE_DEPOSIT_TEXT = 'от 5 000 ₽ (стол 9 — 10 000 ₽)'

export const VENUE = {
  name: 'EXIT 13',
  city: 'Екатеринбург',
  address: 'ул. 8 Марта, 13',
  metro: '80 м от метро «Площадь 1905 года»',
  // Телефон для гостей (бронь, вопросы) — из 2ГИС. Телефон организации — в ORG.
  phone: '+7 (922) 027-23-32',
  phoneRaw: '+79220272332',
  tg: 'https://t.me/exit13_ekb',
  vk: 'https://vk.com/exit13_ekb',
  ig: 'https://www.instagram.com/exit13_ekb',
  door: 'Строго с 21 года, по документу. Вход — депозит от 1 000 ₽, он идёт в счёт бара. Есть фейс- и дресс-контроль.',
  payments: 'Карта, наличные, QR и СБП',
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
  { label: 'Бронь', href: '#booking' },
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

// Полное меню с ценами — из exit13.space/data/menu.json (сверено 06.11.2026).
export const MENU: MenuGroup[] = [
  {
    group: 'Коктейли',
    subs: [
      {
        sub: 'Алкогольные',
        items: [
          { name: 'Long Island', vol: '250 мл', price: '900', desc: 'Водка, текила, джин, ром белый, ликер triple sec, напиток газированный coca cola' },
          { name: 'Exit 13', vol: '150 мл', price: '650', desc: 'Водка, вермут Martini Bianco, сироп, сок лимона, мята' },
          { name: 'Porn Star Martini', vol: '120 мл', price: '800', desc: 'Водка "Ваниль", пюре "Маракуйя", сок лимона, бело яичный, вино игристое Brut' },
          { name: 'Basil Smash', vol: '250 мл', price: '800', desc: 'Джин, кордиал Базелик, сироп, сок лимона, белок яичный' },
          { name: 'Gold Rush', vol: '250 мл', price: '800', desc: 'Ром белый, лимонад "Саперави", ликер Ligare Spritz' },
          { name: 'Clover Club', vol: '250 мл', price: '850', desc: 'Джин, пюре малины, сок лимона, белок яичный' },
          { name: 'Mai Tai', vol: '120 мл', price: '800', desc: 'Ром белый, ром тёмный, ликер triple sec, сироп миндаль, сок лайма' },
          { name: 'Aperol Spritz', vol: '150 мл', price: '850', desc: 'Aperol, вино игристое Brut, содовая, апельсин' },
          { name: 'Tarragon spritz', vol: '150 мл', price: '800', desc: 'Limoncello, вино игристое Brut, ликер triple sec, пюре "Тархун"' },
          { name: 'White Russian', vol: '150 мл', price: '850', desc: 'Водка, ликер кофейный, сливки' },
          { name: 'Margarita', vol: '120 мл', price: '800', desc: 'Текила, ликер triple sec, сироп, сок лайма' },
          { name: 'Negroni', vol: '150 мл', price: '850', desc: 'Джин, ликер Campari, вермут Martini Rosso, апельсин' },
          { name: 'Daiquiri', vol: '120 мл', price: '800', desc: 'Ром белый, сироп, сок лайма' },
          { name: 'Espresso Martini', vol: '150 мл', price: '850', desc: 'Водка "Ваниль", ликер кофейный, сироп, кофе эспрессо' },
          { name: 'Gin Tonic', vol: '250 мл', price: '800', desc: 'Джин, газированный напиток Tonic' },
        ],
      },
      {
        sub: 'Безалкогольные',
        items: [
          { name: 'Varvara', vol: '250 мл', price: '600', desc: 'Джин б/а, вино игристое б/а, сироп, сок лимона, мята' },
          { name: 'Negroni', vol: '150 мл', price: '600', desc: 'Джин б/а, вермут б/а, биттер б/а' },
          { name: 'Aperol spritz', vol: '200 мл', price: '600', desc: 'Italian Orange Spritz б/а, вино игрстое б/а' },
          { name: 'Gin Tonic', vol: '250 мл', price: '600', desc: 'Джин б/а, напиток газированный Tonic' },
        ],
      },
      {
        sub: 'Шоты',
        items: [
          { name: 'Б-52', price: '500' },
          { name: 'Ильич', price: '350' },
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
          { name: 'Macallan 12 Years Old', vol: '50 мл', price: '1200' },
          { name: 'Glenfiddich 12 Years Old', vol: '50 мл', price: '800' },
          { name: 'Auchentoshan 12 Years Old', vol: '50 мл', price: '750' },
          { name: 'Singleton of Dufftown 12 Year Old', vol: '50 мл', price: '750' },
          { name: 'Chivas Regal 12 Years Old', vol: '50 мл', price: '750' },
          { name: 'Jack Daniel Tennessee', vol: '50 мл', price: '700' },
          { name: 'Jameson', vol: '50 мл', price: '650' },
        ],
      },
      {
        sub: 'Vodka',
        items: [
          { name: 'Grey Goose', vol: '50 мл', price: '700' },
          { name: 'Beluga', vol: '50 мл', price: '550' },
          { name: 'ОНЕГИН', vol: '50 мл', price: '550' },
          { name: 'Nerpa Baikal Gold', vol: '50 мл', price: '550' },
        ],
      },
      {
        sub: 'Cognac',
        items: [
          { name: 'Daniel Bouju VSOP', vol: '50 мл', price: '2 000' },
          { name: 'Hennessy VS', vol: '50 мл', price: '800' },
          { name: 'Courvoisier VSOP', vol: '50 мл', price: '800' },
          { name: 'Martell VS', vol: '50 мл', price: '700' },
          { name: 'Roullet VS', vol: '50 мл', price: '700' },
          { name: 'Torres 5', vol: '50 мл', price: '500' },
        ],
      },
      {
        sub: 'Rum',
        items: [
          { name: 'Bacardi Carta Blanca', vol: '50 мл', price: '700' },
          { name: 'Bacardi Carta Negra', vol: '50 мл', price: '700' },
          { name: 'Bacardi Carta Oro', vol: '50 мл', price: '700' },
          { name: 'Barcelo Dark', vol: '50 мл', price: '650' },
          { name: 'Havana Club Añejo', vol: '50 мл', price: '650' },
        ],
      },
      {
        sub: 'Tequila',
        items: [
          { name: 'Olmeca Silver', vol: '50 мл', price: '600' },
          { name: 'Olmeca Gold', vol: '50 мл', price: '600' },
          { name: 'Sauza Silver', vol: '50 мл', price: '550' },
          { name: 'Don Alejandro', vol: '50 мл', price: '500' },
        ],
      },
      {
        sub: 'Gin',
        items: [
          { name: 'Roku', vol: '50 мл', price: '750' },
          { name: 'Hendrick\'s', vol: '50 мл', price: '750' },
          { name: 'Hokku', vol: '50 мл', price: '650' },
          { name: 'Beefeater London Dry Gin', vol: '50 мл', price: '650' },
          { name: 'HOPPERS', vol: '50 мл', price: '600' },
          { name: 'Bombay Sapphire Dry', vol: '50 мл', price: '600' },
          { name: 'Barrister', vol: '50 мл', price: '500' },
        ],
      },
      {
        sub: 'Liqueur',
        items: [
          { name: 'Jagermeister', vol: '50 мл', price: '650' },
          { name: 'Absent', vol: '50 мл', price: '650' },
          { name: 'Sambuca', vol: '50 мл', price: '650' },
          { name: 'Dimoncello', vol: '50 мл', price: '350' },
          { name: 'Mariba сливки/шоколад', vol: '50 мл', price: '300' },
        ],
      },
      {
        sub: 'Vermouth',
        items: [
          { name: 'Martini Bianco', vol: '50 мл', price: '350' },
          { name: 'Martini Rosso', vol: '50 мл', price: '350' },
          { name: 'Martini Fiero', vol: '50 мл', price: '350' },
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
          { name: 'Stella Artois', vol: '0,44 л', price: '450' },
          { name: 'Козел темный', vol: '0,5 л', price: '450' },
        ],
      },
      {
        sub: 'Безалкогольное пиво',
        items: [
          { name: 'Stella Artois «0»', vol: '0,44 л', price: '400' },
        ],
      },
      {
        sub: 'Игристое вино',
        items: [
          { name: 'Crewman', vol: '0,75', price: '3 500' },
          { name: 'Prosecco', vol: '0,75 л', price: '3 000' },
          { name: 'Cava', vol: '0,75 л', price: '3 000' },
        ],
      },
      {
        sub: 'Тихое вино',
        items: [
          { name: 'Chianti (Италия)- Красное сухое', vol: '0,75 л', price: '3 000' },
          { name: 'Zinfandel (Италия) — Красное сухое', vol: '0,75 л', price: '3 000' },
          { name: 'Primitivo (Италия) — Красное сухое', vol: '0,75 л', price: '3 000' },
          { name: 'Pinot Grigio (Италия) — Белое сухое', vol: '0,75 л', price: '2 500' },
        ],
      },
    ],
  },
  {
    group: 'Кухня',
    subs: [
      {
        sub: 'Основные блюда',
        items: [
          { name: 'Куриные котлеты с пюре и сырным соусом', price: '750', desc: 'Картофельное пюре, цыпленок, лук, сухари, яйца, соль, перец черный, соус сырный · 270 г' },
          { name: 'Пельмени куриные в сливочном соусе', price: '750', desc: 'Пельмени куриные, соус сливочный, лук, чеснок, петрушка, соль, перец черный · 250 г' },
          { name: 'Удон с курицей и овощами', price: '800', desc: 'Лапша Удон, цыпленок, лук, морковь, кабачки, перец сладкий, соус соевый, соус кисло-сладкий «Чили», имбирь, кинза, семена кунжута · 250 г' },
          { name: 'Гречневая лапша WOK с говядиной и овощами', price: '800', desc: 'Лапша Соба, говядина, лук, морковь, кабачки, перец сладкий, соус соевый, соус кисло-сладкий «Чили», имбирь, кинза, семена кунжута · 250 г' },
          { name: 'Спагетти Карбонара с копченым цыпленком', price: '800', desc: 'Паста Спагетти, цыпленок копченый, соус сливочный, сыр «Пармезан», соль · 230 г' },
          { name: 'Паста с морепродуктами', price: '850', desc: 'Паста Спагетти, морепродукты (креветки, кальмар), соус сливочный, томаты, базилик сушеный, соль, петрушка · 260 г' },
        ],
      },
      {
        sub: 'Брускетты',
        items: [
          { name: 'Креметте лосось', price: '590' },
          { name: 'Перец страчателла', price: '590' },
          { name: 'Мамина брускетта', price: '590' },
        ],
      },
      {
        sub: 'Выпечка',
        items: [
          { name: 'Блины с курицей и грибами', price: '550', desc: 'Мука, яйца, молоко, сахар, соль, вода, масло растительное, цыпленок, шампиньоны, лук, сливки, перец черный · 150 г (2 шт)' },
          { name: 'Шоколадный брауни', price: '550', desc: 'Шоколад темный, масло сливочное, яйца, сахар, мука, какао-порошок, соль · 120 г' },
          { name: 'Чизкейк', vol: '150 гр', price: '350' },
        ],
      },
      {
        sub: 'Десерты',
        items: [
          { name: 'Мороженное ванильное', vol: '50 гр', price: '100' },
          { name: 'Мороженное вишневое', vol: '50 гр', price: '100' },
          { name: 'Мороженное с шоколадной крошкой', vol: '50 гр', price: '100' },
          { name: 'Топпинг в ассортименте', price: '50' },
        ],
      },
      {
        sub: 'Снеки',
        items: [
          { name: 'Гренки чесночные', vol: '100 гр', price: '400' },
          { name: 'Соломка мясная', vol: '100 гр', price: '400' },
          { name: 'Сыр копченый', vol: '100 гр', price: '350' },
          { name: 'Сыр жаренный "Воздушный"', vol: '100 гр', price: '350' },
          { name: 'Кальмар стружка', vol: '100 гр', price: '400' },
          { name: 'Фисташки', vol: '100 гр', price: '400' },
          { name: 'Арахис солено-жареный', vol: '100 гр', price: '200' },
        ],
      },
    ],
  },
  {
    group: 'Напитки',
    subs: [
      {
        sub: 'Вода и газировка',
        items: [
          { name: 'Вода газированная', vol: '0,33 л', price: '300' },
          { name: 'Вода негазированная', vol: '0,33 л', price: '300' },
          { name: 'Напиток АШ-ТАУ', vol: '0,5 л', price: '300' },
          { name: 'Добрый Cola', vol: '0,33 л', price: '300' },
          { name: 'Добрый Cola Zero', vol: '0,33 л', price: '300' },
          { name: 'Напиток Tonic', vol: '0,25 л', price: '300' },
          { name: 'Red Bull', vol: '0,25 л', price: '350' },
        ],
      },
      {
        sub: 'Лимонады',
        items: [
          { name: 'Клубника Лайм', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Малина Мята', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Классический', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Ананас Кокос', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Имбирный', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Манго Маракуйя', vol: '250 мл / 1000 мл', price: '300 / 700' },
          { name: 'Тархун', vol: '250 мл / 1000 мл', price: '300 / 700' },
        ],
      },
      {
        sub: 'Соки',
        items: [
          { name: 'Сок Яблочный', vol: '250 мл', price: '300' },
          { name: 'Сок Апельсиновый', vol: '250 мл', price: '300' },
          { name: 'Сок Вишневый', vol: '250 мл', price: '300' },
          { name: 'Сок Томатный', vol: '250 мл', price: '300' },
          { name: 'Сок Ананасовый', vol: '250 мл', price: '300' },
        ],
      },
      {
        sub: 'Кофе',
        items: [
          { name: 'Эспрессо', vol: '90 мл', price: '300' },
          { name: 'Американо', vol: '200 мл', price: '300' },
          { name: 'Капучино', vol: '200 мл', price: '400' },
          { name: 'Латте', vol: '250 мл', price: '400' },
        ],
      },
      {
        sub: 'Листовой чай · 800 мл',
        items: [
          { name: 'Айва с персиком', price: '500' },
          { name: 'Ассам', price: '500' },
          { name: 'Глинтвейн', price: '500' },
          { name: 'Земляника со сливками', price: '500' },
          { name: 'Императорский Пуэр', price: '500' },
          { name: 'Китайский Жасмин', price: '500' },
          { name: 'Манго-Маракуйя', price: '500' },
          { name: 'Милый фрукт', price: '500' },
          { name: 'Молочный Улун', price: '500' },
          { name: 'Поцелуй Гейши', price: '500' },
          { name: 'Ройбуш Карамель', price: '500' },
          { name: 'Сенча', price: '500' },
          { name: 'Улун Да Хун Пао', price: '500' },
        ],
      },
      {
        sub: 'Авторский чай · 800 мл',
        items: [
          { name: 'Малина Мята', price: '700' },
          { name: 'Грейпфрут Яблоко', price: '700' },
          { name: 'Яблочно - имбирный', price: '700' },
          { name: 'Грушевый с жасмином', price: '700' },
          { name: 'Клубника Лайм', price: '700' },
          { name: 'Облепиховый', price: '700' },
          { name: 'Пряная Вишня', price: '700' },
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
  intro:
    'Клубная карта EXIT 13 — в приложении: один QR для входа и бара, кешбэк бонусами, афиша с «Я иду» и бронь столов. Вход по номеру телефона, только для гостей 21+.',
  features: [
    { t: 'Вход по телефону', d: 'Регистрация по номеру телефона за минуту. Приложение — только для гостей 21+.' },
    { t: 'Афиша и «Я иду»', d: 'Вечеринки свайпом: постер, LINE-UP, цена. Нажал «Я иду» — ты в списке гостей.' },
    { t: 'Один QR', d: 'Клубная карта — личный QR-код. Показываешь его на входе и на баре.' },
    { t: 'Кешбэк бонусами', d: 'От 3% до 10% с покупок в клубе — процент растёт с суммой. 200 бонусов при регистрации.' },
    { t: 'Карта в Apple Wallet', d: 'На iPhone клубную карту можно добавить в Apple Wallet.' },
    { t: 'Бронь стола', d: 'Стол на плане зала с депозитом — его засчитаем в счёт бара. Подтверждать бронь не нужно.' },
    { t: 'Меню бара', d: 'Бар и кухня с ценами — с поиском по всем разделам.' },
    { t: 'Приглашай друзей', d: 'Бонусы получаете оба — после первого визита друга в клуб.' },
    { t: 'Уведомления', d: 'Сервисные пуши — например, о брони. Рекламные рассылки — только с твоего согласия.' },
  ],
  payment: {
    online: 'Онлайн — в приложении: карта, SberPay, СБП (ЮKassa).',
    onsite: 'На месте — карта, наличные, QR и СБП.',
  },
  // приложение в сторах с 2026-10-28 (Google Play) и 2026-11-04 (App Store)
  stores: [
    { name: 'App Store', href: 'https://apps.apple.com/app/id6789931582' },
    { name: 'Google Play', href: 'https://play.google.com/store/apps/details?id=ru.exit13.app' },
    { name: 'RuStore', status: 'скоро' },
  ] as Array<{ name: string; href?: string; status?: string }>,
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
// API клуба: '' — тот же origin (app.exit13.space и локальный dev-прокси), на GitHub Pages —
// абсолютный адрес app.exit13.space (см. vite.config.ts).
export const API_BASE = __API_BASE__
export const EVENTS_API = `${API_BASE}/events`

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
  { d: 'Вторник — четверг', h: '14:00–00:00', club: false },
  { d: 'Пятница, суббота', h: '22:00–06:00', club: true },
  { d: 'Воскресенье, понедельник', h: 'Закрыто', club: false },
]

export const BAR_FEATURES = [
  { t: 'Бизнес-ланчи', d: 'Вторник — четверг, с 14:00 до 17:00. Ланч — 450 ₽.' },
  { t: 'Кино-вечера', d: 'Вторник — четверг, с 20:00 до полуночи.' },
  { t: 'Вечеринки', d: 'Пятница и суббота, с 22:00 до 06:00: свет, звук и танцпол.' },
  { t: 'Бар и кухня', d: 'Коктейли, крепкое, вино и горячая кухня — всё меню с ценами ниже.' },
]

