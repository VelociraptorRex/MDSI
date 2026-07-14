import { lazy, Suspense, useEffect, useState } from "react";
import { Layout } from "./components/Layout";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const GrammarPage = lazy(() => import("./pages/GrammarPage").then((module) => ({ default: module.GrammarPage })));
const LexiconPage = lazy(() => import("./pages/LexiconPage").then((module) => ({ default: module.LexiconPage })));
const PatternsPage = lazy(() => import("./pages/PatternsPage").then((module) => ({ default: module.PatternsPage })));
const DialoguesPage = lazy(() => import("./pages/DialoguesPage").then((module) => ({ default: module.DialoguesPage })));
const PracticePage = lazy(() => import("./pages/PracticePage").then((module) => ({ default: module.PracticePage })));
const AnkiPage = lazy(() => import("./pages/AnkiPage").then((module) => ({ default: module.AnkiPage })));
const SourcesPage = lazy(() => import("./pages/SourcesPage").then((module) => ({ default: module.SourcesPage })));

const pages = {
  home: HomePage,
  grammar: GrammarPage,
  lexicon: LexiconPage,
  patterns: PatternsPage,
  dialogues: DialoguesPage,
  tests: PracticePage,
  anki: AnkiPage,
  sources: SourcesPage
};

export default function App({ page }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const Page = pages[page] || HomePage;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mdsi-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#10131b" : "#f7f8fc");
  }, [theme]);

  return (
    <Layout page={page} searchOpen={searchOpen} setSearchOpen={setSearchOpen} theme={theme} setTheme={setTheme}>
      <Suspense fallback={<div className="page-loading"><span /></div>}>
        <Page onOpenSearch={() => setSearchOpen(true)} />
      </Suspense>
    </Layout>
  );
}
