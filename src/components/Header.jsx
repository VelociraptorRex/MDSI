import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, Menu, Moon, Search, Sun, X } from "lucide-react";

const nav = [
  { id: "home", label: "Главная", href: "/es-419/" },
  { id: "lexicon", label: "Лексика", href: "/es-419/lexicon/" },
  { id: "grammar", label: "Грамматика", href: "/es-419/grammar/" },
  { id: "patterns", label: "Паттерны", href: "/es-419/patterns/" },
  { id: "dialogues", label: "Диалоги", href: "/es-419/dialogues/" },
  { id: "tests", label: "Практика", href: "/es-419/tests/" },
  { id: "anki", label: "Карточки", href: "/es-419/anki/" }
];

export function Header({ page, onSearch, theme, onTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [page]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/es-419/" aria-label="MDSI — на главную">
          <span className="brand-mark"><BookOpen size={19} strokeWidth={2.2} /></span>
          <span><strong>MDSI</strong><small>español esencial</small></span>
        </a>

        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Главная навигация">
          {nav.map((item) => (
            <a key={item.id} href={item.href} className={page === item.id ? "active" : ""} aria-current={page === item.id ? "page" : undefined}>
              {item.label}
            </a>
          ))}
          <a href="/es-419/sources/" className={`nav-more ${page === "sources" ? "active" : ""}`}>Методика <ChevronDown size={14} /></a>
        </nav>

        <div className="header-actions">
          <button className="theme-trigger" onClick={onTheme} aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"} title={theme === "light" ? "Тёмная тема" : "Светлая тема"}>
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="search-trigger" onClick={onSearch} aria-label="Открыть глобальный поиск">
            <Search size={17} /> <span>Поиск</span><kbd>⌘ K</kbd>
          </button>
          <span className="language-chip" aria-label="Языковой пакет">ES·419</span>
          <button className="menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
