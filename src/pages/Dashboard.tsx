import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Gift, Send, ThumbsDown, ThumbsUp, Wallet, CheckCircle2 } from "lucide-react";
import { CONFECTIONERS, STATUS_LABEL, TARIFFS, fmt } from "../lib/data";
import type { OrderStatus } from "../lib/data";
import { useStore } from "../lib/store";
import { EmptyState, Reveal, SectionHead, StatusPill, TrustBadge } from "../components/ui";

const FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "IN_DELIVERY", "DELIVERED", "COMPLETED"];

function OrderTimeline({ status }: { status: OrderStatus }) {
  const idx = FLOW.indexOf(status);
  return (
    <div className="mt-3 flex items-center">
      {FLOW.map((s, i) => (
        <div key={s} className="flex flex-1 items-center">
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 font-mono text-[8px] font-bold transition ${i < idx ? "border-green-600 bg-green-600 text-white" : i === idx ? "border-berry-500 bg-berry-500 text-white" : "border-berry-200 bg-white text-slate-300"}`}>
            {i < idx ? "✓" : i + 1}
          </span>
          {i < FLOW.length - 1 && <span className={`h-0.5 flex-1 transition ${i < idx ? "bg-green-600" : "bg-berry-100"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const store = useStore();
  const { user, setAuthOpen } = store;
  const [payoutAmount, setPayoutAmount] = useState("12000");
  const [payoutMethod, setPayoutMethod] = useState("card");
  const [promoForm, setPromoForm] = useState({ code: "", type: "percent" as "percent" | "fixed" | "free_delivery", value: "10", minOrder: "1500" });

  const earnings = useMemo(() => 48200 + store.orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length * 2400, [store.orders]);
  const tariff = TARIFFS.find((t) => t.id === (user?.activeRole === "CONFECTIONER" ? "PREMIUM" : "BASIC"))!;

  if (!user) {
    return (
      <main className="paper-band min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-20">
          <EmptyState title="Кабинетъ подъ замкомъ" sub="Войдите въ лавку, чтобы видѣть заказы, бонусы и запросы кондитерамъ."
            action={<button onClick={() => setAuthOpen(true)} className="rounded-md bg-berry-500 px-6 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Войти въ лавку</button>} />
        </div>
      </main>
    );
  }

  const role = user.activeRole;

  return (
    <main className="paper-band min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead center={false} kicker={`кабинетъ · ${user.email}`} title={<>Здравія желаемъ, {user.name.split(" ")[0]}!</>} />
          <div className="flex gap-2">
            {(["CUSTOMER", "CONFECTIONER", "COURIER", "ADMIN"] as const).map((r) => (
              <button key={r} onClick={() => store.switchRole(r)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition ${role === r ? "border-berry-500 bg-berry-500 text-white shadow" : "border-berry-100 bg-white text-slate-500 hover:border-berry-300"}`}>
                {r === "CUSTOMER" ? "Покупатель" : r === "CONFECTIONER" ? "Кондитер" : r === "COURIER" ? "Курьер" : "Админъ"}
              </button>
            ))}
          </div>
        </div>

        {/* ================= ПОКУПАТЕЛЬ ================= */}
        {role === "CUSTOMER" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <Reveal><div className="rounded-xl bg-berry-500 p-5 text-white shadow-xl shadow-berry-500/20">
              <p className="font-mono text-[10px] uppercase tracking-widest text-berry-200">Бонусный счётъ · {user.loyalty}</p>
              <p className="mt-2 font-display text-4xl font-bold italic">{user.bonusBalance.toLocaleString("ru-RU")} <span className="text-lg">б.</span></p>
              <p className="mt-1 text-[12px] text-berry-200">1 бонусъ = 1 ₽ · сгораютъ черезъ 12 мѣсяцевъ</p>
            </div></Reveal>
            <Reveal delay={70}><div className="flex h-full flex-col justify-center rounded-xl border border-berry-100 bg-white p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Заказовъ · въ избранномъ</p>
              <p className="mt-2 font-display text-4xl font-bold italic text-berry-900">{store.orders.length} <span className="text-lg text-slate-300">·</span> <span className="text-berry-500">{store.favorites.length}</span></p>
              <Link to="/catalog?fav=1" className="mt-1 text-[12.5px] font-semibold text-berry-600 hover:text-berry-800">открыть избранное →</Link>
            </div></Reveal>
            <Reveal delay={140}><div className="h-full rounded-xl border border-dashed border-gold/60 bg-white p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Реферальный кодъ</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex-1 rounded-md border border-dashed border-berry-300 bg-paper px-3 py-2 text-center font-mono text-[15px] font-bold tracking-widest text-berry-700">{user.referralCode}</span>
                <button onClick={() => { navigator.clipboard?.writeText("conditera.ru/?ref=" + user.referralCode).catch(() => undefined); store.pushToast({ title: "Кодъ скопированъ", desc: "Вамъ 300 ₽, другу 500 ₽ на первый заказъ", kind: "success" }); }}
                  className="grid h-10 w-10 place-items-center rounded-md bg-berry-500 text-white transition hover:bg-berry-600" aria-label="Скопировать"><Copy size={16} /></button>
              </div>
              <p className="mt-2 text-[11.5px] text-slate-400">Приглашено: 2 пріятеля · заработано 600 ₽</p>
            </div></Reveal>

            {/* заказы */}
            <div className="lg:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Мои заказы · статусы обновляются въ реальномъ времени</p>
              <div className="mt-3 space-y-3">
                {store.orders.length === 0 && <EmptyState title="Заказовъ пока нѣтъ" sub="Витрина открыта — медовикъ самъ себя не закажетъ." action={<Link to="/catalog" className="rounded-md bg-berry-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-berry-600">На витрину</Link>} />}
                {store.orders.map((o) => (
                  <Reveal key={o.id}>
                    <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-mono text-[13px] font-bold text-berry-900">{o.number}</p>
                          <p className="text-[11.5px] text-slate-400">{o.createdAt} · {o.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={o.status} />
                          <span className="font-mono text-[14px] font-bold text-berry-800">{fmt(o.total)}</span>
                        </div>
                      </div>
                      <OrderTimeline status={o.status} />
                      <div className="mt-3 flex flex-wrap gap-2">
                        {o.items.map((i) => (
                          <span key={i.productId} className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[11.5px] text-slate-600">
                            <img src={i.image} alt="" className="h-5 w-5 rounded-full object-cover" /> {i.title} ×{i.qty}
                          </span>
                        ))}
                        <span className="ml-auto text-[11px] text-slate-400">{o.paymentMethod}{o.escrow && " · эскроу"}{o.promoCode && ` · ${o.promoCode}`}{o.bonusUsed ? ` · −${o.bonusUsed} б.` : ""}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* бонусы + сертификаты */}
            <div className="space-y-4">
              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Бонусная книга</p>
                <div className="mt-2 space-y-2">
                  {(store.bonusTxs.length ? store.bonusTxs : [{ id: "s1", type: "BONUS_WELCOME", amount: 500, date: "сегодня", note: "Приветственные бонусы" }]).slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-[12.5px]">
                      <div><p className="font-medium text-slate-600">{t.note}</p><p className="font-mono text-[10.5px] text-slate-400">{t.type} · {t.date}</p></div>
                      <span className={`font-mono font-bold ${t.amount > 0 ? "text-green-700" : "text-berry-500"}`}>{t.amount > 0 ? "+" : ""}{t.amount} б.</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400"><Gift size={11} /> Сертификаты</p>
                {store.certificates.length === 0 ? (
                  <p className="mt-2 text-[12.5px] text-slate-400">Пока пусто. <Link to="/gifts" className="font-semibold text-berry-600">Подарить кому-нибудь →</Link></p>
                ) : store.certificates.slice(0, 4).map((c) => (
                  <div key={c.id} className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-gold/60 bg-gold/5 px-3 py-2">
                    <span className="font-mono text-[12px] font-bold text-berry-700">{c.code}</span>
                    <span className="font-mono text-[12px] text-slate-500">{fmt(c.amount)}</span>
                  </div>
                ))}
              </div>
              {store.inquiries.length > 0 && (
                <div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Запросы конструктора</p>
                  {store.inquiries.map((q) => (
                    <div key={q.id} className="mt-2 rounded-lg bg-paper px-3 py-2">
                      <p className="text-[12.5px] font-semibold text-berry-900">{q.event} · {fmt(q.price)}</p>
                      <p className="truncate text-[11.5px] text-slate-500">{q.summary}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase text-gold">{q.status === "sent" ? "ждёмъ отвѣтовъ" : q.status === "negotiating" ? "торгъ идётъ" : "мастеръ согласенъ"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= КОНДИТЕР ================= */}
        {role === "CONFECTIONER" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <Reveal><div className="rounded-xl bg-berry-900 p-5 text-white shadow-xl">
              <p className="font-mono text-[10px] uppercase tracking-widest text-berry-300">Доходъ за мѣсяцъ · тарифъ PREMIUM (7%)</p>
              <p className="mt-2 font-display text-4xl font-bold italic">{fmt(earnings)}</p>
              <p className="mt-1 text-[12px] text-berry-200">комиссія платформы {fmt((earnings * tariff.commission) / 100)} · 14 заказовъ въ работѣ</p>
            </div></Reveal>
            <Reveal delay={70}><div className="flex h-full flex-col justify-center rounded-xl border border-berry-100 bg-white p-5 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Рейтингъ и довѣріе</p>
              <p className="mt-2 font-display text-4xl font-bold italic text-berry-900">4,9 <span className="text-lg text-gold">★</span></p>
              <div className="mt-1"><TrustBadge trust="MASTER" /></div>
            </div></Reveal>
            <Reveal delay={140}>
              <div className="h-full rounded-xl border border-berry-100 bg-white p-5 shadow-sm">
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400"><Wallet size={11} /> Запросить выплату</p>
                <div className="mt-2.5 flex gap-2">
                  <input value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value.replace(/\D/g, ""))} className="w-28 rounded-md border border-berry-100 px-2.5 py-2 text-right font-mono text-[13px] outline-none focus:border-berry-300" />
                  <select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} className="rounded-md border border-berry-100 px-2 py-2 text-[12.5px] outline-none">
                    <option value="card">Карта</option><option value="sbp">СБП</option><option value="invoice">Счётъ ИП</option>
                  </select>
                </div>
                <button
                  onClick={() => { const a = parseInt(payoutAmount || "0", 10); if (a < 5000) { store.pushToast({ title: "Минимумъ — 5 000 ₽", desc: "Таковы правила эскроу-выплатъ", kind: "error" }); return; } store.requestPayout(a, payoutMethod); }}
                  className="mt-2.5 w-full rounded-md bg-gold py-2.5 text-[13.5px] font-bold text-berry-950 transition hover:brightness-110">Отправить заявку</button>
              </div>
            </Reveal>

            {/* выплаты */}
            <div className="lg:col-span-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Выплаты</p>
              <div className="mt-3 space-y-2.5">
                {(store.payouts.length ? store.payouts : [{ id: "p0", amount: 25000, status: "paid" as const, createdAt: "28 января, 14:02", method: "card" }]).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-berry-100 bg-white px-4 py-3 shadow-sm">
                    <div>
                      <p className="font-mono text-[14px] font-bold text-berry-900">{fmt(p.amount)}</p>
                      <p className="text-[11px] text-slate-400">{p.createdAt} · {p.method === "card" ? "карта" : p.method === "sbp" ? "СБП" : "счётъ"}</p>
                    </div>
                    <span className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${p.status === "paid" ? "bg-green-100 text-green-700" : p.status === "approved" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.status === "paid" ? "выплачено" : p.status === "approved" ? "одобрено" : "въ ожиданіи"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* входящія */}
            <div className="lg:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Входящіе запросы · realtime</p>
              <div className="mt-3 space-y-3">
                {store.inquiries.length === 0 && (
                  <div className="rounded-xl border border-dashed border-berry-300 bg-white/70 p-6 text-center text-[13.5px] text-slate-500">
                    Пока тихо. Запросы изъ конструктора появятся здѣсь мгновенно — какъ только покупатель соберётъ тортъ и выберетъ васъ.
                  </div>
                )}
                {store.inquiries.map((q) => (
                  <div key={q.id} className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-[13px] font-bold text-berry-900">{q.number} · {q.event}</p>
                        <p className="mt-0.5 max-w-md text-[12.5px] text-slate-500">{q.summary}</p>
                      </div>
                      <span className="font-mono text-[15px] font-bold text-berry-800">{fmt(q.price)}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {q.status === "accepted" ? (
                        <span className="flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1.5 text-[12.5px] font-semibold text-green-700"><CheckCircle2 size={14} /> Заказъ принятъ — покупатель notified</span>
                      ) : (
                        <>
                          <button onClick={() => { store.acceptInquiry(q.id); store.pushToast({ title: "Заказъ принятъ въ работу", desc: "Статусъ PREPARING, покупатель видитъ его въ кабинетѣ", kind: "success" }); }}
                            className="rounded-md bg-berry-500 px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-berry-600">Принять</button>
                          <button onClick={() => store.pushToast({ title: "Встрѣчное предложеніе отправлено", desc: "Покупатель получитъ вашу цѣну въ чатѣ", kind: "info" })}
                            className="rounded-md border border-berry-200 px-4 py-1.5 text-[12.5px] font-semibold text-berry-600 transition hover:bg-berry-50">Предложить цѣну</button>
                        </>
                      )}
                      <span className="ml-auto font-mono text-[10.5px] text-slate-400">{q.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= КУРЬЕР ================= */}
        {role === "COURIER" && (
          <div className="mt-8 max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Активныя доставки · Москва, центральный уѣздъ</p>
            <div className="mt-3 space-y-3">
              {store.orders.slice(0, 4).map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-mono text-[13.5px] font-bold text-berry-900">{o.number}</p>
                    <p className="text-[12px] text-slate-500">{o.address}</p>
                  </div>
                  <StatusPill status={o.status} />
                  <button onClick={() => store.pushToast({ title: `Заказъ ${o.number} принятъ`, desc: "Маршрутъ построенъ, до адреса 2,4 км", kind: "info" })}
                    className="rounded-md bg-berry-500 px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-berry-600">Взять заказъ</button>
                </div>
              ))}
              {store.orders.length === 0 && <EmptyState title="Доставокъ пока нѣтъ" sub="Новыя появятся, когда покупатели начнутъ заказывать." />}
            </div>
          </div>
        )}

        {/* ================= АДМИН ================= */}
        {role === "ADMIN" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
              {[["Заказовъ сегодня", 148, ""], ["Выручка GMV", 412300, " ₽"], ["Кондитеровъ онлайн", 87, ""]].map(([t, v, s], i) => (
                <Reveal key={t as string} delay={i * 60}><div className="rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{t as string}</p>
                  <p className="mt-1 font-display text-2xl font-bold italic text-berry-900">{new Intl.NumberFormat("ru-RU").format(v as number)}{s as string}</p>
                </div></Reveal>
              ))}
            </div>

            {/* модерация */}
            <div className="lg:col-span-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Очередь модерации · {store.moderation.filter((m) => m.status === "pending").length} ожидаютъ</p>
              <div className="mt-3 space-y-2.5">
                {store.moderation.map((m) => (
                  <div key={m.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition ${m.status === "pending" ? "border-berry-100 bg-white" : m.status === "approved" ? "border-green-200 bg-green-50/60" : "border-red-200 bg-red-50/60"}`}>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-berry-900">{m.title}</p>
                      <p className="font-mono text-[11px] text-slate-400">{m.type} · {m.author}</p>
                    </div>
                    {m.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => store.moderate(m.id, "approved")} className="flex items-center gap-1.5 rounded-md bg-green-600 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-green-700"><ThumbsUp size={13} /> Одобрить</button>
                        <button onClick={() => store.moderate(m.id, "rejected")} className="flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-red-700"><ThumbsDown size={13} /> Отклонить</button>
                      </div>
                    ) : (
                      <span className={`font-mono text-[11px] uppercase tracking-wider ${m.status === "approved" ? "text-green-700" : "text-red-600"}`}>{m.status === "approved" ? "одобрено" : "отклонено"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* промокоды */}
            <div className="lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Создать промокодъ</p>
              <div className="mt-3 space-y-2.5 rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <input value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase().replace(/\s/g, "") })} placeholder="КОДЪ" className="w-full rounded-md border border-berry-100 px-3 py-2.5 font-mono text-[13px] uppercase outline-none focus:border-berry-300" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={promoForm.type} onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as typeof promoForm.type })} className="rounded-md border border-berry-100 px-2.5 py-2.5 text-[13px] outline-none">
                    <option value="percent">Проценты %</option><option value="fixed">Фиксъ ₽</option><option value="free_delivery">Безъ доставки</option>
                  </select>
                  <input value={promoForm.value} onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value.replace(/\D/g, "") })} placeholder="10" className="rounded-md border border-berry-100 px-2.5 py-2.5 text-right font-mono text-[13px] outline-none focus:border-berry-300" />
                </div>
                <button
                  onClick={() => {
                    if (promoForm.code.length < 3) { store.pushToast({ title: "Кодъ слишкомъ короткій", kind: "error" }); return; }
                    store.addPromo({ code: promoForm.code, type: promoForm.type, value: parseInt(promoForm.value || "0", 10), minOrder: 0, note: `Созданъ админомъ · ${promoForm.type === "percent" ? promoForm.value + "%" : promoForm.type === "fixed" ? fmt(+promoForm.value) : "безплатная доставка"}` });
                    setPromoForm({ code: "", type: "percent", value: "10", minOrder: "1500" });
                  }}
                  className="w-full rounded-md bg-berry-500 py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-berry-600">Выпустить въ свѣтъ</button>
                <p className="pt-1 text-[11px] text-slate-400">Дѣйствующіе коды видны на страницѣ <Link to="/promotions" className="font-semibold text-berry-600">Акціи</Link></p>
              </div>
              <div className="mt-4 rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Топъ кондитеровъ мѣсяца</p>
                {CONFECTIONERS.slice(0, 3).map((c, i) => (
                  <div key={c.id} className="mt-2.5 flex items-center gap-3">
                    <span className="font-display text-xl font-bold italic text-berry-300">{i + 1}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-berry-500 font-display text-[11px] font-bold italic text-white">{c.portrait}</span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-700">{c.name}</span>
                    <span className="font-mono text-[12px] text-slate-400">{c.rating}★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-10 text-center font-mono text-[11px] text-slate-400">
          Роли {user.roles.map((r) => r.toLowerCase()).join(" + ")} · сессія GoTrue · RLS-политики активны (демо)
        </p>
        <p className="mt-1 text-center text-[11px] text-slate-300">Статусы заказовъ {Object.values(STATUS_LABEL).slice(0, 4).join(" → ")} → … обновляются автоматически</p>
      </div>
    </main>
  );
}
