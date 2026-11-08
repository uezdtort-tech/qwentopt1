import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Check, ChevronLeft, ChevronRight, CakeSlice, Coffee, Medal, PartyPopper, Send, Gem, Sparkles } from "lucide-react";
import { BUILDER_BASES, BUILDER_COATINGS, BUILDER_DECORS, BUILDER_EVENTS, CONFECTIONERS, DIETS, FILLINGS, WEIGHTS, fmt } from "../lib/data";
import { useStore } from "../lib/store";
import { Reveal, SectionHead } from "../components/ui";

const EVENT_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  rings: Gem, party: PartyPopper, balloon: Sparkles, briefcase: Briefcase, medal: Medal, tea: Coffee,
};
const STEPS = ["Мероприятіе", "Основа", "Начинка", "Покрытие", "Декоръ", "Діета", "Доставка", "Резюме"];
const DIET_PRICE: Record<string, number> = { gf: 300, lf: 250, sf: 250, vegan: 400, keto: 500, halal: 0, kosher: 0, hypo: 300 };

export default function Builder() {
  const nav = useNavigate();
  const { user, setAuthOpen, addInquiry, pushToast } = useStore();
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState<string | null>(null);
  const [base, setBase] = useState<string | null>(null);
  const [filling, setFilling] = useState<{ name: string; price: number } | null>(null);
  const [coating, setCoating] = useState<string | null>(null);
  const [decors, setDecors] = useState<string[]>([]);
  const [diets, setDiets] = useState<string[]>([]);
  const [deliveryType, setDeliveryType] = useState<"express" | "scheduled" | "pickup">("scheduled");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState(WEIGHTS[0].id);
  const [chosen, setChosen] = useState<string[]>([CONFECTIONERS[0].id, CONFECTIONERS[2].id, CONFECTIONERS[3].id]);
  const [sent, setSent] = useState(false);

  const price = useMemo(() => {
    const ev = BUILDER_EVENTS.find((e) => e.id === event)?.base || 0;
    const b = BUILDER_BASES.find((x) => x.id === base)?.price || 0;
    const f = filling?.price || 0;
    const c = BUILDER_COATINGS.find((x) => x.id === coating)?.price || 0;
    const d = decors.reduce((s, id) => s + (BUILDER_DECORS.find((x) => x.id === id)?.price || 0), 0);
    const di = diets.reduce((s, id) => s + (DIET_PRICE[id] || 0), 0);
    const mult = WEIGHTS.find((w) => w.id === weight)?.mult || 1;
    return Math.round((ev + b + f + c + d + di) * mult);
  }, [event, base, filling, coating, decors, diets, weight]);

  const deliveryCost = deliveryType === "express" ? 490 : deliveryType === "scheduled" ? 290 : 0;

  const canNext =
    step === 0 ? !!event : step === 1 ? !!base : step === 2 ? !!filling :
    step === 3 ? !!coating : step === 4 ? true : step === 5 ? true :
    step === 6 ? deliveryType === "pickup" || (!!date && address.length > 5) : true;

  const done = [!!event, !!base, !!filling, !!coating, true, true, step >= 7 || !!date, sent];

  const submit = () => {
    if (!user) { setAuthOpen(true); pushToast({ title: "Почти готово!", desc: "Войдите, чтобы отправить запросъ кондитерамъ", kind: "info" }); return; }
    const ev = BUILDER_EVENTS.find((e) => e.id === event)!;
    addInquiry({
      summary: `${ev.title}: ${BUILDER_BASES.find((x) => x.id === base)?.title}, ${filling?.name}, ${BUILDER_COATINGS.find((x) => x.id === coating)?.title}${decors.length ? ", " + decors.map((d) => BUILDER_DECORS.find((x) => x.id === d)?.title).join(", ") : ""}`,
      price: price + deliveryCost, confectioners: chosen, event: ev.title,
    });
    setSent(true);
    pushToast({ title: "Запросъ отправленъ " + chosen.length + " кондитерамъ", desc: "Отвѣтъ съ точной цѣной придётъ въ теченіе часа", kind: "success" });
    window.setTimeout(() => nav("/dashboard"), 1400);
  };

  const opt = (active: boolean) =>
    `rounded-xl border-2 p-4 text-left transition duration-200 ${active ? "border-berry-500 bg-berry-50 shadow-md shadow-berry-500/10" : "border-berry-100 bg-white hover:-translate-y-0.5 hover:border-berry-300 hover:shadow-md"}`;

  return (
    <main className="paper-band min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <SectionHead kicker="мастерская" title={<>Конструкторъ торта</>} sub="Восемь шаговъ — и трое кондитеровъ пришлютъ свои предложенія. Цѣна пересчитывается на каждомъ шагу." />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {/* прогрессъ */}
            <div className="mb-7 flex items-center gap-1">
              {STEPS.map((s, i) => (
                <button key={s} onClick={() => i <= step && setStep(i)} className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className={`grid h-8 w-8 place-items-center rounded-full border-2 font-mono text-[12px] font-bold transition ${i < step || sent ? "border-green-600 bg-green-600 text-white" : i === step ? "border-berry-500 bg-berry-500 text-white shadow-md shadow-berry-500/30" : "border-berry-200 bg-white text-slate-400"}`}>
                    {i < step || sent ? <Check size={14} /> : i + 1}
                  </span>
                  <span className={`hidden text-[10px] font-medium uppercase tracking-wide sm:block ${i === step ? "text-berry-600" : "text-slate-400"}`}>{s}</span>
                </button>
              ))}
            </div>

            <Reveal key={step}>
              <div className="animate-slide-up rounded-2xl border border-berry-100 bg-white p-6 shadow-sm lg:p-8">
                {step === 0 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">По какому поводу печёмъ?</h3>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {BUILDER_EVENTS.map((e) => {
                        const Icon = EVENT_ICONS[e.icon] || Sparkles;
                        return (
                          <button key={e.id} onClick={() => setEvent(e.id)} className={opt(event === e.id)}>
                            <span className={`grid h-10 w-10 place-items-center rounded-lg ${event === e.id ? "bg-berry-500 text-white" : "bg-berry-50 text-berry-500"}`}><Icon size={19} /></span>
                            <span className="mt-3 block font-display text-[16px] font-bold italic text-berry-900">{e.title}</span>
                            <span className="font-mono text-[11.5px] text-slate-400">отъ {fmt(e.base)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Выберите основу</h3>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {BUILDER_BASES.map((b) => (
                        <button key={b.id} onClick={() => setBase(b.id)} className={opt(base === b.id)}>
                          <span className="flex items-center justify-between">
                            <span className="font-display text-[16px] font-bold italic text-berry-900">{b.title}</span>
                            <span className="font-mono text-[12px] text-berry-600">{b.price ? "+" + fmt(b.price) : "включено"}</span>
                          </span>
                          <span className="mt-1 block text-[12.5px] text-slate-500">{b.note}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Начинка — сердце торта</h3>
                    <p className="mt-1 text-[13px] text-slate-500">50+ вкусовъ въ 10 семействахъ, цѣна — за 1 кг.</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {FILLINGS.slice(0, 8).map((g) => (
                        <div key={g.id} className="rounded-xl border border-berry-100 bg-paper/60 p-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-berry-400">{g.title}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {g.items.map((f) => (
                              <button key={f.name} onClick={() => setFilling(f)}
                                className={`rounded-full border px-2.5 py-1 text-[12px] transition ${filling?.name === f.name ? "border-berry-500 bg-berry-500 text-white shadow" : "border-berry-100 bg-white text-slate-600 hover:border-berry-300"}`}>
                                {f.name}{f.price > 0 && <span className="ml-1 opacity-70">+{f.price}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Покрытіе</h3>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {BUILDER_COATINGS.map((c) => (
                        <button key={c.id} onClick={() => setCoating(c.id)} className={opt(coating === c.id)}>
                          <span className="flex items-center justify-between">
                            <span className="font-display text-[16px] font-bold italic text-berry-900">{c.title}</span>
                            <span className="font-mono text-[12px] text-berry-600">{c.price ? "+" + fmt(c.price) : "включено"}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Декоръ <span className="text-base font-normal not-italic text-slate-400">— можно нѣсколько</span></h3>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {BUILDER_DECORS.map((d) => (
                        <button key={d.id} onClick={() => setDecors((p) => (p.includes(d.id) ? p.filter((x) => x !== d.id) : [...p, d.id]))} className={opt(decors.includes(d.id))}>
                          <span className="flex items-center justify-between">
                            <span className="font-display text-[15px] font-bold italic text-berry-900">{d.title}</span>
                            {decors.includes(d.id) && <Check size={15} className="text-green-600" />}
                          </span>
                          <span className="font-mono text-[12px] text-slate-400">{d.price ? "+" + fmt(d.price) : "безъ доплаты"}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 5 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Діета и ограниченія</h3>
                    <p className="mt-1 text-[13px] text-slate-500">Можно не выбирать ничего — просто шагните дальше.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {DIETS.map((d) => (
                        <button key={d.id} onClick={() => setDiets((p) => (p.includes(d.id) ? p.filter((x) => x !== d.id) : [...p, d.id]))} className={opt(diets.includes(d.id))}>
                          <span className="flex items-center justify-between">
                            <span className="font-display text-[15px] font-bold italic text-berry-900">{d.title}</span>
                            {diets.includes(d.id) && <Check size={15} className="text-green-600" />}
                          </span>
                          <span className="font-mono text-[12px] text-slate-400">{DIET_PRICE[d.id] ? "+" + fmt(DIET_PRICE[d.id]) : "безъ доплаты"}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 6 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Куда и когда везти?</h3>
                    <div className="mt-6 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {([["express", "День-в-день", "490 ₽"], ["scheduled", "Ко датѣ", "290 ₽"], ["pickup", "Самовывозъ", "0 ₽"]] as const).map(([id, t, cost]) => (
                          <button key={id} onClick={() => setDeliveryType(id)} className={opt(deliveryType === id)}>
                            <span className="font-display text-[15px] font-bold italic text-berry-900">{t}</span>
                            <span className="block font-mono text-[12px] text-slate-400">{cost}</span>
                          </button>
                        ))}
                      </div>
                      {deliveryType !== "pickup" && (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Дата доставки</span>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-md border border-berry-100 px-3 py-2.5 text-sm outline-none focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
                          </label>
                          <label className="block">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Адресъ</span>
                            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Городъ, улица, домъ" className="mt-1.5 w-full rounded-md border border-berry-100 px-3 py-2.5 text-sm outline-none focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
                          </label>
                        </div>
                      )}
                      {deliveryType === "pickup" && (
                        <p className="rounded-lg border border-dashed border-berry-300 bg-berry-50/50 px-4 py-3 text-[13px] text-berry-700">Заберёте изъ ателье кондитера — адресъ пришлёмъ вмѣстѣ съ подтвержденіемъ.</p>
                      )}
                    </div>
                  </>
                )}
                {step === 7 && (
                  <>
                    <h3 className="font-display text-2xl font-bold italic text-berry-900">Резюме и мастера</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
                      <div className="rounded-xl border border-berry-100 bg-paper/70 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Вашъ тортъ</p>
                        <ul className="mt-2.5 space-y-1.5 text-[13px] text-slate-600">
                          <li>✦ {BUILDER_EVENTS.find((e) => e.id === event)?.title}</li>
                          <li>✦ {BUILDER_BASES.find((x) => x.id === base)?.title}</li>
                          <li>✦ {filling?.name}</li>
                          <li>✦ {BUILDER_COATINGS.find((x) => x.id === coating)?.title}</li>
                          {decors.length > 0 && <li>✦ {decors.map((d) => BUILDER_DECORS.find((x) => x.id === d)?.title).join(", ")}</li>}
                          {diets.length > 0 && <li>✦ {diets.map((d) => DIETS.find((x) => x.id === d)?.title).join(", ")}</li>}
                        </ul>
                        <label className="mt-4 block">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Вѣсъ</span>
                          <select value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1.5 w-full rounded-md border border-berry-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-berry-300">
                            {WEIGHTS.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
                          </select>
                        </label>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Кому отправить запросъ (до 3)</p>
                        <div className="mt-2.5 space-y-2">
                          {CONFECTIONERS.map((c) => {
                            const on = chosen.includes(c.id);
                            return (
                              <button key={c.id} onClick={() => setChosen((p) => (on ? (p.length > 1 ? p.filter((x) => x !== c.id) : p) : p.length < 3 ? [...p, c.id] : p))}
                                className={`flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition ${on ? "border-berry-500 bg-berry-50" : "border-berry-100 bg-white hover:border-berry-300"}`}>
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-berry-500 font-display text-[12px] font-bold italic text-white">{c.portrait}</span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13px] font-semibold text-berry-900">{c.name}</span>
                                  <span className="block text-[11px] text-slate-400">{c.city} · {c.rating}★</span>
                                </span>
                                {on && <Check size={16} className="text-green-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* навигация по шагамъ */}
                <div className="mt-8 flex items-center justify-between border-t border-dashed border-berry-200 pt-5">
                  <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                    className="flex items-center gap-1.5 rounded-md px-4 py-2.5 text-[13.5px] font-semibold text-slate-500 transition enabled:hover:bg-berry-50 enabled:hover:text-berry-700 disabled:opacity-30">
                    <ChevronLeft size={15} /> Назадъ
                  </button>
                  {step < 7 ? (
                    <button onClick={() => canNext && setStep(step + 1)} disabled={!canNext}
                      className="flex items-center gap-2 rounded-md bg-berry-500 px-6 py-3 text-[14px] font-semibold text-white shadow-md shadow-berry-500/25 transition enabled:hover:bg-berry-600 disabled:cursor-not-allowed disabled:opacity-40">
                      Дальше <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button onClick={submit} disabled={sent}
                      className="flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-[14px] font-bold text-berry-950 shadow-lg shadow-gold/30 transition hover:brightness-110 disabled:opacity-60">
                      <Send size={15} /> {sent ? "Отправлено!" : `Отправить за ${fmt(price + deliveryCost)}`}
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* живая сводка */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-berry-900 p-5 text-white shadow-2xl shadow-berry-950/30">
              <p className="flex items-center gap-2 font-hand text-lg text-berry-200"><CakeSlice size={16} /> смета собирается</p>
              <dl className="mt-3 space-y-2 font-mono text-[12.5px]">
                <div className="flex justify-between"><dt className="text-berry-200/70">мероприятіе</dt><dd>{event ? fmt(BUILDER_EVENTS.find((e) => e.id === event)!.base) : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">основа</dt><dd>{base ? (BUILDER_BASES.find((x) => x.id === base)!.price ? "+" + fmt(BUILDER_BASES.find((x) => x.id === base)!.price) : "0 ₽") : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">начинка</dt><dd>{filling ? (filling.price ? "+" + fmt(filling.price) : "0 ₽") : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">покрытие</dt><dd>{coating ? "+" + fmt(BUILDER_COATINGS.find((x) => x.id === coating)!.price) : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">декоръ ×{decors.length}</dt><dd>{decors.length ? "+" + fmt(decors.reduce((s, id) => s + (BUILDER_DECORS.find((x) => x.id === id)?.price || 0), 0)) : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">діета</dt><dd>{diets.length ? "+" + fmt(diets.reduce((s, id) => s + (DIET_PRICE[id] || 0), 0)) : "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-berry-200/70">вѣсъ</dt><dd>×{WEIGHTS.find((w) => w.id === weight)?.mult}</dd></div>
                <div className="flex justify-between border-t border-berry-700 pt-2 text-[15px] font-bold text-gold">
                  <dt>итого</dt><dd key={price} className="animate-pop">{fmt(price)}</dd>
                </div>
                <div className="flex justify-between text-berry-200/70"><dt>доставка</dt><dd>{deliveryCost ? fmt(deliveryCost) : "—"}</dd></div>
              </dl>
              <div className="mt-4 space-y-1.5">
                {STEPS.map((s, i) => (
                  <p key={s} className={`flex items-center gap-2 text-[11.5px] ${done[i] ? "text-green-400" : "text-berry-200/50"}`}>
                    <span className={`grid h-4 w-4 place-items-center rounded-full border ${done[i] ? "border-green-400 bg-green-500/20" : "border-berry-600"}`}>{done[i] && <Check size={9} />}</span>
                    {s}
                  </p>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-berry-800/80 px-3 py-2 text-center font-hand text-[14px] text-berry-200">торгъ уместенъ — кондитеры предложатъ свою цѣну</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
