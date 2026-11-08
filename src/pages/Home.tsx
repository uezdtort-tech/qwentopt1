import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Box, Cake, CakeSlice, ChefHat, Clock, Gift, GraduationCap, Heart, Layers, Leaf, Plus, Send, ShoppingBasket, Sparkles, Truck, Wand2, Zap } from "lucide-react";
import { CATEGORIES, CONFECTIONERS, IMG, PRODUCTS, REVIEWS, TICKER_ITEMS, TRUST_LABEL, fmt } from "../lib/data";
import type { Product } from "../lib/data";
import { useStore } from "../lib/store";
import { Counter, Reveal, SectionHead, Stars, TrustBadge } from "../components/ui";

const CAT_ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  cake: Cake, macaron: CakeSlice, wand: Wand2, layers: Layers, leaf: Leaf, box: Box, truck: Truck, hat: GraduationCap, book: BookOpen, gift: Gift,
};

/* ---------------- карточка товара ---------------- */
export function ProductCard({ p, delay = 0 }: { p: Product; delay?: number }) {
  const { addToCart, favorites, toggleFav } = useStore();
  const fav = favorites.includes(p.id);
  return (
    <Reveal delay={delay} className="group h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-berry-100/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-berry-200 hover:shadow-xl hover:shadow-berry-950/10">
        <Link to={`/product/${p.id}`} className="relative block overflow-hidden">
          <img src={p.image} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.06]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-berry-950/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {p.tag && (
            <span className="price-tag absolute left-0 top-3 bg-gold py-1 pl-5 pr-3 font-hand text-[13.5px] text-berry-950 shadow-md">{p.tag}</span>
          )}
        </Link>
        <button
          onClick={() => toggleFav(p.id)}
          aria-label="В избранное"
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-md backdrop-blur transition active:scale-90 ${fav ? "bg-berry-500 text-white" : "bg-white/90 text-berry-400 hover:text-berry-600"}`}
        >
          <Heart size={16} fill={fav ? "currentColor" : "none"} />
        </button>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/product/${p.id}`} className="font-display text-[1.06rem] font-bold italic leading-snug text-berry-900 transition group-hover:text-berry-600">{p.title}</Link>
          </div>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-slate-500">{p.desc}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <Stars value={p.rating} size={12} />
            <span className="font-mono text-[11px] text-slate-400">{p.rating} · {p.reviews}</span>
          </div>
          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <p className="font-mono text-[17px] font-bold text-berry-800">{fmt(p.price)}</p>
              {p.oldPrice && <p className="font-mono text-[11.5px] text-slate-400 line-through">{fmt(p.oldPrice)}</p>}
              <p className="text-[10.5px] text-slate-400">{p.weight}</p>
            </div>
            <button
              onClick={() => addToCart(p.id)}
              className="flex items-center gap-1.5 rounded-md bg-berry-500 px-3 py-2 text-[12.5px] font-semibold text-white shadow-md shadow-berry-500/25 transition hover:bg-berry-600 hover:shadow-lg active:scale-95"
            >
              <Plus size={14} /> В корзину
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- главная ---------------- */
export default function Home() {
  const [tab, setTab] = useState<"hit" | "new" | "diet">("hit");
  const nav = useNavigate();
  const { addToCart } = useStore();

  const filtered =
    tab === "hit" ? PRODUCTS.filter((p) => p.tag) :
    tab === "new" ? [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4) :
    PRODUCTS.filter((p) => p.diets.length > 0);

  return (
    <main>
      {/* ======== ВИТРИНА ======== */}
      <section className="paper-band relative overflow-hidden">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-berry-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <Reveal dir="left">
            <p className="flex items-center gap-2 font-hand text-2xl text-berry-500">
              <Sparkles size={18} className="text-gold" /> пекёмъ каждое утро съ 1913 года
            </p>
            <h1 className="mt-3 font-display text-[2.6rem] font-bold italic leading-[1.04] tracking-tight text-berry-900 sm:text-6xl lg:text-[4.2rem]">
              Кондитерская<br />
              <span className="text-berry-500">уезднаго</span> города
            </h1>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-slate-600">
              Медовики, наполеоны и муссовые торты отъ <b className="text-berry-700">427 домашнихъ кондитеровъ</b> —
              съ эскроу-оплатой, доставкою день-в-день и бонусами за каждый заказъ.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/catalog" className="group flex items-center gap-2 rounded-md bg-berry-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-xl shadow-berry-500/30 transition hover:-translate-y-0.5 hover:bg-berry-600 active:translate-y-0">
                Смотрѣть витрину <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </Link>
              <Link to="/builder" className="flex items-center gap-2 rounded-md border-2 border-berry-500 px-5 py-3 text-[15px] font-semibold text-berry-600 transition hover:bg-berry-500/5">
                <Wand2 size={17} /> Собрать свой тортъ
              </Link>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Кондитеровъ</dt>
                <dd className="font-display text-2xl font-bold italic text-berry-800"><Counter to={427} /></dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Тортовъ испечено</dt>
                <dd className="font-display text-2xl font-bold italic text-berry-800"><Counter to={38214} /></dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Средній рейтингъ</dt>
                <dd className="font-display text-2xl font-bold italic text-berry-800">4,9<span className="text-base text-gold">★</span></dd>
              </div>
            </dl>
          </Reveal>

          <Reveal dir="right" delay={120} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative">
              <div className="arch overflow-hidden border-[10px] border-white shadow-2xl shadow-berry-950/25 ring-1 ring-berry-100">
                <img src={IMG.hero} alt="Парадный торт на витрине" className="aspect-[4/4.6] w-full object-cover" />
              </div>
              {/* пар */}
              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-2 text-berry-300">
                {[0, 1, 2].map((i) => <span key={i} className="animate-steam block h-2 w-2 rounded-full bg-berry-300/70" style={{ animationDelay: `${i * 0.7}s` }} />)}
              </div>
              {/* штамп */}
              <div className="animate-stamp absolute -left-4 top-8 rotate-[-8deg] rounded border-[3px] border-berry-500/80 px-3 py-1.5 text-center shadow-sm">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-berry-500">Свѣжая выпечка</p>
                <p className="font-display text-sm font-bold italic text-berry-600">сегодня въ 8:00</p>
              </div>
              {/* ценник */}
              <div className="animate-floaty absolute -right-3 bottom-10 sm:-right-6">
                <div className="price-tag bg-berry-900 py-2.5 pl-6 pr-4 text-white shadow-xl">
                  <p className="font-hand text-[13px] text-berry-200">медовикъ дня</p>
                  <p className="font-mono text-lg font-bold text-gold">{fmt(2400)}</p>
                </div>
              </div>
              {/* мини-карточка */}
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-lg border border-berry-100 bg-white p-2.5 pr-4 shadow-xl sm:-left-6">
                <img src={IMG.bento} alt="" className="arch-sm h-12 w-12 object-cover" />
                <div>
                  <p className="text-[12px] font-bold text-berry-900">Бенто за 24 часа</p>
                  <button onClick={() => { addToCart("bento"); }} className="flex items-center gap-1 text-[11.5px] font-semibold text-gold transition hover:text-berry-600">
                    <Zap size={11} /> въ корзину — 1 500 ₽
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* бегущая строка */}
        <div className="relative border-y-2 border-berry-900/80 bg-berry-900 py-2.5 text-berry-100">
          <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="flex items-center gap-8 font-mono text-[12px] uppercase tracking-[0.14em]">
                {t} <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======== ОТДЕЛЫ ======== */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <SectionHead kicker="что желаете-съ?" title={<>Отдѣлы лавки</>} sub="Десять отдѣленій — отъ парадныхъ свадебныхъ тортовъ до магазина формъ и насадокъ для самихъ кондитеровъ." />
        <div className="no-scrollbar mt-9 flex snap-x gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {CATEGORIES.map((c, i) => {
            const Icon = CAT_ICONS[c.icon] || Cake;
            const to = c.id === "constructor" ? "/builder" : c.id === "recipes" ? "/recipes" : c.id === "gifts" ? "/gifts" : "/catalog?cat=" + c.id;
            return (
              <Reveal key={c.id} delay={i * 40} className="snap-start">
                <Link to={to} className={`group flex min-w-[168px] flex-col justify-between rounded-xl border border-berry-100/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-berry-300 hover:bg-berry-50/60 hover:shadow-lg lg:min-w-0 ${c.wide ? "lg:col-span-2 bg-berry-900 !border-berry-800" : ""}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-lg transition ${c.wide ? "bg-berry-700 text-gold group-hover:rotate-6" : "bg-berry-50 text-berry-500 group-hover:rotate-6 group-hover:bg-berry-100"}`}>
                    <Icon size={19} />
                  </span>
                  <span className="mt-5">
                    <span className={`block font-display text-[1.05rem] font-bold italic ${c.wide ? "text-white" : "text-berry-900"}`}>{c.title}</span>
                    <span className={`mt-0.5 block text-[11.5px] leading-snug ${c.wide ? "text-berry-200/80" : "text-slate-400"}`}>{c.note}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ======== ВИТРИНА ДНЯ ======== */}
      <section className="paper-band border-y border-berry-100/70 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead center={false} kicker="прямо изъ печи" title={<>Сегодня на витринѣ</>} />
            <div className="flex rounded-lg border border-berry-100 bg-white p-1 shadow-sm">
              {([["hit", "Хиты"], ["new", "Любимцы"], ["diet", "Диетическіе"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={`rounded-md px-4 py-2 text-[13px] font-semibold transition ${tab === id ? "bg-berry-500 text-white shadow" : "text-slate-500 hover:text-berry-600"}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.slice(0, 8).map((p, i) => <ProductCard key={p.id + tab} p={p} delay={i * 60} />)}
          </div>
          <div className="mt-8 text-center">
            <Link to="/catalog" className="group inline-flex items-center gap-2 rounded-md border-2 border-berry-500 px-6 py-3 font-semibold text-berry-600 transition hover:bg-berry-500 hover:text-white">
              Вся витрина · {PRODUCTS.length} позицій <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======== КОНСТРУКТОР ======== */}
      <section className="relative overflow-hidden bg-berry-950 py-16 text-white lg:py-20">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-berry-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <Reveal dir="left">
            <p className="font-hand text-2xl text-berry-300">соберите за 8 шаговъ</p>
            <h2 className="mt-2 font-display text-4xl font-bold italic leading-tight lg:text-5xl">
              Тортъ вашей <span className="shimmer-text">мечты</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-berry-100/75">
              Мероприятіе, основа, начинка, покрытие, декоръ, діета, доставка — и резюме.
              Запросъ уйдётъ сразу трёмъ кондитерамъ, а цѣна считается на глазахъ.
            </p>
            <ol className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5">
              {["Мероприятіе", "Основа", "Начинка", "Покрытие", "Декоръ", "Діета", "Доставка", "Резюме"].map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-[13.5px] text-berry-100/85">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/60 font-mono text-[11px] font-bold text-gold">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <Link to="/builder" className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 text-[15px] font-bold text-berry-950 shadow-xl shadow-gold/20 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0">
              <Wand2 size={17} /> Начать сборку <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal dir="right" delay={120}>
            <div className="relative mx-auto max-w-sm">
              {/* схематичный торт */}
              <div className="rounded-2xl border border-berry-700/70 bg-berry-900/70 p-8 shadow-2xl backdrop-blur">
                <div className="mx-auto flex w-56 flex-col items-center">
                  <span className="animate-floaty mb-2 block h-3 w-3 rounded-full bg-gold shadow-lg shadow-gold/50" />
                  <div className="h-10 w-32 rounded-t-xl border-2 border-berry-200/60 bg-berry-100/90" />
                  <div className="h-12 w-44 border-2 border-x-2 border-berry-200/60 bg-berry-200/80" />
                  <div className="flex h-14 w-56 items-end justify-center gap-1 rounded-b-lg border-2 border-t-0 border-berry-200/60 bg-berry-300/70 pb-1">
                    {["#D8556B", "#A8C686", "#E8B04B", "#7C83B8"].map((c, i) => <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
                  </div>
                  <div className="mt-2 h-2 w-64 rounded-full bg-berry-700" />
                </div>
                <div className="mt-6 space-y-2 font-mono text-[12px]">
                  <div className="flex justify-between text-berry-200"><span>основа + начинка</span><span>2 800 ₽</span></div>
                  <div className="flex justify-between text-berry-200"><span>зеркальная глазурь</span><span>+ 700 ₽</span></div>
                  <div className="flex justify-between text-berry-200"><span>свѣжія ягоды</span><span>+ 500 ₽</span></div>
                  <div className="flex justify-between border-t border-berry-700 pt-2 text-[14px] font-bold text-gold"><span>итого, 1,5 кг</span><span>5 600 ₽</span></div>
                </div>
              </div>
              <p className="animate-floaty absolute -right-4 -top-4 rotate-6 rounded-md bg-white px-3 py-1.5 font-hand text-[15px] text-berry-600 shadow-lg" style={{ animationDelay: "1.2s" }}>цѣна живая!</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== МАСТЕРЫ ======== */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <Reveal dir="left" className="relative order-2 lg:order-1">
          <div className="arch overflow-hidden border-8 border-berry-100 shadow-xl">
            <img src={IMG.atelier} alt="Кондитер за работой в ателье" className="aspect-[4/3.4] w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-2 rounded-lg border border-berry-100 bg-white px-4 py-3 shadow-xl sm:-right-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">инспекція качества</p>
            <p className="font-display text-lg font-bold italic text-green-700">98,2% проходятъ</p>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHead center={false} kicker="люди, а не фабрики" title={<>Мастера уѣзда</>} sub="Каждый кондитеръ проходитъ инспекцію качества, а его кухня — сертификацію. Уровни доверія видны сразу." />
          <div className="mt-7 space-y-3">
            {CONFECTIONERS.slice(0, 4).map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <Link to="/confectioners" className="group flex items-center gap-4 rounded-xl border border-berry-100/80 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-berry-300 hover:shadow-lg">
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-berry-500 p-3 font-display text-lg font-bold italic text-white">{c.portrait}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-display text-[15.5px] font-bold italic text-berry-900">{c.name}</span>
                      <TrustBadge trust={c.trust} />
                    </span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">{c.atelier} · {c.city} · {c.spec.slice(0, 2).join(", ")}</span>
                  </span>
                  <span className="text-right">
                    <span className="flex items-center justify-end gap-1 font-mono text-[13px] font-bold text-berry-800">{c.rating} <span className="text-gold">★</span></span>
                    <span className="block font-mono text-[10.5px] text-slate-400">{c.reviews} отзывовъ</span>
                  </span>
                  <ArrowRight size={16} className="text-berry-300 transition group-hover:translate-x-1 group-hover:text-berry-500" />
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {(Object.keys(TRUST_LABEL) as (keyof typeof TRUST_LABEL)[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5 rounded-full border border-berry-100 bg-paper px-3 py-1.5 text-[12px] text-slate-500">
                <span className={`h-2 w-2 rounded-full ${t === "NEW" ? "bg-slate-400" : t === "VERIFIED" ? "bg-sky-500" : t === "MASTER" ? "bg-gold" : "bg-berry-500"}`} />
                {TRUST_LABEL[t]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======== ГОСТЕВАЯ КНИГА ======== */}
      <section className="border-y border-berry-100/70 bg-berry-50/50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead kicker="гостевая книга" title={<>Что пишутъ гости</>} sub="Отзывы модерируются, а дегустаторы платформы помѣчаютъ сертифицированныя рецензіи." />
          <div className="no-scrollbar mt-9 flex snap-x gap-4 overflow-x-auto pb-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.id} delay={i * 60} className="w-[300px] shrink-0 snap-start sm:w-[360px]">
                <figure className="flex h-full flex-col rounded-xl border border-berry-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Stars value={r.rating} size={13} />
                  <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-slate-600">«{r.text}»</blockquote>
                  <figcaption className="mt-4 border-t border-dashed border-berry-200 pt-3">
                    <p className="font-hand text-[17px] text-berry-600">{r.author}</p>
                    <p className="mt-0.5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-slate-400">
                      <span>{r.role}</span><span>{r.date}</span>
                    </p>
                    <p className="mt-1 text-[11.5px] text-slate-400">къ товару: {r.product}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======== ЛОЯЛЬНОСТЬ ======== */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal delay={0}>
            <div className="flex h-full flex-col rounded-xl bg-berry-500 p-6 text-white shadow-xl shadow-berry-500/20 transition hover:-translate-y-1">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-berry-400/40"><Sparkles size={20} className="text-gold" /></span>
              <h3 className="mt-4 font-display text-2xl font-bold italic">Бонусная лѣсенка</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-berry-100/85">1 бонусъ = 1 ₽. Кэшбэкъ растётъ съ уровнемъ: Бронза 3%, Серебро 5%, Золото 7%, Платина 10%.</p>
              <div className="mt-4 space-y-1.5 font-mono text-[12px]">
                {[["Бронза", "3%", 30], ["Серебро", "5%", 55], ["Золото", "7%", 80], ["Платина", "10%", 100]].map(([n, p, w]) => (
                  <div key={n as string} className="flex items-center gap-2">
                    <span className="w-16 text-berry-200">{n}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-berry-400/30"><span className="block h-full rounded-full bg-gold" style={{ width: `${w}%` }} /></span>
                    <span className="w-9 text-right text-gold">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="flex h-full flex-col rounded-xl border border-berry-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-berry-50 text-berry-500"><Gift size={20} /></span>
              <h3 className="mt-4 font-display text-2xl font-bold italic text-berry-900">Подарочные сертификаты</h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-slate-500">Номиналы отъ 500 до 10 000 ₽, срокъ — 12 мѣсяцевъ, доставка на почту или курьеромъ въ красивой коробкѣ.</p>
              <Link to="/gifts" className="mt-4 inline-flex items-center gap-2 font-semibold text-berry-600 transition hover:text-berry-800">Выбрать номиналъ <ArrowRight size={15} /></Link>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex h-full flex-col rounded-xl border border-berry-100 bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-gold/15 text-gold"><Send size={20} /></span>
              <h3 className="mt-4 font-display text-2xl font-bold italic text-berry-900">Приведи пріятеля</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">Вамъ — 300 ₽ послѣ его перваго заказа, ему — 500 ₽ на первый заказъ. Кодъ живётъ въ личномъ кабинетѣ.</p>
              <p className="mt-4 rounded-md border border-dashed border-gold/60 bg-white px-3 py-2.5 text-center font-mono text-[13px] font-bold tracking-widest text-berry-700">CONDIT-XXXXX</p>
              <button onClick={() => nav("/dashboard")} className="mt-3 text-[13px] font-semibold text-berry-600 transition hover:text-berry-800">Получить свой кодъ →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ======== КАК ЭТО РАБОТАЕТ (эскроу) ======== */}
      <section className="border-t border-berry-100/70 bg-paper py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead kicker="честная сдѣлка" title={<>Деньги ждутъ доставки</>} sub="Эскроу-схема защищаетъ обѣ стороны: покупатель платитъ сразу, но кондитеръ получаетъ деньги только послѣ доставки." />
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { icon: <ShoppingBasket size={19} />, t: "Заказъ и оплата", d: "Картой или СБПъ черезъ YooKassa — деньги уходятъ на защищённый эскроу-счётъ." },
              { icon: <ChefHat size={19} />, t: "Кондитеръ печётъ", d: "Мастеръ видитъ заказъ, подтверждаетъ и начинаетъ работу. Вы слѣдите за статусами." },
              { icon: <Truck size={19} />, t: "Доставка день-в-день", d: "Курьеръ, самовывозъ или личная доставка кондитера — какъ удобно." },
              { icon: <Clock size={19} />, t: "Выплата мастеру", d: "Черезъ 7 дней послѣ доставки эскроу отпускаетъ деньги за вычетомъ комиссіи 5–15%." },
            ].map((s, i) => (
              <Reveal key={s.t} delay={i * 80} className="relative">
                <div className="h-full rounded-xl border border-berry-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-berry-500 text-white">{s.icon}</span>
                    <span className="font-display text-3xl font-bold italic text-berry-200">0{i + 1}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold italic text-berry-900">{s.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{s.d}</p>
                </div>
                {i < 3 && <ArrowRight size={18} className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-berry-300 md:block" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
