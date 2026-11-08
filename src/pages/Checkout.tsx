import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Check, CreditCard, Gift, Smartphone, Sparkles, Truck } from "lucide-react";
import confetti from "canvas-confetti";
import { PRODUCTS, fmt } from "../lib/data";
import type { Order } from "../lib/store";
import { useStore } from "../lib/store";
import { EmptyState, Reveal, SectionHead } from "../components/ui";

export default function Checkout() {
  const { cart, clearCart, user, setAuthOpen, promos, placeOrder, pushToast, spendBonus } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState("Москва, ул. Пятницкая, 12");
  const [date, setDate] = useState("");
  const [deliveryType, setDeliveryType] = useState<"express" | "scheduled" | "pickup">("scheduled");
  const [payment, setPayment] = useState<"card" | "sbp" | "split">("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [useBonus, setUseBonus] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);

  const rows = cart.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.productId)! })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);

  const promo = appliedPromo ? promos.find((p) => p.code === appliedPromo) : null;
  const promoDiscount = useMemo(() => {
    if (!promo) return 0;
    if (promo.type === "percent") return Math.round((subtotal * promo.value) / 100);
    if (promo.type === "fixed") return subtotal >= promo.minOrder ? promo.value : 0;
    return 0;
  }, [promo, subtotal]);

  const bonusCap = Math.min(user?.bonusBalance || 0, Math.round(subtotal * 0.3));
  const bonusUsed = useBonus ? bonusCap : 0;

  const baseDelivery = deliveryType === "express" ? 490 : deliveryType === "scheduled" ? 290 : 0;
  const deliveryCost = baseDelivery === 0 || promo?.type === "free_delivery" || subtotal >= 5000 ? 0 : baseDelivery;
  const total = Math.max(0, subtotal - promoDiscount - bonusUsed + deliveryCost);
  const earned = Math.round(total * 0.05);

  if (placed) {
    return (
      <main className="paper-band min-h-[70vh]">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Reveal>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-600 text-white shadow-xl shadow-green-600/30">
              <BadgeCheck size={38} />
            </span>
            <p className="mt-6 font-hand text-2xl text-berry-500">печёмъ-съ!</p>
            <h1 className="font-display text-4xl font-bold italic text-berry-900">Заказъ {placed.number} принятъ</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-slate-500">
              Деньги ({fmt(placed.total)}) на эскроу-счётѣ. Кондитеръ подтвердитъ заказъ въ теченіе 15 минутъ — слѣдите за статусами въ кабинетѣ.
            </p>
          </Reveal>
          <div className="animate-slide-up mx-auto mt-8 max-w-md rounded-xl border border-berry-100 bg-white p-5 text-left shadow-lg">
            {placed.items.map((i) => (
              <div key={i.productId} className="flex items-center justify-between py-1.5 text-[13.5px]">
                <span className="text-slate-600">{i.title} × {i.qty}</span>
                <span className="font-mono font-semibold text-berry-900">{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-berry-200 pt-3">
              <span className="text-[13.5px] text-slate-500">Итого, съ эскроу</span>
              <span className="font-mono text-lg font-bold text-berry-800">{fmt(placed.total)}</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-2 text-[12.5px] text-green-700"><Sparkles size={13} /> Начислено {earned} бонусовъ — они уже въ кабинетѣ</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => nav("/dashboard")} className="rounded-md bg-berry-500 px-6 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Въ личный кабинетъ</button>
            <Link to="/catalog" className="rounded-md border-2 border-berry-500 px-6 py-3 text-[14.5px] font-semibold text-berry-600 transition hover:bg-berry-500/5">Ещё на витрину</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="paper-band min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-20">
          <EmptyState title="Сначала — знакомство" sub="Оформленіе заказа доступно гостямъ лавки. Войдите или зарегистрируйтесь — это минута, а бонусъ 500 ₽ уже ждётъ."
            action={<button onClick={() => setAuthOpen(true)} className="rounded-md bg-berry-500 px-6 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Войти въ лавку</button>} />
        </div>
      </main>
    );
  }

  if (rows.length === 0) {
    return (
      <main className="paper-band min-h-[70vh]">
        <div className="mx-auto max-w-xl px-4 py-20">
          <EmptyState title="Корзина пуста" sub="Нельзя оформить то, чего нѣтъ. Медовикъ, наполеонъ, макаруны — всё на витринѣ."
            action={<Link to="/catalog" className="rounded-md bg-berry-500 px-6 py-3 text-[14.5px] font-semibold text-white transition hover:bg-berry-600">На витрину</Link>} />
        </div>
      </main>
    );
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find((p) => p.code === code);
    if (!found) { pushToast({ title: "Такого промокода нѣтъ", desc: "Проверьте раскладку и срокъ дѣйствія", kind: "error" }); return; }
    if (subtotal < found.minOrder) { pushToast({ title: "Не хватаетъ до условія", desc: `Минимальная сумма заказа — ${fmt(found.minOrder)}`, kind: "error" }); return; }
    setAppliedPromo(found.code);
    pushToast({ title: `Промокодъ ${found.code} примѣнёнъ`, desc: found.note, kind: "success" });
  };

  const confirm = () => {
    const order = placeOrder({
      items: rows.map((r) => ({ productId: r.productId, title: r.product.title, price: r.product.price, qty: r.qty, image: r.product.image })),
      subtotal, discount: promoDiscount, deliveryCost, total,
      paymentMethod: payment === "card" ? "Карта · YooKassa" : payment === "sbp" ? "СБП" : "Сплитъ 4 платежа",
      confectionerId: rows[0].product.confectionerId,
      promoCode: appliedPromo || undefined, bonusUsed: bonusUsed || undefined,
      escrow: true, address: deliveryType === "pickup" ? "Самовывозъ изъ ателье" : address,
      deliveryDate: date || "день-в-день",
    });
    clearCart();
    setPlaced(order);
    confetti({ particleCount: 160, spread: 75, origin: { y: 0.6 }, colors: ["#8B2942", "#D97706", "#F3DCE2", "#16A34A"] });
  };

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <SectionHead center={false} kicker="почти у цѣли" title={<>Оформленіе заказа</>} />

        {/* шаги */}
        <div className="mt-6 flex items-center gap-2">
          {[["1", "Доставка"], ["2", "Оплата"], ["3", "Подтвержденіе"]].map(([n, label], i) => (
            <div key={n} className="flex items-center gap-2">
              <button onClick={() => (i + 1) < step && setStep((i + 1) as 1 | 2 | 3)} className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${step === i + 1 ? "bg-berry-500 text-white shadow-md" : step > i + 1 ? "bg-green-100 text-green-700" : "bg-white text-slate-400 border border-berry-100"}`}>
                <span className="font-mono">{step > i + 1 ? "✓" : n}</span> {label}
              </button>
              {i < 2 && <span className="h-px w-8 bg-berry-200" />}
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal key={step}>
            <div className="animate-slide-up rounded-2xl border border-berry-100 bg-white p-6 shadow-sm lg:p-7">
              {step === 1 && (
                <>
                  <h3 className="font-display text-2xl font-bold italic text-berry-900">Куда везти сладости?</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {([["express", "День-в-день", "за 3 часа · 490 ₽", Truck], ["scheduled", "Ко датѣ", "выберите день · 290 ₽", BadgeCheck], ["pickup", "Самовывозъ", "изъ ателье · 0 ₽", Gift]] as const).map(([id, t, d, Icon]) => (
                      <button key={id} onClick={() => setDeliveryType(id)}
                        className={`rounded-xl border-2 p-4 text-left transition ${deliveryType === id ? "border-berry-500 bg-berry-50 shadow-md" : "border-berry-100 hover:border-berry-300"}`}>
                        <Icon size={19} className={deliveryType === id ? "text-berry-600" : "text-slate-400"} />
                        <p className="mt-2 font-display text-[15px] font-bold italic text-berry-900">{t}</p>
                        <p className="font-mono text-[11px] text-slate-400">{d}</p>
                      </button>
                    ))}
                  </div>
                  {deliveryType !== "pickup" ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Адресъ доставки</span>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
                      </label>
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Дата и время</span>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
                      </label>
                    </div>
                  ) : (
                    <p className="mt-5 rounded-lg border border-dashed border-berry-300 bg-berry-50/50 px-4 py-3 text-[13px] text-berry-700">Ателье «Медовый дворъ»: Москва, Пятницкая 12, входъ со двора. Ежедневно 9:00–21:00.</p>
                  )}
                  <button onClick={() => setStep(2)} className="mt-7 rounded-md bg-berry-500 px-7 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Къ оплатѣ →</button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="font-display text-2xl font-bold italic text-berry-900">Чѣмъ платить?</h3>
                  <div className="mt-5 space-y-2.5">
                    {([["card", "Банковская карта", "Visa · Mir · YooKassa эскроу", CreditCard], ["sbp", "СБПъ", "по QR-коду, безъ комиссіи", Smartphone], ["split", "Сплитъ", "4 платежа по " + fmt(total / 4), Sparkles]] as const).map(([id, t, d, Icon]) => (
                      <button key={id} onClick={() => setPayment(id)}
                        className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${payment === id ? "border-berry-500 bg-berry-50 shadow-md" : "border-berry-100 hover:border-berry-300"}`}>
                        <span className={`grid h-10 w-10 place-items-center rounded-lg ${payment === id ? "bg-berry-500 text-white" : "bg-berry-50 text-berry-500"}`}><Icon size={18} /></span>
                        <span className="flex-1">
                          <span className="block font-display text-[15.5px] font-bold italic text-berry-900">{t}</span>
                          <span className="text-[12px] text-slate-400">{d}</span>
                        </span>
                        {payment === id && <Check size={18} className="text-green-600" />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-[12px] text-slate-400">
                    <span className="relative flex h-2 w-2"><span className="ping-dot relative inline-flex h-2 w-2 rounded-full bg-green-500 text-green-500" /></span>
                    Платёжъ уйдётъ на эскроу-счётъ — кондитеръ получитъ деньги только послѣ доставки
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="rounded-md px-5 py-3 text-[14px] font-semibold text-slate-500 transition hover:bg-berry-50">← Назадъ</button>
                    <button onClick={() => setStep(3)} className="rounded-md bg-berry-500 px-7 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Дальше →</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="font-display text-2xl font-bold italic text-berry-900">Свѣримъ часы</h3>
                  <ul className="mt-4 space-y-2 text-[13.5px] text-slate-600">
                    <li className="flex gap-2"><span className="text-gold">✦</span> Доставка: {deliveryType === "pickup" ? "самовывозъ, Пятницкая 12" : `${address}${date ? " · " + new Date(date).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : ""}`}</li>
                    <li className="flex gap-2"><span className="text-gold">✦</span> Оплата: {payment === "card" ? "карта · YooKassa (эскроу)" : payment === "sbp" ? "СБП по QR (эскроу)" : "сплитъ, 4 платежа"}</li>
                    <li className="flex gap-2"><span className="text-gold">✦</span> Начислимъ {earned} бонусовъ (кэшбэкъ 5%)</li>
                  </ul>
                  <div className="mt-5 flex gap-3">
                    <button onClick={() => setStep(2)} className="rounded-md px-5 py-3 text-[14px] font-semibold text-slate-500 transition hover:bg-berry-50">← Назадъ</button>
                    <button onClick={confirm} className="flex-1 rounded-md bg-green-700 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-green-700/30 transition hover:-translate-y-0.5 hover:bg-green-800 active:translate-y-0">
                      Оплатить {fmt(total)} · эскроу
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>

          {/* сводка */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl border border-berry-100 bg-white p-5 shadow-lg shadow-berry-950/5">
              <p className="font-hand text-lg text-berry-500">вашъ счётъ</p>
              <div className="mt-2 max-h-44 space-y-2.5 overflow-y-auto pr-1">
                {rows.map((r) => (
                  <div key={r.productId} className="flex items-center gap-2.5">
                    <img src={r.product.image} alt="" className="arch-sm h-11 w-11 shrink-0 object-cover" />
                    <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-slate-600">{r.product.title} <span className="text-slate-400">×{r.qty}</span></p>
                    <span className="font-mono text-[12px] font-semibold text-berry-900">{fmt(r.product.price * r.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Промокодъ</p>
                <div className="mt-1.5 flex gap-2">
                  <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="WELCOME10"
                    className="min-w-0 flex-1 rounded-md border border-berry-100 px-3 py-2 font-mono text-[12.5px] uppercase outline-none transition focus:border-berry-300" />
                  <button onClick={applyPromo} className="rounded-md bg-berry-900 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-berry-800">Ок</button>
                </div>
                {promo && <p className="mt-1.5 text-[11.5px] font-medium text-green-700">✓ {promo.note}</p>}
              </div>

              {(user?.bonusBalance || 0) > 0 && (
                <label className="mt-4 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-gold/60 bg-gold/5 px-3 py-2.5">
                  <span className="text-[12.5px] text-slate-600">Списать бонусы <span className="font-mono text-berry-700">(до {fmt(bonusCap)})</span></span>
                  <input type="checkbox" checked={useBonus} onChange={(e) => setUseBonus(e.target.checked)} className="h-4 w-4 accent-gold" />
                </label>
              )}

              <dl className="mt-4 space-y-1.5 border-t border-dashed border-berry-200 pt-3 font-mono text-[12.5px]">
                <div className="flex justify-between text-slate-500"><dt>Товары</dt><dd>{fmt(subtotal)}</dd></div>
                {promoDiscount > 0 && <div className="flex justify-between text-green-700"><dt>Промокодъ</dt><dd>−{fmt(promoDiscount)}</dd></div>}
                {bonusUsed > 0 && <div className="flex justify-between text-gold"><dt>Бонусы</dt><dd>−{fmt(bonusUsed)}</dd></div>}
                <div className="flex justify-between text-slate-500"><dt>Доставка</dt><dd>{deliveryCost ? fmt(deliveryCost) : "безплатно"}</dd></div>
                <div className="flex justify-between border-t border-berry-200 pt-2 text-[16px] font-bold text-berry-900"><dt>Итого</dt><dd key={total} className="animate-pop">{fmt(total)}</dd></div>
              </dl>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-400"><Sparkles size={12} className="text-gold" /> +{earned} бонусовъ послѣ оплаты</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
