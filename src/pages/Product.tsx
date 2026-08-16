import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShieldCheck, ShoppingBasket, Truck } from "lucide-react";
import { CONFECTIONERS, DIETS, PRODUCTS, REVIEWS, fmt } from "../lib/data";
import { useStore } from "../lib/store";
import { Reveal, Stars, TrustBadge, EmptyState } from "../components/ui";
import { ProductCard } from "./Home";

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart, favorites, toggleFav, pushToast, user, setAuthOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState title="Такого торта нѣтъ на витринѣ" sub="Возможно, его уже съели. Загляните в каталог — там много другого." action={<Link to="/catalog" className="rounded-md bg-berry-500 px-5 py-2.5 text-sm font-semibold text-white">В каталог</Link>} />
      </main>
    );
  }

  const conf = CONFECTIONERS.find((c) => c.id === p.confectionerId)!;
  const gallery = [p.image, ...PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 2).map((x) => x.image)];
  const fav = favorites.includes(p.id);
  const similar = PRODUCTS.filter((x) => x.id !== p.id && (x.category === p.category || x.confectionerId === p.confectionerId)).slice(0, 4);
  const reviews = REVIEWS.slice(0, 3);

  const buyNow = () => {
    addToCart(p.id, qty);
    nav("/checkout");
  };

  return (
    <main className="paper-band">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <button onClick={() => nav(-1)} className="mb-6 flex items-center gap-2 text-[13.5px] font-medium text-slate-500 transition hover:text-berry-600">
          <ArrowLeft size={15} /> Назадъ къ витринѣ
        </button>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* галерея */}
          <Reveal dir="left">
            <div className="relative">
              <div className="arch overflow-hidden border-8 border-white shadow-2xl shadow-berry-950/15 ring-1 ring-berry-100">
                <img src={gallery[imgIdx]} alt={p.title} className="aspect-square w-full object-cover" />
              </div>
              {p.tag && <span className="price-tag absolute left-0 top-8 bg-gold py-1.5 pl-6 pr-4 font-hand text-[15px] text-berry-950 shadow-lg">{p.tag}</span>}
              <button onClick={() => toggleFav(p.id)} aria-label="В избранное"
                className={`absolute right-4 top-8 grid h-11 w-11 place-items-center rounded-full shadow-lg transition active:scale-90 ${fav ? "bg-berry-500 text-white" : "bg-white text-berry-400 hover:text-berry-600"}`}>
                <Heart size={19} fill={fav ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`arch-sm h-20 w-20 overflow-hidden border-4 transition ${i === imgIdx ? "border-berry-500 shadow-md" : "border-white opacity-70 hover:opacity-100"}`}>
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* разрез */}
            <div className="mt-6 rounded-xl border border-berry-100 bg-white p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Разрѣзъ · product slice</p>
              <div className="mt-3 flex items-end gap-6">
                <div className="flex w-36 flex-col overflow-hidden rounded-md shadow-inner">
                  {p.layers.map((c, i) => <span key={i} className="h-5 w-full" style={{ background: c }} />)}
                </div>
                <div className="flex-1 space-y-1.5">
                  {p.fillings.map((f) => (
                    <p key={f} className="flex items-center gap-2 text-[13px] text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-berry-400" /> {f}
                    </p>
                  ))}
                  <p className="flex items-center gap-2 text-[13px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> {p.weight}, ручная сборка</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* инфо */}
          <Reveal dir="right" delay={100}>
            <p className="font-hand text-2xl text-berry-500">{conf.atelier}</p>
            <h1 className="mt-1 font-display text-4xl font-bold italic leading-tight text-berry-900 lg:text-[2.8rem]">{p.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Stars value={p.rating} size={15} />
              <span className="font-mono text-[12.5px] text-slate-500">{p.rating} · {p.reviews} отзывовъ</span>
              {p.diets.map((d) => (
                <span key={d} className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">{DIETS.find((x) => x.id === d)?.title}</span>
              ))}
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-slate-600">{p.desc}</p>

            <div className="mt-6 flex items-end gap-4">
              <div>
                <p className="font-mono text-[2.2rem] font-bold leading-none text-berry-800">{fmt(p.price)}</p>
                {p.oldPrice && <p className="mt-1 font-mono text-[14px] text-slate-400 line-through">{fmt(p.oldPrice)}</p>}
              </div>
              <span className="mb-1 rounded-sm bg-berry-100 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-berry-700">{p.weight}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border-2 border-berry-100 bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-11 place-items-center text-slate-400 transition hover:text-berry-600" aria-label="Меньше"><Minus size={16} /></button>
                <span className="w-8 text-center font-mono text-lg font-bold text-berry-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid h-12 w-11 place-items-center text-slate-400 transition hover:text-berry-600" aria-label="Больше"><Plus size={16} /></button>
              </div>
              <button onClick={() => addToCart(p.id, qty)} className="flex items-center gap-2 rounded-md bg-berry-500 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:-translate-y-0.5 hover:bg-berry-600 active:translate-y-0">
                <ShoppingBasket size={17} /> В корзину · {fmt(p.price * qty)}
              </button>
              <button onClick={() => (user ? buyNow() : (setAuthOpen(true), pushToast({ title: "Сначала войдите", desc: "Быстрый заказъ доступенъ авторизованнымъ гостямъ", kind: "info" })))}
                className="rounded-md border-2 border-gold px-5 py-3 text-[15px] font-bold text-gold transition hover:bg-gold hover:text-berry-950">
                Купить сразу
              </button>
            </div>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <p className="flex items-center gap-2.5 rounded-lg border border-berry-100 bg-white px-3.5 py-3 text-[12.5px] text-slate-600"><Truck size={16} className="shrink-0 text-berry-500" /> Доставка день-в-день по Москве, по Россіи — СДЭК</p>
              <p className="flex items-center gap-2.5 rounded-lg border border-berry-100 bg-white px-3.5 py-3 text-[12.5px] text-slate-600"><ShieldCheck size={16} className="shrink-0 text-green-600" /> Эскроу: оплата спишется послѣ доставки</p>
            </div>

            {/* кондитер */}
            <Link to="/confectioners" className="mt-6 flex items-center gap-4 rounded-xl border border-berry-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-berry-300 hover:shadow-lg">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-berry-500 font-display text-xl font-bold italic text-white">{conf.portrait}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-[16px] font-bold italic text-berry-900">{conf.name}</span>
                  <TrustBadge trust={conf.trust} />
                </span>
                <span className="mt-0.5 block text-[12.5px] text-slate-500">{conf.city} · въ дѣлѣ съ {conf.since} года · {conf.spec.join(", ")}</span>
              </span>
              <span className="text-right font-mono">
                <span className="block text-[15px] font-bold text-berry-800">{conf.rating} <span className="text-gold">★</span></span>
                <span className="text-[10.5px] text-slate-400">{conf.reviews} отзывовъ</span>
              </span>
            </Link>

            {/* отзывы */}
            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Гостевая книга · послѣднія записи</p>
              <div className="mt-3 space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-berry-100 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-hand text-[16px] text-berry-600">{r.author}</p>
                      <Stars value={r.rating} size={12} />
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">«{r.text}»</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <Reveal><h2 className="font-display text-2xl font-bold italic text-berry-900">Изъ той же печи</h2></Reveal>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((s, i) => <ProductCard key={s.id} p={s} delay={i * 60} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
