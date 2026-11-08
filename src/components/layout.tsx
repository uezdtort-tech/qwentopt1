import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingBasket, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Send, ChevronDown } from "lucide-react";
import { useStore } from "../lib/store";
import type { Role } from "../lib/data";
import { PRODUCTS, ROLE_LABEL, fmt } from "../lib/data";
import { Modal } from "./ui";

/* ================= HEADER ================= */
export function Header() {
  const { cartCount, setCartOpen, favorites, user, setAuthOpen, logout, switchRole, search, setSearch } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h(); window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setMenuOpen(false); setRoleOpen(false); }, [loc.pathname]);

  const links = [
    { to: "/catalog", label: "Витрина" },
    { to: "/builder", label: "Конструкторъ" },
    { to: "/confectioners", label: "Кондитеры" },
    { to: "/recipes", label: "Рецепты" },
    { to: "/gifts", label: "Подарки" },
    { to: "/promotions", label: "Акціи" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* верхняя лента */}
      <div className="bg-berry-950 text-berry-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-[11.5px]">
          <p className="flex items-center gap-2 font-mono tracking-wide">
            <span className="text-berry-300">✦</span> conditera.ru · ежедневно съ 8:00 до 22:00
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <a href="#/telegram" className="flex items-center gap-1.5 transition hover:text-white"><Send size={12} /> @conditera</a>
            <span className="text-berry-300">Эскроу-оплата: деньги кондитеру послѣ доставки</span>
          </div>
        </div>
      </div>

      {/* основная шапка */}
      <div className={`border-b border-berry-100/70 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-lg shadow-berry-950/5" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button className="grid h-10 w-10 place-items-center rounded-md text-berry-700 hover:bg-berry-50 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-berry-500 text-white shadow-md shadow-berry-500/30 transition group-hover:rotate-6 group-hover:bg-berry-600">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor"><path d="M8 21h16v4H8z" /><path d="M10 14h12v6H10z" opacity="0.85" /><path d="M13 8h6v5h-6z" opacity="0.7" /><circle cx="16" cy="6" r="2" className="text-amber-400" fill="#fbbf24" /></svg>
            </span>
            <span className="leading-none">
              <span className="block font-display text-[1.35rem] font-bold italic tracking-tight text-berry-800">Уездный кондитер</span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.22em] text-berry-400">маркетплейсъ · съ 2016 года</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`relative rounded-md px-3 py-2 text-[13.5px] font-medium transition ${loc.pathname === l.to ? "text-berry-600" : "text-slate-600 hover:bg-berry-50 hover:text-berry-700"}`}>
                {l.label}
                {loc.pathname === l.to && <span className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-gold" />}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <form
              className="relative hidden md:block"
              onSubmit={(e) => { e.preventDefault(); nav("/catalog?q=" + encodeURIComponent(search)); }}
            >
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Медовикъ, макаруны…"
                className="w-44 rounded-full border border-berry-100 bg-berry-50/50 py-2 pl-9 pr-3 text-[13px] outline-none transition placeholder:text-slate-400 focus:w-56 focus:border-berry-300 focus:bg-white focus:ring-2 focus:ring-berry-100"
              />
            </form>

            <Link to="/catalog?fav=1" className="relative grid h-10 w-10 place-items-center rounded-md text-slate-600 transition hover:bg-berry-50 hover:text-berry-600" aria-label="Избранное">
              <Heart size={19} />
              {favorites.length > 0 && <span className="animate-pop absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-berry-500 px-1 font-mono text-[10px] font-bold text-white">{favorites.length}</span>}
            </Link>

            <button onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-md text-slate-600 transition hover:bg-berry-50 hover:text-berry-600" aria-label="Корзина">
              <ShoppingBasket size={19} />
              {cartCount > 0 && <span key={cartCount} className="animate-pop absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gold px-1 font-mono text-[10px] font-bold text-white">{cartCount}</span>}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setRoleOpen(!roleOpen)} className="flex items-center gap-2 rounded-md border border-berry-100 py-1.5 pl-1.5 pr-2 transition hover:border-berry-300 hover:bg-berry-50/60">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-berry-500 font-display text-[11px] font-bold italic text-white">{user.name.slice(0, 1).toUpperCase()}</span>
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-[90px] truncate text-[12px] font-semibold leading-tight text-berry-900">{user.name}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-gold">{ROLE_LABEL[user.activeRole]}</span>
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>
                {roleOpen && (
                  <div className="animate-modal absolute right-0 top-[calc(100%+8px)] w-60 rounded-lg border border-berry-100 bg-white p-2 shadow-xl shadow-berry-950/10">
                    <p className="px-2 pb-1 pt-1 font-mono text-[9.5px] uppercase tracking-widest text-slate-400">Переключить роль</p>
                    {(["CUSTOMER", "CONFECTIONER", "COURIER", "ADMIN"] as Role[]).map((r) => (
                      <button key={r} onClick={() => { switchRole(r); setRoleOpen(false); nav("/dashboard"); }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[13px] transition ${user.activeRole === r ? "bg-berry-50 font-semibold text-berry-700" : "text-slate-600 hover:bg-berry-50/60"}`}>
                        {ROLE_LABEL[r]}
                        {user.activeRole === r && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                      </button>
                    ))}
                    <div className="my-1.5 h-px bg-berry-100" />
                    <Link to="/dashboard" className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] text-slate-600 transition hover:bg-berry-50/60"><LayoutDashboard size={14} /> Кабинетъ</Link>
                    <button onClick={() => { logout(); setRoleOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[13px] text-red-500 transition hover:bg-red-50"><LogOut size={14} /> Выйти</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="ml-1 rounded-md bg-berry-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-berry-500/25 transition hover:-translate-y-0.5 hover:bg-berry-600 hover:shadow-lg active:translate-y-0">
                Войти
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <nav className="animate-slide-up border-t border-berry-100 bg-white px-4 py-3 lg:hidden">
            <form className="relative mb-3" onSubmit={(e) => { e.preventDefault(); nav("/catalog?q=" + encodeURIComponent(search)); setMenuOpen(false); }}>
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти на витринѣ…"
                className="w-full rounded-full border border-berry-100 bg-berry-50/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-berry-300" />
            </form>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-slate-700 transition hover:bg-berry-50 hover:text-berry-700">{l.label}</Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

/* ================= CART DRAWER ================= */
export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart } = useStore();
  const nav = useNavigate();
  const rows = cart.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.productId)! })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);

  useEffect(() => {
    if (!cartOpen) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [cartOpen, setCartOpen]);
  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-berry-950/50 backdrop-blur-[2px]" onMouseDown={() => setCartOpen(false)}>
      <aside className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-berry-100 px-5 py-4">
          <div>
            <p className="font-hand text-lg text-berry-500">ваша корзина</p>
            <h3 className="font-display text-xl font-bold italic text-berry-900">Корзина</h3>
          </div>
          <button onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-berry-50 hover:text-berry-600" aria-label="Закрыть корзину"><X size={18} /></button>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBasket size={40} className="text-berry-200" />
            <p className="mt-4 font-display text-lg font-bold italic text-berry-900">Пока пусто</p>
            <p className="mt-1 text-sm text-slate-500">Загляните на витрину — медовикъ самъ себя не съестъ.</p>
            <button onClick={() => { setCartOpen(false); nav("/catalog"); }} className="mt-5 rounded-md bg-berry-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-berry-600">На витрину</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {rows.map((r) => (
                <div key={r.productId} className="flex gap-3 rounded-lg border border-berry-100/80 bg-paper/60 p-2.5 transition hover:border-berry-200">
                  <img src={r.product.image} alt={r.product.title} className="arch-sm h-16 w-16 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-berry-900">{r.product.title}</p>
                    <p className="font-mono text-[11px] text-slate-400">{r.product.weight}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-berry-100 bg-white">
                        <button onClick={() => setQty(r.productId, r.qty - 1)} className="px-2 py-1 text-slate-400 transition hover:text-berry-600" aria-label="Меньше">−</button>
                        <span className="min-w-6 text-center font-mono text-[12.5px] font-bold text-berry-900">{r.qty}</span>
                        <button onClick={() => setQty(r.productId, r.qty + 1)} className="px-2 py-1 text-slate-400 transition hover:text-berry-600" aria-label="Больше">+</button>
                      </div>
                      <span className="font-mono text-[13px] font-bold text-berry-800">{fmt(r.product.price * r.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(r.productId)} className="self-start text-slate-300 transition hover:text-red-500" aria-label="Убрать"><X size={15} /></button>
                </div>
              ))}
            </div>
            <div className="border-t border-berry-100 bg-paper/70 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Товары</span><span className="font-mono font-semibold text-berry-900">{fmt(subtotal)}</span></div>
              <p className="mt-1 text-[11.5px] text-slate-400">Доставка и промокоды — на шаге оформленія</p>
              <button onClick={() => { setCartOpen(false); nav("/checkout"); }} className="mt-3 w-full rounded-md bg-berry-500 py-3 text-[15px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:-translate-y-0.5 hover:bg-berry-600 active:translate-y-0">
                Оформить заказъ · {fmt(subtotal)}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ================= AUTH MODAL ================= */
export function AuthModal() {
  const { authOpen, setAuthOpen, login } = useStore();
  const [tab, setTab] = useState<"login" | "register" | "magic">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roles, setRoles] = useState<Role[]>(["CUSTOMER"]);
  const [sent, setSent] = useState(false);

  const toggleRole = (r: Role) =>
    setRoles((p) => (p.includes(r) ? (p.length > 1 ? p.filter((x) => x !== r) : p) : [...p, r]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "magic") { setSent(true); return; }
    if (!email.includes("@")) return;
    login(email, name || undefined, tab === "register" ? roles : ["CUSTOMER"]);
    setEmail(""); setName(""); setRoles(["CUSTOMER"]); setSent(false);
  };

  return (
    <Modal open={authOpen} onClose={() => setAuthOpen(false)}>
      <div className="p-7">
        <p className="font-hand text-xl text-berry-500">рады видѣть васъ!</p>
        <h3 className="mt-0.5 font-display text-2xl font-bold italic text-berry-900">Входъ въ лавку</h3>

        <div className="mt-5 grid grid-cols-3 rounded-lg bg-berry-50 p-1 text-[13px] font-semibold">
          {([["login", "Входъ"], ["register", "Регистрація"], ["magic", "Ссылка"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setSent(false); }}
              className={`rounded-md py-2 transition ${tab === id ? "bg-white text-berry-700 shadow" : "text-slate-500 hover:text-berry-600"}`}>{label}</button>
          ))}
        </div>

        {tab === "magic" && sent ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5 text-center">
            <p className="font-display text-lg font-bold italic text-green-800">Письмо отправлено!</p>
            <p className="mt-1 text-sm text-green-700">Проверьте почту {email} — внутри волшебная ссылка для входа.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3.5">
            {tab === "register" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Какъ къ вамъ обращаться?" required
                className="w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@conditera.ru" required
              className="w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
            {tab !== "magic" && (
              <input type="password" placeholder="Пароль (демо: любой)" required minLength={4}
                className="w-full rounded-md border border-berry-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-berry-300 focus:ring-2 focus:ring-berry-100" />
            )}
            {tab === "register" && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">Я хочу… (можно несколько ролей)</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["CUSTOMER", "CONFECTIONER", "COURIER", "SUPPLIER"] as Role[]).map((r) => (
                    <button type="button" key={r} onClick={() => toggleRole(r)}
                      className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${roles.includes(r) ? "border-berry-500 bg-berry-500 text-white shadow" : "border-berry-100 text-slate-500 hover:border-berry-300"}`}>
                      {ROLE_LABEL[r]}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11.5px] text-slate-400">+500 приветственныхъ бонусовъ каждому новому гостю</p>
              </div>
            )}
            <button type="submit" className="w-full rounded-md bg-berry-500 py-3 text-[15px] font-semibold text-white shadow-lg shadow-berry-500/25 transition hover:-translate-y-0.5 hover:bg-berry-600 active:translate-y-0">
              {tab === "magic" ? "Прислать ссылку" : tab === "register" ? "Создать аккаунтъ" : "Войти"}
            </button>
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="h-px flex-1 bg-berry-100" /><span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">или</span><span className="h-px flex-1 bg-berry-100" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Google", "Яндексъ", "VK"].map((p) => (
                <button key={p} type="button" onClick={() => login("demo@" + p.toLowerCase() + ".ru", "Гость " + p)}
                  className="rounded-md border border-berry-100 py-2.5 text-[13px] font-medium text-slate-600 transition hover:border-berry-300 hover:bg-berry-50">
                  {p}
                </button>
              ))}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

/* ================= FOOTER ================= */
export function Footer() {
  const { pushToast } = useStore();
  return (
    <footer className="relative overflow-hidden bg-berry-950 text-berry-100">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="rule-double !border-berry-700/60" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl font-bold italic text-white">Уездный кондитер</p>
          <p className="mt-1 font-hand text-lg text-berry-300">сладкая ярмарка всей Россіи</p>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-berry-100/70">
            Маркетплейсъ домашнихъ кондитеровъ: торты на заказъ, эскроу-оплата, доставка день-в-день и мастер-классы отъ лучшихъ мастеровъ уѣзда.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a href="#/telegram" className="flex items-center gap-2 rounded-md bg-berry-800/80 px-3.5 py-2 text-[13px] font-medium transition hover:bg-berry-700"><Send size={14} /> @conditera</a>
            <span className="font-mono text-[11px] text-berry-300">12 480 читателей</span>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">Витрина</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {[["/catalog", "Весь каталогъ"], ["/builder", "Конструкторъ торта"], ["/confectioners", "Наши кондитеры"], ["/recipes", "Рецепты"], ["/promotions", "Акціи и промокоды"], ["/gifts", "Подарочные сертификаты"]].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-berry-100/75 transition hover:text-white hover:underline">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">Покупателямъ</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {[["/faq", "Вопросы и отвѣты"], ["/about", "О лавкѣ"], ["/about?legal=escrow", "Какъ работаетъ эскроу"], ["/contacts", "Контакты"], ["/dashboard", "Личный кабинетъ"], ["/telegram", "Telegram-ботъ"]].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-berry-100/75 transition hover:text-white hover:underline">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold">Кондитерамъ</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px] text-berry-100/75">
            <li>Тарифы: отъ 0 ₽, комиссія 5–15%</li>
            <li>Выплаты отъ 5 000 ₽ на карту или СБП</li>
            <li>Сертификація и инспекція качества</li>
          </ul>
          <form className="mt-5" onSubmit={(e) => { e.preventDefault(); pushToast({ title: "Вы подписаны на.digest!", desc: "Разъ въ недѣлю — лучшіе торты уѣзда", kind: "success" }); (e.target as HTMLFormElement).reset(); }}>
            <p className="text-[12px] text-berry-100/60">Сладкая почта — разъ въ недѣлю</p>
            <div className="mt-2 flex gap-2">
              <input type="email" required placeholder="ваша@почта.ру" className="min-w-0 flex-1 rounded-md border border-berry-700 bg-berry-900/70 px-3 py-2 text-[13px] text-white outline-none placeholder:text-berry-300/50 focus:border-gold" />
              <button className="rounded-md bg-gold px-3.5 py-2 text-[13px] font-bold text-berry-950 transition hover:brightness-110">Ок</button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative border-t border-berry-800/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11.5px] text-berry-300/80">
          <p>© 2016–2026 «Уездный кондитер» · conditera.ru · сделано съ любовью и сахарной пудрой</p>
          <p className="font-mono">Оплата: YooKassa · СБП · бонусы (1 бонусъ = 1 ₽)</p>
        </div>
      </div>
    </footer>
  );
}
