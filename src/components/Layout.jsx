import { lazy, Suspense } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

const SearchDialog = lazy(() => import("./SearchDialog").then((module) => ({ default: module.SearchDialog })));

export function Layout({ page, searchOpen, setSearchOpen, theme, setTheme, children }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">Перейти к содержанию</a>
      <Header page={page} onSearch={() => setSearchOpen(true)} theme={theme} onTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      <main id="content">{children}</main>
      <Footer />
      {searchOpen && <Suspense fallback={null}><SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} /></Suspense>}
    </div>
  );
}
