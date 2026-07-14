import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Braces, CheckCircle2, ChevronDown, Filter, Link2, Search, Shapes, Waypoints } from "lucide-react";
import { PageToc } from "../components/PageToc";
import { patternCategories, patterns } from "../data/patterns";
import { sitePath } from "../utils/sitePath";

const toc = [
  { id: "pattern-intro", label: "Как читать паттерн" },
  { id: "pattern-library", label: "Библиотека паттернов" },
  ...patternCategories.map((item) => ({ id: item.id, label: item.label }))
];

function PatternCard({ pattern, index }) {
  const [open, setOpen] = useState(index < 2 || window.location.hash === `#${pattern.id}`);
  return (
    <article className={`full-pattern-card ${open ? "open" : ""}`} id={pattern.id}>
      <button className="pattern-card-summary" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="pattern-card-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="pattern-card-main"><small>{pattern.function}</small><strong lang="es">{pattern.template}</strong><em>{pattern.translation}</em></span>
        <ChevronDown size={19} />
      </button>
      {open && <div className="pattern-card-content">
        <div className="pattern-meta-grid">
          <div><span><Braces size={14} /> Допустимые заполнители</span><p>{pattern.slots.join(" · ")}</p></div>
          <div><span><Link2 size={14} /> Связанная грамматика</span><p>{pattern.grammar.join(" · ")}</p></div>
        </div>
        <div className="pattern-example-list">
          {pattern.examples.map(([es, ru]) => <div key={es}><span className="flag-dot">ES</span><p lang="es">{es}</p><span>{ru}</span></div>)}
        </div>
        <div className="pattern-comment"><CheckCircle2 size={15} /><span>{pattern.note}</span></div>
      </div>}
    </article>
  );
}

export function PatternsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  useEffect(()=>{const id=decodeURIComponent(window.location.hash.slice(1));if(!id)return;window.requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:"center"}))},[]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patterns.filter((item) => (category === "all" || item.category === category) && (!q || [item.template,item.translation,item.function,...item.examples.flat()].join(" ").toLowerCase().includes(q)));
  }, [query, category]);

  return <div className="reference-page patterns-page">
    <section className="page-hero patterns-hero compact-hero"><div className="container"><div className="breadcrumbs"><a href={sitePath("/es-419/")}>Главная</a><span>/</span><span>Паттерны</span></div><div className="reference-hero-grid"><div><div className="eyebrow"><span>Речевые модели</span> функциональное ядро</div><h1><span className="pattern-blue-title">Один каркас</span> —<br />десятки фраз.</h1><p>Паттерны занимают промежуточное положение между лексикой и грамматикой: меняешь слот — сразу получаешь новую фразу.</p></div><div className="hero-index-card pattern-index-card"><div><Shapes size={18} /><span>Активная библиотека</span></div><strong>{patterns.length}</strong><p>базовых моделей по семи коммуникативным функциям</p></div></div></div></section>
    <div className="container reference-layout"><article className="reference-content">
      <section id="pattern-intro" className="grammar-section pattern-intro"><div className="section-kicker">Как пользоваться</div><div className="pattern-anatomy"><span className="fixed-token" lang="es">Quiero</span><span className="slot-token" lang="es">{`{infinitivo}`}</span><ArrowRight /><span className="result-token" lang="es">Quiero viajar.</span></div><div className="pattern-principles"><div><strong>Фиксированная часть</strong><p>Запоминается как готовый речевой блок.</p></div><div><strong>Слот</strong><p>Заполняется словом нужной части речи и формы.</p></div><div><strong>Ограничение</strong><p>Показывает, что можно подставить без искусственной фразы.</p></div></div></section>
      <section id="pattern-library" className="pattern-library-section"><div className="section-kicker">Библиотека</div><h2>Базовые коммуникативные функции</h2><div className="pattern-toolbar"><label><Search size={17} /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Найти паттерн или пример…" /><span>{visible.length}</span></label><div className="category-filter"><Filter size={15} /><select value={category} onChange={(e)=>setCategory(e.target.value)}><option value="all">Все функции</option>{patternCategories.map((item)=><option key={item.id} value={item.id}>{item.label}</option>)}</select></div></div>
        {patternCategories.map((group) => { const items = visible.filter((item)=>item.category===group.id); if(!items.length) return null; return <section className="pattern-category" id={group.id} key={group.id}><div className="pattern-category-head"><div><Waypoints size={17} /><h3>{group.label}</h3></div><span>{items.length}</span></div><div className="full-pattern-list">{items.map((pattern,index)=><PatternCard pattern={pattern} index={patterns.indexOf(pattern)} key={pattern.id}/>)}</div></section>; })}
        {!visible.length && <div className="no-results"><Search/><h3>Паттерн не найден</h3><p>Попробуйте функцию, испанскую форму или русский перевод.</p></div>}
      </section>
    </article><PageToc items={toc}/></div>
  </div>;
}
