import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookA, BrainCircuit, Command, FileText, MessageCircle, Search, Shapes, X } from "lucide-react";
import lexicon from "../data/lexicon.json";
import { patterns } from "../data/patterns";
import { dialogues } from "../data/dialogues";

const sections = [
  { label: "Грамматика: настоящее время", href: "/es-419/grammar/#present", icon: FileText },
  { label: "Грамматика: вопросы", href: "/es-419/grammar/#questions", icon: FileText },
  { label: "Паттерны желания и намерения", href: "/es-419/patterns/", icon: Shapes },
  { label: "Карточки Anki, Quizlet и Полиглот", href: "/es-419/anki/", icon: BrainCircuit }
];

export function SearchDialog({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open ? onClose() : document.querySelector(".search-trigger")?.click();
      }
      if (event.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return lexicon.slice(0, 5).map((item) => ({...item, kind:"lexicon", title:item.lemma, meta:`${item.translation} · ${item.type}`, href:`/es-419/lexicon/?q=${encodeURIComponent(item.lemma)}&open=${item.id}`}));
    const lexical = lexicon.filter((item) => [item.lemma, item.translation, item.forms, item.example].join(" ").toLowerCase().includes(normalized)).map((item)=>({...item,kind:"lexicon",title:item.lemma,meta:`${item.translation} · ${item.type}`,href:`/es-419/lexicon/?q=${encodeURIComponent(item.lemma)}&open=${item.id}`}));
    const patternResults = patterns.filter((item)=>[item.template,item.translation,item.function,...item.examples.flat()].join(" ").toLowerCase().includes(normalized)).map((item)=>({id:item.id,kind:"pattern",title:item.template,meta:`Паттерн · ${item.function}`,href:`/es-419/patterns/#${item.category}`}));
    const dialogueResults = dialogues.filter((item)=>[item.title,item.situation,...item.lines.flat()].join(" ").toLowerCase().includes(normalized)).map((item)=>({id:item.id,kind:"dialogue",title:item.title,meta:`Диалог · ${item.situation}`,href:`/es-419/dialogues/#${item.id}`}));
    return [...lexical,...patternResults,...dialogueResults].slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Глобальный поиск">
        <div className="search-field">
          <Search size={21} />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Слово, перевод, форма или правило…" />
          <button onClick={onClose} aria-label="Закрыть поиск"><X size={18} /></button>
        </div>
        <div className="search-results">
          <div className="search-group-label">{query ? `Результаты · ${results.length}` : "Популярное сейчас"}</div>
          {results.map((item) => {
            const Icon = item.kind === "pattern" ? Shapes : item.kind === "dialogue" ? MessageCircle : BookA;
            return (
            <a className="search-result" href={item.href} key={`${item.kind}-${item.id}`}>
              <span className="result-icon"><Icon size={17} /></span>
              <span><strong lang={item.kind === "lexicon" || item.kind === "pattern" ? "es" : undefined}>{item.title}</strong><small>{item.meta}</small></span>
              <ArrowRight size={16} />
            </a>
          )})}
          {!results.length && <div className="empty-search">Ничего не найдено. Попробуйте начальную форму или русский перевод.</div>}
          {!query && <>
            <div className="search-group-label secondary">Разделы</div>
            {sections.map(({ label, href, icon: Icon }) => (
              <a className="search-result compact" href={href} key={href}><span className="result-icon"><Icon size={17} /></span><span><strong>{label}</strong></span><ArrowRight size={16} /></a>
            ))}
          </>}
        </div>
        <div className="search-footer"><span><Command size={14} /> Глобальный поиск по формам и примерам</span><span><kbd>esc</kbd> закрыть</span></div>
      </section>
    </div>
  );
}
