import { useState } from "react";
import { Check, Clock3, Flame, Users } from "lucide-react";
import { RECIPES } from "../lib/data";
import type { Recipe } from "../lib/data";
import { useStore } from "../lib/store";
import { Modal, Reveal, SectionHead } from "../components/ui";

export default function Recipes() {
  const [cat, setCat] = useState("Все");
  const [open, setOpen] = useState<Recipe | null>(null);
  const [cookedExtra, setCookedExtra] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const { pushToast, user, setAuthOpen } = useStore();

  const cats = ["Все", ...Array.from(new Set(RECIPES.map((r) => r.category)))];
  const list = cat === "Все" ? RECIPES : RECIPES.filter((r) => r.category === cat);

  const markCooked = (r: Recipe) => {
    if (!user) { setAuthOpen(true); pushToast({ title: "Войдите, чтобы отмѣтить", desc: "Отмѣтки о приготовленіи доступны гостямъ лавки", kind: "info" }); return; }
    if (marked.includes(r.id)) return;
    setMarked((p) => [...p, r.id]);
    setCookedExtra((p) => ({ ...p, [r.id]: (p[r.id] || 0) + 1 }));
    pushToast({ title: "Записали въ поваренную книгу!", desc: `«${r.title}» — приготовлено вами`, kind: "success" });
  };

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <SectionHead kicker="поваренная книга" title={<>Рецепты отъ мастеровъ</>} sub="Кондитеры дѣлятся секретами: отъ заварного крема до зеркальной глазури. Приготовили — отмѣтьте, автору пріятно." />

        <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${cat === c ? "border-berry-500 bg-berry-500 text-white shadow-md" : "border-berry-100 bg-white text-slate-500 hover:border-berry-300"}`}>{c}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <Reveal key={r.id} delay={i * 60}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-berry-100/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <button onClick={() => setOpen(r)} className="relative block overflow-hidden text-left">
                  <img src={r.image} alt={r.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
                  <span className="absolute left-3 top-3 rounded-sm bg-berry-900/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-berry-100 backdrop-blur">{r.difficulty}</span>
                  {marked.includes(r.id) && (
                    <span className="animate-stamp absolute right-3 top-3 rotate-[-8deg] rounded border-2 border-green-500 bg-white/90 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-green-600">приготовлено ✓</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-hand text-lg text-berry-500">отъ {r.author}</p>
                  <button onClick={() => setOpen(r)} className="text-left">
                    <h3 className="font-display text-[19px] font-bold italic leading-snug text-berry-900 transition group-hover:text-berry-600">{r.title}</h3>
                  </button>
                  <p className="mt-1.5 line-clamp-2 text-[13px] text-slate-500">{r.intro}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-dashed border-berry-200 pt-3.5">
                    <span className="flex items-center gap-3 font-mono text-[11.5px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock3 size={12} /> {r.time}</span>
                      <span className="flex items-center gap-1"><Flame size={12} /> {r.cooked + (cookedExtra[r.id] || 0)}</span>
                    </span>
                    <button onClick={() => markCooked(r)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition ${marked.includes(r.id) ? "bg-green-100 text-green-700" : "bg-berry-50 text-berry-600 hover:bg-berry-500 hover:text-white"}`}>
                      {marked.includes(r.id) ? "Готово ✓" : "Я приготовилъ"}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} wide>
        {open && (
          <div className="p-7">
            <div className="grid gap-6 sm:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="arch-sm overflow-hidden border-4 border-berry-100">
                  <img src={open.image} alt={open.title} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="mt-4 rounded-lg border border-berry-100 bg-paper/70 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Ингредиентъ</p>
                  <ul className="mt-2 space-y-1.5">
                    {open.ingredients.map((ing) => <li key={ing} className="flex items-start gap-2 text-[13px] text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{ing}</li>)}
                  </ul>
                </div>
                <div className="mt-3 flex items-center gap-4 font-mono text-[12px] text-slate-500">
                  <span className="flex items-center gap-1.5"><Clock3 size={13} /> {open.time}</span>
                  <span className="flex items-center gap-1.5"><Users size={13} /> {open.cooked + (cookedExtra[open.id] || 0)} приготовили</span>
                </div>
              </div>
              <div>
                <p className="font-hand text-xl text-berry-500">{open.author} · {open.category}</p>
                <h3 className="mt-0.5 font-display text-2xl font-bold italic leading-tight text-berry-900">{open.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{open.intro}</p>
                <ol className="mt-4 space-y-3">
                  {open.steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-berry-500 font-mono text-[12px] font-bold text-white">{i + 1}</span>
                      <p className="pt-1 text-[13.5px] leading-relaxed text-slate-600">{s}</p>
                    </li>
                  ))}
                </ol>
                <button onClick={() => markCooked(open)}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-md py-3 text-[14px] font-semibold transition ${marked.includes(open.id) ? "bg-green-100 text-green-700" : "bg-berry-500 text-white shadow-lg shadow-berry-500/25 hover:bg-berry-600"}`}>
                  <Check size={16} /> {marked.includes(open.id) ? "Отмѣчено въ книгѣ" : "Я приготовилъ этотъ рецептъ"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
