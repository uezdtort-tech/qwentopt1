import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useStore } from "../lib/store";

/* ---------------- scroll reveal ---------------- */
export function Reveal({ children, className = "", dir = "up", delay = 0 }: { children: ReactNode; className?: string; dir?: "up" | "left" | "right"; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const base = dir === "left" ? "reveal-left" : dir === "right" ? "reveal-right" : "reveal";
  return (
    <div ref={ref} className={`${base} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- animated counter ---------------- */
export function Counter({ to, suffix = "", prefix = "", duration = 1200, className = "" }: { to: number; suffix?: string; prefix?: string; duration?: number; className?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} className={className}>{prefix}{new Intl.NumberFormat("ru-RU").format(val)}{suffix}</span>;
}

/* ---------------- stars ---------------- */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label={`Рейтинг ${value}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(value) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------------- section heading ---------------- */
export function Flourish({ className = "text-berry-300" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={`h-3 w-28 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M0 6h42M78 6h42" />
      <path d="M60 1c-3 3-3 7 0 10 3-3 3-7 0-10z" fill="currentColor" stroke="none" />
      <circle cx="50" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="70" cy="6" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SectionHead({ kicker, title, sub, dark = false, center = true }: { kicker: string; title: ReactNode; sub?: string; dark?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className={`font-hand text-xl ${dark ? "text-berry-200" : "text-berry-500"} ${center ? "" : ""}`}>{kicker}</p>
      <div className={`mt-1 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <Flourish className={dark ? "text-berry-300/60" : "text-berry-300"} />
        <h2 className={`font-display text-3xl font-bold italic leading-tight md:text-[2.6rem] ${dark ? "text-berry-50" : "text-berry-900"}`}>{title}</h2>
        <Flourish className={dark ? "text-berry-300/60" : "text-berry-300"} />
      </div>
      {sub && <p className={`mx-auto mt-3 max-w-xl text-[15px] leading-relaxed ${dark ? "text-berry-100/70" : "text-slate-500"}`}>{sub}</p>}
    </Reveal>
  );
}

/* ---------------- modal ---------------- */
export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-berry-950/60 p-0 backdrop-blur-[3px] sm:items-center sm:p-6" onMouseDown={onClose}>
      <div
        className={`animate-modal relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-xl ${wide ? "sm:max-w-3xl" : "sm:max-w-md"}`}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 shadow ring-1 ring-slate-200 transition hover:bg-berry-500 hover:text-white" aria-label="Закрыть">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- toasts ---------------- */
export function ToastHost() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="animate-slide-up pointer-events-auto flex items-start gap-3 rounded-lg border border-berry-100 bg-white/95 p-3.5 shadow-xl shadow-berry-950/10 backdrop-blur">
          <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${t.kind === "success" ? "bg-green-100 text-green-700" : t.kind === "error" ? "bg-red-100 text-red-600" : "bg-berry-100 text-berry-600"}`}>
            {t.kind === "success" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
            ) : t.kind === "error" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 8v.5M12 12v5" /></svg>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-bold italic text-berry-900">{t.title}</p>
            {t.desc && <p className="mt-0.5 text-[12.5px] leading-snug text-slate-500">{t.desc}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-slate-300 transition hover:text-berry-500" aria-label="Скрыть">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------- misc ---------------- */
export function TrustBadge({ trust }: { trust: string }) {
  const map: Record<string, string> = { NEW: "bg-slate-100 text-slate-600", VERIFIED: "bg-sky-100 text-sky-700", MASTER: "bg-amber-100 text-amber-700", EXPERT: "bg-berry-500 text-white" };
  const label: Record<string, string> = { NEW: "Новичокъ", VERIFIED: "Проверенъ", MASTER: "Мастеръ", EXPERT: "Экспертъ" };
  return <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wider ${map[trust] || map.NEW}`}>{label[trust] || trust}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const idx = ["PENDING", "CONFIRMED", "PREPARING", "READY", "IN_DELIVERY", "DELIVERED", "COMPLETED"].indexOf(status);
  const colors = ["bg-slate-100 text-slate-600", "bg-sky-100 text-sky-700", "bg-amber-100 text-amber-700", "bg-amber-200 text-amber-800", "bg-berry-100 text-berry-600", "bg-green-100 text-green-700", "bg-green-600 text-white"];
  const labels: Record<string, string> = { PENDING: "Ожидаетъ", CONFIRMED: "Подтверждёнъ", PREPARING: "В печи", READY: "Готовъ", IN_DELIVERY: "Въ пути", DELIVERED: "Доставленъ", COMPLETED: "Завершёнъ" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider ${colors[Math.max(0, idx)]}`}>
      {idx >= 1 && idx < 5 && <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-current ping-dot" />}
      {labels[status] || status}
    </span>
  );
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      <span className="h-px w-16 bg-current opacity-30" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" opacity="0.6"><path d="M7 0l1.8 5.2L14 7l-5.2 1.8L7 14 5.2 8.8 0 7l5.2-1.8z" /></svg>
      <span className="h-px w-16 bg-current opacity-30" />
    </div>
  );
}

export function EmptyState({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="dash-border rounded-lg bg-paper px-6 py-14 text-center">
      <svg className="mx-auto h-12 w-12 text-berry-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 34h28v6H10z" /><path d="M14 24h20v8H14z" /><path d="M18 15h12v7H18z" /><path d="M24 8v4" /><circle cx="24" cy="6" r="1.6" fill="currentColor" />
        <path d="M6 44h36" strokeLinecap="round" />
      </svg>
      <p className="mt-4 font-display text-xl font-bold italic text-berry-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{sub}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
