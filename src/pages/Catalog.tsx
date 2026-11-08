import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, DIETS, FILLINGS, PRODUCTS, fmt } from "../lib/data";
import { useStore } from "../lib/store";
import { EmptyState, Reveal, SectionHead } from "../components/ui";
import { ProductCard } from "./Home";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const { favorites, search } = useStore();
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState(13000);
  const [selFillings, setSelFillings] = useState<string[]>([]);
  const [selDiets, setSelDiets] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cat = params.get("cat") || "all";
  const q = (params.get("q") || search || "").trim().toLowerCase();
  const favOnly = params.get("fav") === "1";

  const list = useMemo(() => {
    let r = PRODUCTS.slice();
    if (favOnly) r = r.filter((p) => favorites.includes(p.id));
    if (cat !== "all") r = r.filter((p) => p.category === cat || (cat === "diet" && p.diets.length > 0) || (cat === "fillings" && true));
    if (q) r = r.filter((p) => (p.title + " " + p.desc + " " + p.fillings.join(" ")).toLowerCase().includes(q));
    if (selFillings.length) r = r.filter((p) => p.fillings.some((f) => selFillings.includes(f)));
    if (selDiets.length) r = r.filter((p) => selDiets.every((d) => p.diets.includes(d)));
    r = r.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") r.sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [cat, q, favOnly, favorites, selFillings, selDiets, maxPrice, sort]);

  const setCat = (c: string) => {
    const p = new URLSearchParams(params);
    if (c === "all") p.delete("cat"); else p.set("cat", c);
    setParams(p);
  };

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const catTitle = favOnly ? "Избранное" : q ? `Поискъ: «${params.get("q") || search}»` : cat === "all" ? "Вся витрина" : CATEGORIES.find((c) => c.id === cat)?.title || "Витрина";

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="grain pointer-events-none fixed inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <SectionHead center={false} kicker={favOnly ? "вашъ сундучокъ" : "лавка открыта"} title={<>{catTitle}</>} sub={`${list.length} ${list.length % 10 === 1 && list.length % 100 !== 11 ? "позиція" : "позицій"} · доставка день-в-день по Москве и Петербургу`} />

        {/* категории-чипсы */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {[{ id: "all", title: "Всё" }, ...CATEGORIES.filter((c) => !["constructor", "recipes", "gifts", "fillings"].includes(c.id))].map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${cat === c.id ? "border-berry-500 bg-berry-500 text-white shadow-md shadow-berry-500/25" : "border-berry-100 bg-white text-slate-500 hover:border-berry-300 hover:text-berry-700"}`}>
              {c.title}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* фильтры */}
          <aside>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="mb-3 flex w-full items-center justify-between rounded-md border border-berry-100 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-berry-800 lg:hidden">
              <span className="flex items-center gap-2"><SlidersHorizontal size={15} /> Фильтры</span>
              {filtersOpen ? <X size={15} /> : null}
            </button>
            <div className={`${filtersOpen ? "block" : "hidden"} space-y-5 lg:block`}>
              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Цѣна, до</p>
                <input type="range" min={1000} max={13000} step={200} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-2 w-full" />
                <p className="mt-1 text-right font-mono text-[13px] font-bold text-berry-700">{fmt(maxPrice)}</p>
              </div>

              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Начинки</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {FILLINGS.flatMap((g) => g.items).slice(0, 14).map((f) => (
                    <button key={f.name} onClick={() => toggle(selFillings, setSelFillings, f.name)}
                      className={`rounded-full border px-2.5 py-1 text-[11.5px] transition ${selFillings.includes(f.name) ? "border-berry-500 bg-berry-50 font-semibold text-berry-700" : "border-berry-100 text-slate-500 hover:border-berry-300"}`}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Діета</p>
                <div className="mt-2.5 space-y-1.5">
                  {DIETS.map((d) => (
                    <label key={d.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-slate-600 transition hover:bg-berry-50/60">
                      <input type="checkbox" checked={selDiets.includes(d.id)} onChange={() => toggle(selDiets, setSelDiets, d.id)} className="h-4 w-4 accent-berry-500" />
                      {d.title}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Сортировка</p>
                <div className="mt-2 space-y-1">
                  {[["popular", "По популярности"], ["rating", "По рейтингу"], ["price-asc", "Сначала дешевле"], ["price-desc", "Сначала дороже"]].map(([id, label]) => (
                    <button key={id} onClick={() => setSort(id)} className={`block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] transition ${sort === id ? "bg-berry-50 font-semibold text-berry-700" : "text-slate-500 hover:bg-berry-50/50"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* сетка */}
          <div>
            {list.length === 0 ? (
              <EmptyState
                title={favOnly ? "Въ избранномъ пусто" : "Ничего не нашлось"}
                sub={favOnly ? "Нажимайте на сердечки на витрине — и они соберутся здесь." : "Попробуйте сбросить фильтры или поискать иначе: «медовикъ», «безъ глютена», «макаруны»."}
                action={favOnly ? <Link to="/catalog" className="rounded-md bg-berry-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-berry-600">На витрину</Link> : <button onClick={() => { setSelDiets([]); setSelFillings([]); setMaxPrice(13000); setParams(new URLSearchParams()); }} className="rounded-md bg-berry-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-berry-600">Сбросить фильтры</button>}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((p, i) => <ProductCard key={p.id} p={p} delay={Math.min(i, 6) * 50} />)}
              </div>
            )}
            {list.length > 0 && (
              <Reveal className="mt-10 rounded-xl border border-dashed border-berry-300 bg-white/70 p-5 text-center">
                <p className="font-hand text-xl text-berry-500">не нашли подходящаго?</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Соберите тортъ въ конструкторѣ — трое кондитеровъ пришлютъ свои цѣны въ теченіе часа.</p>
                <Link to="/builder" className="mt-3 inline-block rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-berry-950 transition hover:brightness-110">Открыть конструкторъ</Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
