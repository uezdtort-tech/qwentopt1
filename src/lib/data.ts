/* ------------------------------------------------------------------ */
/*  «Уездный кондитер» — доменные типы и демонстрационные данные       */
/* ------------------------------------------------------------------ */

const I = {
  hero: "https://image.qwenlm.ai/generated-images/175f6b74-65d7-48b9-b804-c58850bad7a3/_result.png",
  medovik: "https://image.qwenlm.ai/generated-images/9a9d2d40-26d8-4a17-b36f-2ddf4f1d93ba/_result.png",
  napoleon: "https://image.qwenlm.ai/generated-images/1dfaaccd-3746-4030-aed7-c3a76edcc54f/_result.png",
  redvelvet: "https://image.qwenlm.ai/generated-images/a7b358c2-d061-453e-babf-61c97db7fbb1/_result.png",
  mousse: "https://image.qwenlm.ai/generated-images/ee98ed73-88ab-4fb4-9ef0-d336fc53c934/_result.png",
  pistachio: "https://image.qwenlm.ai/generated-images/69111661-b5c5-47ed-a54a-a1df7710d2e4/_result.png",
  macarons: "https://image.qwenlm.ai/generated-images/21a1a411-1efc-4743-ae02-21b7c9912fa0/_result.png",
  wedding: "https://image.qwenlm.ai/generated-images/9eeaf941-847f-44b7-b5e2-6e663ac4c3fa/_result.png",
  bento: "https://image.qwenlm.ai/generated-images/e2920fc1-d343-4c2c-ad7b-4e08e6d28aab/_result.png",
  atelier: "https://image.qwenlm.ai/generated-images/c4feda81-e561-482d-8435-e1cc9ab6b97c/_result.png",
};
export const IMG = I;

export type Role =
  | "GUEST" | "CUSTOMER" | "CONFECTIONER" | "COURIER" | "SUPPLIER"
  | "ADMIN" | "MODERATOR" | "SUPPORT" | "TASTER" | "BLOGGER";

export const ROLE_LABEL: Record<string, string> = {
  GUEST: "Гость", CUSTOMER: "Покупатель", CONFECTIONER: "Кондитер",
  COURIER: "Курьер", SUPPLIER: "Поставщик", ADMIN: "Администратор",
  MODERATOR: "Модератор", SUPPORT: "Поддержка", TASTER: "Дегустатор", BLOGGER: "Блогер",
};

export interface Category { id: string; title: string; note: string; icon: string; wide?: boolean }
export const CATEGORIES: Category[] = [
  { id: "tortes", title: "Торты", note: "бисквитные, муссовые, свадебные", icon: "cake", wide: true },
  { id: "desserts", title: "Десерты", note: "макаруны, эклеры, тарты", icon: "macaron" },
  { id: "constructor", title: "Торты на заказ", note: "конструктор из 8 шагов", icon: "wand", wide: true },
  { id: "fillings", title: "Начинки", note: "50+ вкусов, 10 семейств", icon: "layers" },
  { id: "diet", title: "Диетические", note: "без глютена, веган, кето", icon: "leaf" },
  { id: "decor-shop", title: "Магазин декора", note: "формы, насадки, красители", icon: "box" },
  { id: "services", title: "Услуги", note: "доставка, монтаж, фотосъёмка", icon: "truck" },
  { id: "lessons", title: "Мастер-классы", note: "ателье кондитеров", icon: "hat" },
  { id: "recipes", title: "Рецепты", note: "блог с пошаговыми рецептами", icon: "book" },
  { id: "gifts", title: "Сертификаты", note: "подарочные, 500–10 000 ₽", icon: "gift" },
];

export interface FillingGroup { id: string; title: string; items: { name: string; price: number }[] }
export const FILLINGS: FillingGroup[] = [
  { id: "CREAM", title: "Кремовые", items: [{ name: "Пломбир", price: 0 }, { name: "Сливочный чиз", price: 150 }, { name: "Маскарпоне-ваниль", price: 250 }, { name: "Швейцарская меренга", price: 200 }] },
  { id: "CHOCOLATE", title: "Шоколадные", items: [{ name: "Ганаш 70%", price: 300 }, { name: "Шоколадный мусс", price: 280 }, { name: "Брауни-крошка", price: 220 }] },
  { id: "BERRY", title: "Ягодные", items: [{ name: "Клубника-конфи", price: 250 }, { name: "Малина-фиалка", price: 280 }, { name: "Вишня в роме", price: 260 }, { name: "Ежевика-лаванда", price: 300 }, { name: "Черника", price: 240 }] },
  { id: "CARAMEL", title: "Карамельные", items: [{ name: "Солёная карамель", price: 220 }, { name: "Варёная сгущёнка", price: 180 }, { name: "Дульсе де лече", price: 260 }] },
  { id: "NUT", title: "Ореховые", items: [{ name: "Фисташка-малина", price: 350 }, { name: "Миндальный франжипан", price: 280 }, { name: "Фундук-пралине", price: 300 }] },
  { id: "FRUIT", title: "Фруктовые", items: [{ name: "Манго-маракуйя", price: 280 }, { name: "Персик-жасмин", price: 260 }, { name: "Ананас-кокос", price: 240 }] },
  { id: "CLASSIC", title: "Классические", items: [{ name: "Медовая", price: 0 }, { name: "Наполеон-заварная", price: 0 }, { name: "Прага", price: 120 }, { name: "Сметанная «Грация»", price: 100 }] },
  { id: "MOUSSE", title: "Муссовые", items: [{ name: "Мята-шоколад", price: 300 }, { name: "Лимон-базилик", price: 280 }] },
  { id: "CUSTARD", title: "Заварные", items: [{ name: "Патисьер", price: 150 }, { name: "Крем-муслин", price: 200 }] },
  { id: "OTHER", title: "Авторские", items: [{ name: "Пряный чай масала", price: 260 }, { name: "Цветочный (роза-личи)", price: 320 }] },
];

export interface Diet { id: string; title: string }
export const DIETS: Diet[] = [
  { id: "gf", title: "Без глютена" }, { id: "lf", title: "Без лактозы" },
  { id: "sf", title: "Без сахара" }, { id: "vegan", title: "Веганский" },
  { id: "keto", title: "Кето" }, { id: "halal", title: "Халяль" },
  { id: "kosher", title: "Кошерный" }, { id: "hypo", title: "Гипоаллергенный" },
];

export interface Product {
  id: string; title: string; category: string; price: number; oldPrice?: number;
  weight: string; image: string; confectionerId: string; rating: number; reviews: number;
  fillings: string[]; diets: string[]; tag?: string; desc: string; layers: string[];
}

export const PRODUCTS: Product[] = [
  { id: "medovik", title: "Медовик «Уездный»", category: "tortes", price: 2400, oldPrice: 2900, weight: "1,2 кг", image: I.medovik, confectionerId: "c1", rating: 4.9, reviews: 127, fillings: ["Медовая", "Сметанная «Грация»"], diets: [], tag: "Хитъ витрины", desc: "Девять тончайших коржей на гречишном меду, сметанный крем по рецепту 1913 года и крошка грецкого ореха.", layers: ["#E8B04B", "#F7E8C9", "#E8B04B", "#F7E8C9", "#E8B04B"] },
  { id: "napoleon", title: "Наполеон классический", category: "tortes", price: 2200, weight: "1,1 кг", image: I.napoleon, confectionerId: "c2", rating: 4.8, reviews: 98, fillings: ["Наполеон-заварная", "Патисьер"], diets: [], desc: "Слоёное тесто ручной раскатки, заварной крем на мадагаскарской ванили, сутки пропитки.", layers: ["#F0D9A8", "#FBF3DF", "#F0D9A8", "#FBF3DF", "#F0D9A8", "#FBF3DF"] },
  { id: "redvelvet", title: "Красный бархат", category: "tortes", price: 2600, weight: "1,3 кг", image: I.redvelvet, confectionerId: "c1", rating: 4.9, reviews: 143, fillings: ["Сливочный чиз", "Клубника-конфи"], diets: [], tag: "Выборъ гостей", desc: "Влажные бархатные коржи какао, крем-чиз на сливках и клубничное конфи между ярусами.", layers: ["#A32638", "#F8EFE4", "#A32638", "#F8EFE4", "#A32638"] },
  { id: "mousse-choco", title: "Муссовый «Двойной шоколад»", category: "tortes", price: 3100, weight: "1,0 кг", image: I.mousse, confectionerId: "c3", rating: 5.0, reviews: 64, fillings: ["Ганаш 70%", "Шоколадный мусс"], diets: ["sf"], desc: "Французская техника: зеркальная глазурь, хрустящий слой пралине, мусс на шоколаде 70%.", layers: ["#4A2C2A", "#6B4638", "#3B2320", "#6B4638", "#4A2C2A"] },
  { id: "pistachio", title: "Фисташка-малина", category: "tortes", price: 3400, weight: "1,2 кг", image: I.pistachio, confectionerId: "c4", rating: 4.9, reviews: 81, fillings: ["Фисташка-малина", "Маскарпоне-ваниль"], diets: ["gf"], tag: "Новинка", desc: "Фисташковый бисквит, малиновое конфи, крем на маскарпоне. Выпечка без глютена.", layers: ["#A8C686", "#F8EFE4", "#D8556B", "#F8EFE4", "#A8C686"] },
  { id: "wedding", title: "Свадебный «Три яруса»", category: "tortes", price: 12900, weight: "4,5 кг", image: I.wedding, confectionerId: "c3", rating: 5.0, reviews: 37, fillings: ["Миндальный франжипан", "Персик-жасмин"], diets: [], tag: "Ручная работа", desc: "Три яруса, сахарные пионы ручной лепки, монтаж на площадке и дегустация в подарок.", layers: ["#F8EFE4", "#F3DCE2", "#F8EFE4", "#F3DCE2", "#F8EFE4"] },
  { id: "bento", title: "Бенто-торт с надписью", category: "tortes", price: 1500, weight: "0,5 кг", image: I.bento, confectionerId: "c5", rating: 4.8, reviews: 210, fillings: ["Сливочный чиз", "Варёная сгущёнка"], diets: [], tag: "За 24 часа", desc: "Мини-торт в крафтовой коробке, надпись кремом от руки, свечка и открытка в комплекте.", layers: ["#F8EFE4", "#E8B04B", "#F8EFE4"] },
  { id: "praha", title: "Прага по ГОСТу", category: "tortes", price: 2100, weight: "1,0 кг", image: I.mousse, confectionerId: "c2", rating: 4.7, reviews: 89, fillings: ["Прага", "Ганаш 70%"], diets: [], desc: "Тот самый вкус: шоколадные коржи, заварной крем с какао и абрикосовая помадка сверху.", layers: ["#5B3A2E", "#7A5138", "#5B3A2E", "#7A5138", "#5B3A2E"] },
  { id: "macarons", title: "Макаруны, набор 12 шт", category: "desserts", price: 1680, oldPrice: 1980, weight: "12 шт", image: I.macarons, confectionerId: "c4", rating: 4.9, reviews: 156, fillings: ["Малина-фиалка", "Фисташка-малина", "Лимон-базилик"], diets: ["gf"], tag: "Хитъ витрины", desc: "Французские пирожные на итальянской меренге: малина-фиалка, фисташка, лимон-базилик и ещё три вкуса.", layers: ["#D8556B", "#F8EFE4", "#A8C686"] },
  { id: "cheesecake", title: "Чизкейк Нью-Йорк", category: "tortes", price: 2300, weight: "1,1 кг", image: I.wedding, confectionerId: "c5", rating: 4.8, reviews: 74, fillings: ["Сливочный чиз", "Ваниль"], diets: [], desc: "Классический печёный чизкейк на песочной основе, томление при низкой температуре 4 часа.", layers: ["#F3E3C3", "#F8EFE4", "#F3E3C3"] },
  { id: "eclairs", title: "Эклеры ассорти, 6 шт", category: "desserts", price: 1140, weight: "6 шт", image: I.macarons, confectionerId: "c1", rating: 4.7, reviews: 68, fillings: ["Патисьер", "Крем-муслин"], diets: [], desc: "Заварное тесто, крем патисьер: шоколад, кофе, фисташка, ваниль, карамель, малина.", layers: ["#E8B04B", "#FBF3DF", "#6B4638"] },
  { id: "tart", title: "Тарт лимонный меренга", category: "desserts", price: 1900, weight: "0,9 кг", image: I.bento, confectionerId: "c6", rating: 4.8, reviews: 52, fillings: ["Лимон-базилик", "Швейцарская меренга"], diets: [], desc: "Хрустящее сабле, лимонный курд на сицилийских лимонах, обожжённая меренга.", layers: ["#F0D9A8", "#F2E28B", "#FBF3DF"] },
  { id: "truffles", title: "Трюфели ручной работы, 16 шт", category: "desserts", price: 1450, weight: "16 шт", image: I.mousse, confectionerId: "c6", rating: 4.9, reviews: 91, fillings: ["Ганаш 70%", "Дульсе де лече"], diets: ["sf"], desc: "Ганаш на бельгийском шоколаде, обсыпка из какао, сублимированной малины и фисташки.", layers: ["#4A2C2A", "#6B4638"] },
  { id: "keto-cake", title: "Кето-торт «Миндаль-черника»", category: "diet", price: 2900, weight: "1,0 кг", image: I.pistachio, confectionerId: "c6", rating: 4.6, reviews: 33, fillings: ["Черника", "Миндальный франжипан"], diets: ["keto", "sf", "gf"], desc: "Без муки и сахара: миндальная мука, эритрит, сливочный крем и черничное конфи.", layers: ["#E5D5B8", "#F8EFE4", "#7C83B8", "#F8EFE4", "#E5D5B8"] },
];

export interface Confectioner {
  id: string; name: string; atelier: string; city: string; rating: number; reviews: number;
  trust: "NEW" | "VERIFIED" | "MASTER" | "EXPERT"; tariff: "START" | "BASIC" | "PREMIUM" | "BUSINESS";
  spec: string[]; since: number; portrait: string; about: string;
}
export const CONFECTIONERS: Confectioner[] = [
  { id: "c1", name: "Анна Прянишникова", atelier: "Ателье «Медовый дворъ»", city: "Москва", rating: 4.9, reviews: 270, trust: "EXPERT", tariff: "PREMIUM", spec: ["Медовики", "Чизкейки", "Детские торты"], since: 2016, portrait: "АП", about: "Печёт медовики по семейному рецепту прабабушки, ведёт мастер-классы в собственном ателье на Пятницкой." },
  { id: "c2", name: "Пётр Караваев", atelier: "Пекарня «Каравай»", city: "Санкт-Петербург", rating: 4.8, reviews: 187, trust: "MASTER", tariff: "BASIC", spec: ["Наполеон", "Прага", "Классика"], since: 2018, portrait: "ПК", about: "Инженер, ставший кондитером. Восстанавливает рецепты ГОСТ и дореволюционных поваренных книг." },
  { id: "c3", name: "Мари Дюбуа", atelier: "Maison Musse", city: "Москва", rating: 5.0, reviews: 101, trust: "EXPERT", tariff: "BUSINESS", spec: ["Муссовые", "Свадебные", "Зеркальная глазурь"], since: 2014, portrait: "МД", about: "Училась в École Valrhona. Свадебные торты с монтажом на площадке и зеркальными глазурями." },
  { id: "c4", name: "Лейла Муратова", atelier: "«Фисташка»", city: "Казань", rating: 4.9, reviews: 237, trust: "MASTER", tariff: "PREMIUM", spec: ["Макаруны", "Фисташка", "Без глютена"], since: 2019, portrait: "ЛМ", about: "Специализация — французские десерты и выпечка без глютена. Сертификат халяль." },
  { id: "c5", name: "Ольга Ватрушкина", atelier: "«Бенто & точка»", city: "Екатеринбург", rating: 4.8, reviews: 318, trust: "VERIFIED", tariff: "BASIC", spec: ["Бенто-торты", "Капкейки", "Экспресс за 24 ч"], since: 2021, portrait: "ОВ", about: "Бенто-торты с рукописными надписями за 24 часа. Любимый кондитер студенчества Урала." },
  { id: "c6", name: "Давид Цукерман", atelier: "«Цукеръ»", city: "Москва", rating: 4.9, reviews: 143, trust: "MASTER", tariff: "PREMIUM", spec: ["Трюфели", "Кето", "Диетические"], since: 2017, portrait: "ДЦ", about: "Шоколатье с 20-летним стажем. Кето- и диабетические десерты без потери вкуса." },
];

export const TRUST_LABEL: Record<string, string> = {
  NEW: "Новичокъ", VERIFIED: "Проверенъ", MASTER: "Мастеръ", EXPERT: "Экспертъ",
};

export interface Tariff { id: string; price: number; commission: number; perks: string[] }
export const TARIFFS: Tariff[] = [
  { id: "START", price: 0, commission: 15, perks: ["Витрина в каталоге", "Чат с покупателями", "Эскроу-выплаты"] },
  { id: "BASIC", price: 990, commission: 10, perks: ["Всё из START", "Приоритет в поиске", "Статистика продаж"] },
  { id: "PREMIUM", price: 2990, commission: 7, perks: ["Всё из BASIC", "Мастер-классы на платформе", "Бейдж «Мастеръ»"] },
  { id: "BUSINESS", price: 9900, commission: 5, perks: ["Всё из PREMIUM", "Топ выдачи", "Персональный менеджер"] },
];

export interface Review { id: string; author: string; role: string; text: string; rating: number; product: string; date: string }
export const REVIEWS: Review[] = [
  { id: "r1", author: "Анна Сергеевна", role: "Покупатель · GOLD", text: "Медовик привезли к чаю ровно в пять, как и обещали. Коржи тончайшие, крем — как в детстве у бабушки в усадьбе. Заказываю третий раз.", rating: 5, product: "Медовик «Уездный»", date: "12 января 2026" },
  { id: "r2", author: "Игорь Волков", role: "Корпоративный клиент", text: "Заказывали 40 бенто-тортов с логотипом на день компании. Сделали за два дня, каждый — с индивидуальной надписью. Коллеги в восторге.", rating: 5, product: "Бенто-торт с надписью", date: "28 декабря 2025" },
  { id: "r3", author: "Мария Кузнецова", role: "Дегустатор платформы", text: "Муссовый «Двойной шоколад» — безупречная техника: глазурь зеркальная, мусс воздушный, пралине хрустит. Эталон для категории.", rating: 5, product: "Муссовый «Двойной шоколад»", date: "9 января 2026" },
  { id: "r4", author: "Семья Ланских", role: "Покупатели · PLATINUM", text: "Свадебный торт от Мари — украшение вечера. Дегустация заранее, монтаж в зале, ни одного нарекания. Отдельное спасибо за пионы из сахара.", rating: 5, product: "Свадебный «Три яруса»", date: "20 июля 2025" },
  { id: "r5", author: "Дмитрий П.", role: "Покупатель · SILVER", text: "Кето-торт — первый десерт за три года диеты, который я съел с удовольствием. Миндаль и черника отлично дружат.", rating: 5, product: "Кето-торт «Миндаль-черника»", date: "3 февраля 2026" },
  { id: "r6", author: "Вера Николаевна", role: "Покупатель · BRONZE", text: "Наполеон настоящий: тесто хрустит, крема много, не приторный. Курьер приехал за час до назначенного времени, позвонил заранее.", rating: 4, product: "Наполеон классический", date: "17 января 2026" },
];

export interface Recipe {
  id: string; title: string; category: string; time: string; difficulty: "Новичкам" | "Средне" | "Профи";
  author: string; cooked: number; image: string; intro: string; steps: string[]; ingredients: string[];
}
export const RECIPES: Recipe[] = [
  { id: "rec1", title: "Медовик за один вечер", category: "Классические", time: "3 часа", difficulty: "Средне", author: "Анна Прянишникова", cooked: 1284, image: I.medovik, intro: "Семейный рецепт в девять коржей. Секрет — гречишный мёд и сметана 30%.", ingredients: ["Мёд гречишный — 120 г", "Мука — 400 г", "Яйца — 2 шт", "Сметана 30% — 800 г", "Сода — 1 ч. л.", "Орехи грецкие — 100 г"], steps: ["Растопите мёд с содой на водяной бане до карамельного цвета.", "Введите яйца и муку, замесите мягкое тесто.", "Раскатайте 9 коржей по 2 мм, выпекайте при 180° по 4 минуты.", "Взбейте сметану с сахарной пудрой, не усердствуя.", "Промажьте коржи, обсыпьте крошкой, дайте пропитаться 6 часов."] },
  { id: "rec2", title: "Идеальная зеркальная глазурь", category: "Для профи", time: "1 час", difficulty: "Профи", author: "Мари Дюбуа", cooked: 763, image: I.mousse, intro: "Гляссаж, в котором торт отражается, как в самоваре. Рабочая температура — 32°.", ingredients: ["Шоколад белый — 150 г", "Сгущёнка — 100 г", "Сахар — 150 г", "Глюкоза — 150 г", "Желатин — 10 г", "Краситель гелевый"], steps: ["Замочите желатин в ледяной воде.", "Сварите сироп из сахара и глюкозы до 103°.", "Залейте шоколад со сгущёнкой, пробейте блендером.", "Добавьте желатин и краситель, процедите.", "Покрывайте замороженный торт при 32°."] },
  { id: "rec3", title: "Макаруны: итальянская меренга", category: "Авторские", time: "2 часа", difficulty: "Профи", author: "Лейла Муратова", cooked: 542, image: I.macarons, intro: "Метод итальянской меренги прощает ошибки новичкам меньше, но даёт идеальную «юбочку».", ingredients: ["Миндальная мука — 150 г", "Сахарная пудра — 150 г", "Белки — 2 × 55 г", "Сахар — 150 г", "Вода — 50 г"], steps: ["Смешайте муку с пудрой, просейте дважды.", "Сварите сироп до 118°.", "Взбейте белки, заварите сиропом, взбивайте до 40°.", "Вымесите макаронаж до «ленты».", "Отсадите, подсушите 30 минут, пеките при 140° — 14 минут."] },
  { id: "rec4", title: "Заварной крем патисьер", category: "Для новичков", time: "30 минут", difficulty: "Новичкам", author: "Пётр Караваев", cooked: 2107, image: I.napoleon, intro: "База половины классических тортов. Не бойтесь — заварной крем не сворачивается, если мешать.", ingredients: ["Молоко — 500 мл", "Желтки — 4 шт", "Сахар — 120 г", "Кукурузный крахмал — 40 г", "Ваниль — 1 стручок"], steps: ["Нагрейте молоко с ванилью до первых пузырей.", "Разотрите желтки с сахаром и крахмалом.", "Влейте горячее молоко тонкой струйкой.", "Верните на огонь, мешайте до загустения.", "Накройте плёнкой «в контакт», охладите."] },
  { id: "rec5", title: "Бенто-торт за вечер", category: "Для новичков", time: "1,5 часа", difficulty: "Новичкам", author: "Ольга Ватрушкина", cooked: 976, image: I.bento, intro: "Мини-торт на 500 граммов — идеальный первый заказ и лучший подарок.", ingredients: ["Бисквит ванильный — 2 коржа 10 см", "Крем-чиз — 300 г", "Конфи ягодное — 100 г", "Коробка крафтовая", "Свечка и открытка"], steps: ["Выровняйте коржи, пропитайте сиропом.", "Соберите в кольце 10 см: корж, крем, конфи.", "Охладите 2 часа, выровняйте остатками крема.", "Сделайте надпись растопленным шоколадом из корнетика.", "Упакуйте: подложка, лента, открытка."] },
  { id: "rec6", title: "Веганский шоколадный мусс", category: "Авторские", time: "40 минут", difficulty: "Средне", author: "Давид Цукерман", cooked: 418, image: I.mousse, intro: "Аквафаба взбивается не хуже белков, а кокосовые сливки дают плотность.", ingredients: ["Шоколад 70% — 200 г", "Кокосовые сливки — 400 мл", "Аквафаба — 120 мл", "Сахар — 60 г"], steps: ["Растопите шоколад с половиной сливок.", "Взбейте аквафабу с сахаром до плотных пиков.", "Взбейте оставшиеся сливки.", "Соедините в три приёма, движениями снизу вверх.", "Разлейте по креманкам, охлаждайте 4 часа."] },
];

export const BUILDER_EVENTS = [
  { id: "wedding", title: "Свадьба", icon: "rings", base: 8000 },
  { id: "birthday", title: "День рождения", icon: "party", base: 2200 },
  { id: "kids", title: "Детский праздник", icon: "balloon", base: 2500 },
  { id: "corporate", title: "Корпоратив", icon: "briefcase", base: 4000 },
  { id: "anniversary", title: "Юбилей", icon: "medal", base: 3200 },
  { id: "just", title: "Просто к чаю", icon: "tea", base: 1600 },
];
export const BUILDER_BASES = [
  { id: "biscuit", title: "Бисквит классический", price: 0, note: "ваниль, шоколад или красный бархат" },
  { id: "mousse", title: "Муссовый", price: 600, note: "французская техника, зеркальная глазурь" },
  { id: "cheesecake", title: "Чизкейк", price: 400, note: "печёный или холодный, на песочной основе" },
  { id: "honey", title: "Медовые коржи", price: 300, note: "тонкие коржи на гречишном меду" },
];
export const BUILDER_COATINGS = [
  { id: "cream", title: "Кремовое выравнивание", price: 0 },
  { id: "ganache", title: "Ганаш шоколадный", price: 350 },
  { id: "mirror", title: "Зеркальная глазурь", price: 700 },
  { id: "mastic", title: "Мастика", price: 500 },
];
export const BUILDER_DECORS = [
  { id: "flowers", title: "Съедобные цветы", price: 450 },
  { id: "inscription", title: "Надпись от руки", price: 200 },
  { id: "chocolate", title: "Шоколадный декор", price: 400 },
  { id: "berries", title: "Свежие ягоды", price: 500 },
  { id: "photo", title: "Печать на вафельной бумаге", price: 600 },
  { id: "none", title: "Без декора", price: 0 },
];
export const WEIGHTS = [
  { id: "1", label: "1 кг · 6–8 гостей", mult: 1 },
  { id: "1.5", label: "1,5 кг · 10–12 гостей", mult: 1.4 },
  { id: "2", label: "2 кг · 14–16 гостей", mult: 1.75 },
  { id: "3", label: "3 кг · 20+ гостей", mult: 2.4 },
];

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "IN_DELIVERY", "DELIVERED", "COMPLETED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Ожидаетъ", CONFIRMED: "Подтверждёнъ", PREPARING: "В печи", READY: "Готовъ",
  IN_DELIVERY: "Въ пути", DELIVERED: "Доставленъ", COMPLETED: "Завершёнъ",
};

export const BASE_PROMOS = [
  { code: "WELCOME10", type: "percent" as const, value: 10, minOrder: 1500, note: "Скидка 10% на первый заказ от 1 500 ₽" },
  { code: "FREEDEL", type: "free_delivery" as const, value: 0, minOrder: 2000, note: "Бесплатная доставка от 2 000 ₽" },
  { code: "MASLENITSA500", type: "fixed" as const, value: 500, minOrder: 3000, note: "500 ₽ на заказы от 3 000 ₽ до конца Масленицы" },
];

export const TICKER_ITEMS = [
  "Медовикъ по рецепту 1913 года", "Наполеонъ — сутки пропитки", "Макаруны на итальянской меренгѣ",
  "Эскроу: деньги кондитеру послѣ доставки", "Зеркальная глазурь 32°", "Бенто-тортъ за 24 часа",
  "Бонусъ 500 ₽ при регистраціи", "Дегустація свадебныхъ тортовъ", "Доставка день-в-день по Москве",
];

export const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";
export const fmtShort = (n: number) => (n >= 1000 ? (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(".", ",") + " тыс." : String(n));
