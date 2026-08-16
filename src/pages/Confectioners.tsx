import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, CalendarDays, MapPin, Send } from "lucide-react";
import { CONFECTIONERS, PRODUCTS, TARIFFS, fmt } from "../lib/data";
import type { Confectioner } from "../lib/data";
import { useStore } from "../lib/store";
import { Modal, Reveal, SectionHead, Stars, TrustBadge } from "../components/ui";
import { ProductCard } from "./Home";

export default function Confectioners() {
  const [profile, setProfile] = useState<Confectioner | null>(null);
  const { addToCart, pushToast } = useStore();

  return (
    <main className="paper-band min-h-[70vh]">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <SectionHead kicker="гильдія мастеровъ" title={<>Наши кондитеры</>} sub="Каждый прошёлъ инспекцію качества, а кухня — сертификацію. Уровни доверія: Новичокъ → Проверенъ → Мастеръ → Экспертъ." />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CONFECTIONERS.map((c, i) => {
            const goods = PRODUCTS.filter((p) => p.confectionerId === c.id);
            return (
              <Reveal key={c.id} delay={i * 60}>
                <button onClick={() => setProfile(c)} className="group flex h-full w-full flex-col rounded-xl border border-berry-100/80 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-berry-300 hover:shadow-xl hover:shadow-berry-950/10">
                  <div className="flex items-start gap-4">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-berry-500 font-display text-xl font-bold italic text-white shadow-md shadow-berry-500/30 transition group-hover:scale-105">{c.portrait}</span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-[19px] font-bold italic text-berry-900">{c.name}</p>
                      <p className="font-hand text-[15px] text-berry-500">{c.atelier}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <TrustBadge trust={c.trust} />
                    <span className="rounded-sm bg-paper px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-500">тарифъ {c.tariff}</span>
                    <span className="flex items-center gap-1 rounded-sm bg-berry-50 px-2 py-0.5 font-mono text-[10.5px] text-berry-600"><MapPin size={10} /> {c.city}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{c.about}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.spec.map((s) => <span key={s} className="rounded-full border border-berry-100 bg-berry-50/60 px-2.5 py-1 text-[11px] text-berry-700">{s}</span>)}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-dashed border-berry-200 pt-3.5">
                    <span className="flex items-center gap-2">
                      <Stars value={c.rating} size={13} />
                      <span className="font-mono text-[12px] text-slate-500">{c.rating} · {c.reviews}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{goods.length} тов. · съ {c.since} г.</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* тарифы для кондитеров */}
        <section className="mt-20">
          <SectionHead kicker="хотите печь и продавать?" title={<>Тарифы гильдіи</>} sub="Абонентская плата и комиссія съ заказа. Эскроу-выплаты отъ 5 000 ₽ — на карту или по СБП." />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TARIFFS.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <div className={`flex h-full flex-col rounded-xl border p-5 transition hover:-translate-y-1 hover:shadow-xl ${t.id === "PREMIUM" ? "border-gold bg-berry-900 text-white shadow-lg shadow-berry-950/20" : "border-berry-100 bg-white shadow-sm"}`}>
                  <div className="flex items-baseline justify-between">
                    <p className={`font-mono text-[11px] uppercase tracking-widest ${t.id === "PREMIUM" ? "text-gold" : "text-slate-400"}`}>{t.id}</p>
                    {t.id === "PREMIUM" && <span className="rounded-sm bg-gold px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase text-berry-950">выборъ мастеровъ</span>}
                  </div>
                  <p className={`mt-2 font-display text-3xl font-bold italic ${t.id === "PREMIUM" ? "text-white" : "text-berry-900"}`}>
                    {t.price === 0 ? "0 ₽" : fmt(t.price)}<span className={`text-sm font-normal not-italic ${t.id === "PREMIUM" ? "text-berry-200" : "text-slate-400"}`}>/мѣс</span>
                  </p>
                  <p className={`mt-1 font-mono text-[12.5px] ${t.id === "PREMIUM" ? "text-gold" : "text-berry-600"}`}>комиссія {t.commission}% съ заказа</p>
                  <ul className={`mt-4 flex-1 space-y-2 text-[12.5px] ${t.id === "PREMIUM" ? "text-berry-100/85" : "text-slate-500"}`}>
                    {t.perks.map((p) => <li key={p} className="flex gap-2"><span className={t.id === "PREMIUM" ? "text-gold" : "text-green-600"}>✓</span>{p}</li>)}
                  </ul>
                  <button
                    onClick={() => pushToast({ title: "Заявка на тарифъ " + t.id + " принята", desc: "Менеджеръ гильдіи напишетъ вамъ въ теченіе дня", kind: "success" })}
                    className={`mt-5 rounded-md py-2.5 text-[13.5px] font-bold transition ${t.id === "PREMIUM" ? "bg-gold text-berry-950 hover:brightness-110" : "border-2 border-berry-500 text-berry-600 hover:bg-berry-500 hover:text-white"}`}>
                    Выбрать {t.id}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* профиль кондитера */}
      <Modal open={!!profile} onClose={() => setProfile(null)} wide>
        {profile && (
          <div className="p-7">
            <div className="flex flex-wrap items-start gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-berry-500 font-display text-2xl font-bold italic text-white shadow-lg">{profile.portrait}</span>
              <div className="min-w-0 flex-1">
                <p className="font-hand text-xl text-berry-500">{profile.atelier}</p>
                <h3 className="font-display text-3xl font-bold italic text-berry-900">{profile.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TrustBadge trust={profile.trust} />
                  <span className="flex items-center gap-1 text-[12.5px] text-slate-500"><MapPin size={12} /> {profile.city}</span>
                  <span className="flex items-center gap-1 text-[12.5px] text-slate-500"><CalendarDays size={12} /> съ {profile.since} года</span>
                  <span className="flex items-center gap-1 text-[12.5px] text-slate-500"><Award size={12} className="text-gold" /> инспекція пройдена</span>
                </div>
              </div>
              <div className="text-right">
                <Stars value={profile.rating} size={15} />
                <p className="mt-1 font-mono text-[12px] text-slate-500">{profile.rating} · {profile.reviews} отзывовъ</p>
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-slate-600">{profile.about}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.spec.map((s) => <span key={s} className="rounded-full bg-berry-50 px-3 py-1 text-[12px] font-medium text-berry-700">{s}</span>)}
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-400">Витрина мастера</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {PRODUCTS.filter((p) => p.confectionerId === profile.id).map((p) => (
                <div key={p.id} className="flex gap-3 rounded-lg border border-berry-100 bg-paper/60 p-2.5">
                  <img src={p.image} alt={p.title} className="arch-sm h-16 w-16 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} onClick={() => setProfile(null)} className="block truncate text-[13.5px] font-semibold text-berry-900 hover:text-berry-600">{p.title}</Link>
                    <p className="font-mono text-[12px] font-bold text-berry-700">{fmt(p.price)}</p>
                    <button onClick={() => addToCart(p.id)} className="mt-1 text-[11.5px] font-semibold text-gold hover:text-berry-600">+ въ корзину</button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => pushToast({ title: "Сообщеніе отправлено", desc: profile.name + " отвѣтитъ въ чатѣ въ теченіе 15 минутъ", kind: "success" })}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-berry-500 py-3 text-[14.5px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:bg-berry-600">
              <Send size={15} /> Написать мастеру
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
}
