import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BASE_PROMOS, ORDER_STATUSES, STATUS_LABEL } from "./data";
import type { OrderStatus, Role } from "./data";

/* ---------------- types ---------------- */
export interface User { id: string; name: string; email: string; roles: Role[]; activeRole: Role; bonusBalance: number; loyalty: string; referralCode: string; since: string }
export interface CartItem { productId: string; qty: number; weight?: string }
export interface OrderItem { productId: string; title: string; price: number; qty: number; image: string }
export interface Order {
  id: string; number: string; createdAt: string; items: OrderItem[];
  subtotal: number; discount: number; deliveryCost: number; total: number;
  status: OrderStatus; paymentMethod: string; confectionerId: string;
  promoCode?: string; bonusUsed?: number; escrow: boolean; address: string; deliveryDate: string;
}
export interface Inquiry {
  id: string; number: string; createdAt: string; summary: string; price: number;
  status: "sent" | "negotiating" | "accepted"; confectioners: string[]; event: string;
}
export interface Certificate { id: string; code: string; amount: number; status: "purchased" | "activated" | "used"; purchasedAt: string }
export interface Payout { id: string; amount: number; status: "pending" | "approved" | "paid"; createdAt: string; method: string }
export interface Toast { id: number; title: string; desc?: string; kind: "success" | "info" | "error" }
export interface ModerationItem { id: string; type: string; title: string; author: string; status: "pending" | "approved" | "rejected" }
export interface PromoCode { code: string; type: "percent" | "fixed" | "free_delivery"; value: number; minOrder: number; note: string }
export interface BonusTx { id: string; type: string; amount: number; date: string; note: string }

interface StoreShape {
  user: User | null;
  login: (email: string, name?: string, roles?: Role[]) => void;
  logout: () => void;
  switchRole: (r: Role) => void;
  cart: CartItem[]; addToCart: (productId: string, qty?: number, weight?: string) => void;
  setQty: (productId: string, qty: number) => void; removeFromCart: (productId: string) => void; clearCart: () => void;
  cartCount: number; cartOpen: boolean; setCartOpen: (v: boolean) => void;
  authOpen: boolean; setAuthOpen: (v: boolean) => void;
  favorites: string[]; toggleFav: (id: string) => void;
  orders: Order[]; placeOrder: (o: Omit<Order, "id" | "number" | "createdAt" | "status">) => Order;
  inquiries: Inquiry[]; addInquiry: (i: Omit<Inquiry, "id" | "number" | "createdAt" | "status">) => void;
  acceptInquiry: (id: string) => void;
  certificates: Certificate[]; buyCertificate: (amount: number) => void;
  promos: PromoCode[]; addPromo: (p: PromoCode) => void;
  payouts: Payout[]; requestPayout: (amount: number, method: string) => void;
  bonusTxs: BonusTx[]; spendBonus: (amount: number) => void;
  moderation: ModerationItem[]; moderate: (id: string, verdict: "approved" | "rejected") => void;
  toasts: Toast[]; pushToast: (t: Omit<Toast, "id">) => void; dismissToast: (id: number) => void;
  search: string; setSearch: (s: string) => void;
}

const StoreCtx = createContext<StoreShape | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem("uk-" + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

const SEED_MODERATION: ModerationItem[] = [
  { id: "m1", type: "Товар", title: "Торт «Радуга» с красителем E129", author: "Пекарня «Каравай»", status: "pending" },
  { id: "m2", type: "Отзыв", title: "«Привезли помятым…» — требует проверки", author: "гость_4721", status: "pending" },
  { id: "m3", type: "Фото профиля", title: "Логотип с чужим товарным знаком", author: "Кондитер «Сласть»", status: "pending" },
  { id: "m4", type: "Рецепт", title: "Настойка на коньяке в детском рецепте", author: "user_88", status: "pending" },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load("user", null));
  const [cart, setCart] = useState<CartItem[]>(() => load("cart", []));
  const [favorites, setFavorites] = useState<string[]>(() => load("favs", []));
  const [orders, setOrders] = useState<Order[]>(() => load("orders", []));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => load("inquiries", []));
  const [certificates, setCertificates] = useState<Certificate[]>(() => load("certs", []));
  const [payouts, setPayouts] = useState<Payout[]>(() => load("payouts", []));
  const [bonusTxs, setBonusTxs] = useState<BonusTx[]>(() => load("bonusTxs", []));
  const [customPromos, setCustomPromos] = useState<PromoCode[]>(() => load("promos", []));
  const [moderation, setModeration] = useState<ModerationItem[]>(() => load("moderation", SEED_MODERATION));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [search, setSearch] = useState("");
  const toastId = useRef(0);

  useEffect(() => { localStorage.setItem("uk-user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("uk-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("uk-favs", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("uk-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("uk-inquiries", JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem("uk-certs", JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem("uk-payouts", JSON.stringify(payouts)); }, [payouts]);
  useEffect(() => { localStorage.setItem("uk-bonusTxs", JSON.stringify(bonusTxs)); }, [bonusTxs]);
  useEffect(() => { localStorage.setItem("uk-promos", JSON.stringify(customPromos)); }, [customPromos]);
  useEffect(() => { localStorage.setItem("uk-moderation", JSON.stringify(moderation)); }, [moderation]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((p) => [...p.slice(-3), { ...t, id }]);
    window.setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4600);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

  const addBonusTx = useCallback((type: string, amount: number, note: string) => {
    setBonusTxs((p) => [{ id: uid(), type, amount, date: now(), note }, ...p]);
  }, []);

  const login = useCallback((email: string, name?: string, roles?: Role[]) => {
    const niceName = name || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const welcome = !load("user", null);
    const u: User = {
      id: uid(), name: niceName, email,
      roles: roles && roles.length ? roles : ["CUSTOMER"],
      activeRole: roles && roles.length ? roles[0] : "CUSTOMER",
      bonusBalance: welcome ? 500 : load<number>("lastBalance", 500),
      loyalty: "BRONZE", referralCode: "CONDIT-" + uid().toUpperCase().slice(0, 5), since: now(),
    };
    setUser(u); setAuthOpen(false);
    pushToast({ title: "Добро пожаловать, " + niceName + "!", desc: welcome ? "Начислено 500 приветственных бонусов" : undefined, kind: "success" });
    if (welcome) addBonusTx("BONUS_WELCOME", 500, "Приветственные бонусы за регистрацию");
  }, [pushToast, addBonusTx]);

  const logout = useCallback(() => { setUser(null); pushToast({ title: "Вы вышли изъ аккаунта", kind: "info" }); }, [pushToast]);
  const switchRole = useCallback((r: Role) => {
    setUser((u) => {
      if (!u) return u;
      const roles = u.roles.includes(r) ? u.roles : [...u.roles, r];
      return { ...u, roles, activeRole: r };
    });
    pushToast({ title: "Роль переключена", kind: "info" });
  }, [pushToast]);

  const addToCart = useCallback((productId: string, qty = 1, weight?: string) => {
    setCart((p) => {
      const ex = p.find((i) => i.productId === productId);
      if (ex) return p.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      return [...p, { productId, qty, weight }];
    });
    pushToast({ title: "Добавлено въ корзину", kind: "success" });
  }, [pushToast]);
  const setQty = useCallback((productId: string, qty: number) => {
    setCart((p) => (qty <= 0 ? p.filter((i) => i.productId !== productId) : p.map((i) => (i.productId === productId ? { ...i, qty } : i))));
  }, []);
  const removeFromCart = useCallback((productId: string) => setCart((p) => p.filter((i) => i.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleFav = useCallback((id: string) => {
    setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }, []);

  const placeOrder = useCallback((o: Omit<Order, "id" | "number" | "createdAt" | "status">) => {
    const order: Order = { ...o, id: uid(), number: "УК-" + String(Math.floor(10000 + Math.random() * 89999)), createdAt: now(), status: "PENDING" };
    setOrders((p) => [order, ...p]);
    const earned = Math.round(order.total * 0.05);
    setUser((u) => (u ? { ...u, bonusBalance: u.bonusBalance + earned - (o.bonusUsed || 0) } : u));
    if (earned) addBonusTx("EARN", earned, `Кэшбэкъ 5% за заказъ ${order.number}`);
    if (o.bonusUsed) addBonusTx("REDEEM", -o.bonusUsed, `Оплата бонусами заказа ${order.number}`);
    localStorage.setItem("uk-lastBalance", String(500));
    return order;
  }, [addBonusTx]);

  const addInquiry = useCallback((i: Omit<Inquiry, "id" | "number" | "createdAt" | "status">) => {
    const inq: Inquiry = { ...i, id: uid(), number: "ЗАП-" + String(Math.floor(1000 + Math.random() * 8999)), createdAt: now(), status: "sent" };
    setInquiries((p) => [inq, ...p]);
  }, []);
  const acceptInquiry = useCallback((id: string) => {
    setInquiries((p) => p.map((i) => (i.id === id ? { ...i, status: "accepted" } : i)));
  }, []);

  const buyCertificate = useCallback((amount: number) => {
    const cert: Certificate = { id: uid(), code: "CONDIT-" + uid().toUpperCase().slice(0, 4) + "-" + uid().toUpperCase().slice(0, 4), amount, status: "purchased", purchasedAt: now() };
    setCertificates((p) => [cert, ...p]);
    pushToast({ title: "Сертификатъ купленъ", desc: `Кодъ ${cert.code} — отправленъ на email`, kind: "success" });
  }, [pushToast]);

  const addPromo = useCallback((p: PromoCode) => {
    setCustomPromos((prev) => [p, ...prev]);
    pushToast({ title: `Промокодъ ${p.code} созданъ`, kind: "success" });
  }, [pushToast]);

  const requestPayout = useCallback((amount: number, method: string) => {
    setPayouts((p) => [{ id: uid(), amount, status: "pending", createdAt: now(), method }, ...p]);
    pushToast({ title: "Заявка на выплату создана", desc: "Минимальная сумма — 5 000 ₽, обработка до 3 дней", kind: "success" });
  }, [pushToast]);

  const spendBonus = useCallback((amount: number) => {
    setUser((u) => (u ? { ...u, bonusBalance: Math.max(0, u.bonusBalance - amount) } : u));
  }, []);

  const moderate = useCallback((id: string, verdict: "approved" | "rejected") => {
    setModeration((p) => p.map((m) => (m.id === id ? { ...m, status: verdict } : m)));
    pushToast({ title: verdict === "approved" ? "Одобрено модераторомъ" : "Отклонено", kind: verdict === "approved" ? "success" : "error" });
  }, [pushToast]);

  /* живой потокъ: статусы заказовъ продвигаются сами */
  const pushToastRef = useRef(pushToast);
  pushToastRef.current = pushToast;
  useEffect(() => {
    const t = window.setInterval(() => {
      setOrders((prev) => {
        const idx = prev.findIndex((o) => ORDER_STATUSES.indexOf(o.status) < 5);
        if (idx === -1) return prev;
        const next = [...prev];
        const cur = next[idx];
        const ni = ORDER_STATUSES.indexOf(cur.status) + 1;
        const ns = ORDER_STATUSES[ni];
        next[idx] = { ...cur, status: ns };
        if (ns === "DELIVERED") {
          window.setTimeout(() => pushToastRef.current({ title: `Заказъ ${cur.number} доставленъ`, desc: "Эскроу-платёжъ будетъ отпущенъ кондитеру черезъ 7 дней", kind: "success" }), 50);
        } else if (ni === 2) {
          window.setTimeout(() => pushToastRef.current({ title: `Заказъ ${cur.number}: ${STATUS_LABEL[ns]}`, desc: "Кондитеръ принялъ заказъ въ работу", kind: "info" }), 50);
        }
        return next;
      });
    }, 9000);
    return () => window.clearInterval(t);
  }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const promos = useMemo(() => [...customPromos, ...BASE_PROMOS], [customPromos]);

  const value: StoreShape = {
    user, login, logout, switchRole, cart, addToCart, setQty, removeFromCart, clearCart,
    cartCount, cartOpen, setCartOpen, authOpen, setAuthOpen, favorites, toggleFav,
    orders, placeOrder, inquiries, addInquiry, acceptInquiry, certificates, buyCertificate,
    promos, addPromo, payouts, requestPayout, bonusTxs, spendBonus, moderation, moderate,
    toasts, pushToast, dismissToast, search, setSearch,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
