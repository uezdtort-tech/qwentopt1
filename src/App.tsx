import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { Header, Footer, CartDrawer, AuthModal } from "./components/layout";
import { ToastHost } from "./components/ui";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductPage from "./pages/Product";
import Builder from "./pages/Builder";
import Confectioners from "./pages/Confectioners";
import Recipes from "./pages/Recipes";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import { About, Contacts, Faq, Gifts, Promotions, TelegramPage } from "./pages/Static";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-white">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/confectioners" element={<Confectioners />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/telegram" element={<TelegramPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <CartDrawer />
        <AuthModal />
        <ToastHost />
      </HashRouter>
    </StoreProvider>
  );
}
