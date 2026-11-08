import { useState } from "react";
import { Copy, Gift, Mail, MapPin, Phone, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BASE_PROMOS, fmt } from "../lib/data";
import { useStore } from "../lib/store";
import { Ornament, Reveal, SectionHead } from "../components/ui";

/* ================= ПОДАРКИ ================= */
export function Gifts() {
  const { buyCertificate, certificates, user, setAuthOpen, pushToast } = useStore();
  const [amount, setAmount] = useState(3000);
  const [email, setEmail] = useState("");

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <SectionHead kicker="подарокъ со вкусомъ" title={<>Подарочные сертификаты</>} sub="Номиналы отъ 500 до 10 000 ₽. Срокъ дѣйствія — 12 мѣсяцевъ. Доставка на почту (PDF) или курьеромъ въ нарядной коробкѣ." />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal dir="left">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[500, 1000, 3000, 5000, 10000].map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`ticket-edge group rounded-lg border-2 p-5 text-center transition ${amount === a ? "border-gold bg-berry-900 text-white shadow-xl" : "border-dashed border-berry-300 bg-white hover:-translate-y-1 hover:border-gold hover:shadow-lg"}`}>
                  <Gift size={17} className={`mx-auto ${amount === a ? "text-gold" : "text-berry-400"}`} />
                  <p className={`mt-2 font-mono text-xl font-bold ${amount === a ? "text-gold" : "text-berry-800"}`}>{fmt(a)}</p>
                  <p className={`font-hand text-[14px] ${amount === a ? "text-berry-200" : "text-slate-400"}`}>на сладости</p>
                </button>
              ))}
              <div className={`ticket-edge rounded-lg border-2 p-5 text-center ${amount === -1 ? "border-gold bg-berry-900 text-white" : "border-dashed border-berry-300 bg-white"}`}>
                <label className="block cursor-pointer">
                  <p className={`font-hand text-[15px] ${amount === -1 ? "text-berry-200" : "text-slate-400"}`}>свой номиналъ</p>
                  <input type="number" min={100} step={100} placeholder="7 500"
                    onFocus={() => setAmount(-1)} onChange={(e) => setAmount(parseInt(e.target.value || "0", 10) || -1)}
                    className="mt-1 w-full bg-transparent text-center font-mono text-lg font-bold text-berry-800 outline-none placeholder:text-slate-300" />
                </label>
              </div>
            </div>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => {
              e.preventDefault();
              if (!user) { setAuthOpen(true); pushToast({ title: "Войдите для покупки", desc: "Сертификатъ привяжется къ вашему кабинету", kind: "info" }); return; }
              if (amount <= 0) { pushToast({ title: "Укажите номиналъ", kind: "error" }); return; }
              buyCertificate(amount);
            }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="кому: anna@example.ru" required
                className="flex-1 rounded-md border border-berry-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
              <button className="rounded-md bg-berry-500 px-7 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:-translate-y-0.5 hover:bg-berry-600">
                Купить за {amount > 0 ? fmt(amount) : "…"}
              </button>
            </form>
            <p className="mt-2 text-[11.5px] text-slate-400">Оплата картой или СБПъ · PDF придётъ мгновенно · примѣняется въ полѣ «промокодъ» при заказѣ</p>
          </Reveal>

          <Reveal dir="right" delay={120}>
            <div className="rotate-2 rounded-xl bg-berry-900 p-7 text-center shadow-2xl transition hover:rotate-0">
              <Ornament className="text-gold" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-berry-300">подарочный сертификатъ</p>
              <p className="mt-2 font-display text-2xl font-bold italic text-white">Уездный кондитер</p>
              <p className="mt-4 font-mono text-3xl font-bold text-gold">{amount > 0 ? fmt(amount) : "— ₽"}</p>
              <p className="mt-4 font-hand text-lg text-berry-200">дѣйствителенъ 12 мѣсяцевъ</p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.25em] text-berry-300">CONDIT-••••-••••</p>
              <Ornament className="mt-4 text-gold" />
            </div>
            {certificates.length > 0 && (
              <div className="mt-6 rounded-xl border border-berry-100 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Мои сертификаты</p>
                {certificates.map((c) => (
                  <div key={c.id} className="mt-2 flex items-center justify-between rounded-lg border border-dashed border-gold/60 bg-gold/5 px-3 py-2.5">
                    <button onClick={() => { navigator.clipboard?.writeText(c.code).catch(() => undefined); pushToast({ title: "Кодъ скопированъ", kind: "success" }); }} className="flex items-center gap-2 font-mono text-[12.5px] font-bold text-berry-700 hover:text-berry-900"><Copy size={12} /> {c.code}</button>
                    <span className="font-mono text-[12.5px] text-slate-500">{fmt(c.amount)} · {c.status === "purchased" ? "активенъ" : c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </main>
  );
}

/* ================= АКЦИИ ================= */
export function Promotions() {
  const { promos, pushToast } = useStore();
  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-4xl px-4 py-10 lg:py-14">
        <SectionHead kicker="экономимъ съ умомъ" title={<>Акціи и промокоды</>} sub="Вводите коды на шаге оформленія. Администраторы выпускаютъ новые коды прямо изъ кабинета — заходите почаще." />
        <div className="mt-9 space-y-3.5">
          {promos.map((p, i) => (
            <Reveal key={p.code} delay={i * 60}>
              <div className="ticket-edge flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-dashed border-berry-300 bg-white px-6 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div>
                  <p className="font-mono text-[19px] font-bold tracking-widest text-berry-800">{p.code}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{p.note}{p.minOrder > 0 && ` · отъ ${fmt(p.minOrder)}`}</p>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(p.code).catch(() => undefined); pushToast({ title: `${p.code} скопированъ`, desc: "Вставьте его на шаге оформленія", kind: "success" }); }}
                  className="flex items-center gap-2 rounded-md bg-berry-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-berry-600 active:scale-95">
                  <Copy size={14} /> Скопировать
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-slate-400">Промокоды не суммируются между собой, но дружатъ съ бонусами.</p>
      </div>
    </main>
  );
}

/* ================= О ЛАВКЕ + ЛЕГАЛЬНОЕ ================= */
export function About() {
  const [params] = useSearchParams();
  const legal = params.get("legal");
  const legalTexts: Record<string, [string, string]> = {
    terms: ["Условія пользованія", "Платформа «Уездный кондитеръ» (conditera.ru) соединяетъ покупателей съ домашними кондитерами. Все сдѣлки проводятся черезъ эскроу-счета: покупатель оплачиваетъ заказъ при оформленіи, кондитеръ получаетъ выплату послѣ подтвержденія доставки. Платформа удерживаетъ комиссію 5–15% согласно тарифу кондитера."],
    privacy: ["Политика конфиденціальности", "Мы хранимъ только то, что нужно для заказа: имя, адресъ доставки и исторію покупокъ. Данные не передаются третьимъ лицамъ, кромѣ курьерскихъ службъ и платёжнаго сервиса YooKassa. Удалить аккаунтъ и всѣ данные можно однимъ письмомъ на privet@conditera.ru."],
    escrow: ["Какъ работаетъ эскроу", "1) Покупатель оплачиваетъ заказъ — деньги резервируются на защищённомъ счётѣ. 2) Кондитеръ видитъ оплаченный заказъ и приступаетъ къ работѣ. 3) Послѣ доставки покупатель подтверждаетъ полученіе. 4) Черезъ 7 дней деньги отпускаются кондитеру за вычетомъ комиссіи. При спорѣ подключается арбитръ платформы, застрахованные заказы покрываются на 100%."],
  };

  if (legal && legalTexts[legal]) {
    const [t, body] = legalTexts[legal];
    return (
      <main className="paper-band min-h-[70vh]">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <Reveal>
            <p className="font-hand text-xl text-berry-500">юридическій отдѣлъ</p>
            <h1 className="mt-1 font-display text-4xl font-bold italic text-berry-900">{t}</h1>
            <Ornament className="mt-4 text-berry-300" />
            <p className="mt-5 text-[15px] leading-relaxed text-slate-600">{body}</p>
            <p className="mt-5 text-[13px] text-slate-400">Редакція отъ 1 февраля 2026 г. · ООО «Уездный кондитеръ» · conditera.ru</p>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <SectionHead kicker="наша исторія" title={<>О лавкѣ</>} />
        <Reveal>
          <div className="prose-custom mx-auto mt-7 max-w-2xl space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>Всё началось въ 2016 году съ одного медовика и доски объявленій уезднаго городка. Анна Прянишникова пекла по семейному рецепту, сосѣди просили ещё — такъ появилась первая «витрина».</p>
            <p>Сегодня «Уездный кондитеръ» — это <b className="text-berry-700">427 кондитеровъ</b> изъ 54 городовъ, эскроу-оплата, инспекція каждой кухни и доставка день-в-день. Мы вѣримъ, что настоящій тортъ печётся руками, а не конвейеромъ.</p>
            <p className="font-hand text-xl text-berry-500">— съ любовью и сахарной пудрой, команда conditera.ru</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[["2016", "годъ основанія"], ["54", "города Россіи"], ["38 214", "тортовъ испечено"]].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-berry-100 bg-white p-5 text-center shadow-sm">
                <p className="font-display text-3xl font-bold italic text-berry-800">{v}</p>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-widest text-slate-400">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-2 text-center text-[13px]">
            {(["terms", "privacy", "escrow"] as const).map((k) => (
              <a key={k} href={`#/about?legal=${k}`} className="mx-3 text-berry-600 underline-offset-4 hover:underline">{legalTexts[k][0]}</a>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}

/* ================= FAQ ================= */
const FAQS: [string, string][] = [
  ["Какъ быстро привезутъ тортъ?", "По Москве и Петербургу — день-в-день (за 3 часа), по Россіи — СДЭК за 1–3 дня для тортовъ, которые переживутъ дорогу. Бенто-торты печёмъ за 24 часа."],
  ["Что такое эскроу-оплата?", "Вы платите сразу, но деньги лежатъ на защищённомъ счётѣ до доставки. Кондитеръ получаетъ ихъ только послѣ того, какъ вы подтвердите полученіе торта. Споръ? Подключается арбитръ."],
  ["Можно ли вернуть деньги?", "Да. Если до доставки больше 24 часовъ и сумма меньше 5 000 ₽ — возвратъ автоматическій. Иначе заявка уходит модератору, рѣшеніе — за 1 день."],
  ["Какъ стать кондитеромъ платформы?", "Регистрація съ ролью «Кондитер», инспекція кухни (онлайнъ, 40 минутъ), сертификація — и витрина открыта. Тарифы отъ 0 ₽, комиссія 5–15%."],
  ["Что такое бонусная лѣсенка?", "Кэшбэкъ баллами: Бронза 3%, Серебро 5%, Золото 7%, Платина 10%. 1 бонусъ = 1 ₽, оплатить можно до 30% заказа. Бонусы живутъ 12 мѣсяцевъ."],
  ["Печёте ли вы безъ глютена и для вегановъ?", "Печёмъ! Фильтръ «Діета» на витринѣ покажетъ всѣ подходящіе торты, а въ конструкторѣ можно отмѣтить до нѣсколькихъ ограниченій сразу."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <SectionHead kicker="спрашивали — отвѣчаемъ" title={<>Вопросы и отвѣты</>} />
        <div className="mt-9 space-y-3">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} delay={i * 50}>
              <div className={`overflow-hidden rounded-xl border transition ${open === i ? "border-berry-300 bg-white shadow-md" : "border-berry-100 bg-white/70"}`}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-display text-[16.5px] font-bold italic text-berry-900">{q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-berry-200 font-display text-lg italic text-berry-500 transition-transform duration-300 ${open === i ? "rotate-45 bg-berry-500 text-white !border-berry-500" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[14px] leading-relaxed text-slate-600">{a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ================= КОНТАКТЫ + TELEGRAM ================= */
export function Contacts() {
  const { pushToast } = useStore();
  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
        <SectionHead kicker="всегда на связи" title={<>Контакты</>} />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {[
            { icon: <Phone size={19} />, t: "Телефонъ лавки", d: "8 800 555-19-13", s: "безплатно по Россіи, 9:00–21:00" },
            { icon: <Mail size={19} />, t: "Почта", d: "privet@conditera.ru", s: "отвѣчаемъ въ теченіе часа" },
            { icon: <MapPin size={19} />, t: "Главная лавка", d: "Москва, Пятницкая 12", s: "ежедневно 9:00–21:00" },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <div className="h-full rounded-xl border border-berry-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-berry-500 text-white">{c.icon}</span>
                <p className="mt-3 font-display text-lg font-bold italic text-berry-900">{c.t}</p>
                <p className="font-mono text-[14px] font-bold text-berry-600">{c.d}</p>
                <p className="mt-1 text-[12px] text-slate-400">{c.s}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <form className="mx-auto mt-8 max-w-xl rounded-xl border border-berry-100 bg-white p-5 shadow-sm" onSubmit={(e) => { e.preventDefault(); pushToast({ title: "Письмо улетѣло въ лавку", desc: "Отвѣтимъ на почту въ теченіе часа", kind: "success" }); (e.target as HTMLFormElement).reset(); }}>
            <p className="font-hand text-lg text-berry-500">напишите намъ</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input required type="email" placeholder="ваша@почта.ру" className="rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none focus:border-berry-300" />
              <input required placeholder="Тема" className="rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none focus:border-berry-300" />
            </div>
            <textarea required rows={3} placeholder="Содержаніе письма…" className="mt-3 w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none focus:border-berry-300" />
            <button className="mt-3 w-full rounded-md bg-berry-500 py-3 text-[14px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">Отправить</button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}

export function TelegramPage() {
  const { pushToast } = useStore();
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-berry-950 py-14 text-white">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 lg:grid-cols-2">
        <Reveal dir="left">
          <p className="font-hand text-2xl text-berry-300">телеграфъ для своихъ</p>
          <h1 className="mt-2 font-display text-4xl font-bold italic leading-tight lg:text-5xl">Ботъ <span className="text-gold">@conditera</span></h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-berry-100/75">Статусы заказовъ, секретные промокоды по пятницамъ и «тортъ дня» съ скидкой 20% — прямо въ Telegram. Подписаны уже 12 480 сладкоежекъ.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => pushToast({ title: "Открываемъ Telegram…", desc: "t.me/conditera — ботъ уже ждётъ", kind: "info" })} className="flex items-center gap-2 rounded-md bg-gold px-6 py-3.5 text-[15px] font-bold text-berry-950 shadow-xl shadow-gold/20 transition hover:-translate-y-0.5 hover:brightness-110"><Send size={16} /> Подписаться</button>
            <button onClick={() => pushToast({ title: "Ботъ подключёнъ (демо)", desc: "Уведомленія о статусахъ будутъ приходить сюда", kind: "success" })} className="rounded-md border-2 border-berry-400 px-5 py-3 text-[15px] font-semibold text-berry-100 transition hover:bg-berry-800">Привязать аккаунтъ</button>
          </div>
        </Reveal>
        <Reveal dir="right" delay={120}>
          <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-berry-700 bg-berry-900/80 p-5 shadow-2xl backdrop-blur">
            <p className="text-center font-mono text-[10.5px] uppercase tracking-widest text-berry-300">предпросмотръ ленты</p>
            {[
              ["🎂 Тортъ дня — Медовикъ «Уездный»", "−20% до 22:00 по коду изъ бота"],
              ["📦 Заказъ УК-48211: ВЪ ПУТИ", "курьеръ Николай, 12 минутъ"],
              ["🍯 Пятничный промокодъ", "MASLENITSA500 — 500 ₽ отъ 3 000 ₽"],
            ].map(([t, d]) => (
              <div key={t} className="rounded-lg bg-berry-800/90 p-3.5 transition hover:translate-x-1">
                <p className="text-[13.5px] font-semibold">{t}</p>
                <p className="mt-0.5 text-[12px] text-berry-200/70">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
