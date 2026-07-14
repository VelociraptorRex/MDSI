import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownAZ, BookA, ChevronDown, Filter, Info, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import lexicon from "../data/lexicon.json";
import { PageToc } from "../components/PageToc";
import { LexiconPopover } from "../components/LexiconPopover";
import { sitePath } from "../utils/sitePath";

const toc = [
  { id: "lexicon-controls", label: "Поиск и фильтры" },
  { id: "lexicon-list", label: "Список 500" },
  { id: "lexicon-model", label: "Модель статьи" }
];

const groups = [
  { id: "all", label: "Все типы" },
  { id: "verb", label: "Глаголы", match: "глагол" },
  { id: "noun", label: "Существительные", match: "существительное" },
  { id: "function", label: "Служебные", match: "предлог|союз|артикль|местоимение" },
  { id: "pattern", label: "Паттерны", match: "конструкция|паттерн|сочетание|формула" }
];

function matchGroup(item, group) {
  if (!group.match) return true;
  return new RegExp(group.match, "i").test(item.type);
}

function popoverPosition(item,element=null){const verb=item.type.toLowerCase().includes("глагол");const width=Math.min(verb?860:430,window.innerWidth-32);const height=Math.min(verb?760:590,window.innerHeight-32);if(!element)return{left:Math.max(16,(window.innerWidth-width)/2),top:Math.max(16,(window.innerHeight-height)/2)};const rect=element.getBoundingClientRect();let left=rect.right+14;if(left+width>window.innerWidth-16)left=rect.left-width-14;if(left<16)left=Math.max(16,(window.innerWidth-width)/2);const top=Math.min(Math.max(16,rect.top-40),Math.max(16,window.innerHeight-height-16));return{left,top}}

export function LexiconPage() {
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("q") || "";
  const initialItem = lexicon.find((item)=>item.id===params.get("open"))||null;
  const [query, setQuery] = useState(initial);
  const [group, setGroup] = useState("all");
  const [sort, setSort] = useState("rank");
  const [activeItem, setActiveItem] = useState(initialItem);
  const [position, setPosition] = useState(()=>initialItem?popoverPosition(initialItem):null);
  const [pinned, setPinned] = useState(Boolean(initialItem));
  const hideTimer = useRef(null);

  const filtered = useMemo(() => {
    const currentGroup = groups.find((item) => item.id === group);
    const normalized = query.trim().toLowerCase();
    const result = lexicon.filter((item) => matchGroup(item, currentGroup) && (!normalized || [item.lemma, item.translation, item.forms, item.example, item.tag].join(" ").toLowerCase().includes(normalized)));
    return [...result].sort((a, b) => sort === "alpha" ? a.lemma.localeCompare(b.lemma, "es") : a.rank - b.rank);
  }, [query, group, sort]);

  useEffect(()=>{const closeOnEscape=(event)=>{if(event.key==="Escape"&&!pinned)setActiveItem(null)};const closeOnEmptyClick=(event)=>{if(!pinned||event.target.closest(".lexicon-popover,.lexicon-row,button,a,input,select,label"))return;clearTimeout(hideTimer.current);setActiveItem(null);setPinned(false)};window.addEventListener("keydown",closeOnEscape);document.addEventListener("pointerdown",closeOnEmptyClick);return()=>{window.removeEventListener("keydown",closeOnEscape);document.removeEventListener("pointerdown",closeOnEmptyClick)}},[pinned]);

  const show = (item, element, pin=false) => {
    if(pinned&&!pin)return;
    clearTimeout(hideTimer.current);
    setPosition(popoverPosition(item,element));
    setActiveItem(item);
    if(pin)setPinned(true);
  };

  const scheduleHide = () => {if(pinned)return;hideTimer.current=setTimeout(()=>setActiveItem(null),180)};
  const closeCard=()=>{clearTimeout(hideTimer.current);setActiveItem(null);setPinned(false)};
  const changeGroup=(value)=>{clearTimeout(hideTimer.current);setActiveItem(null);setPinned(false);setGroup(value)};

  return (
    <div className="reference-page lexicon-page">
      <section className="page-hero lexicon-hero compact-hero">
        <div className="container">
          <div className="breadcrumbs"><a href={sitePath("/es-419/")}>Главная</a><span>/</span><span>Лексика</span></div>
          <div className="reference-hero-grid">
            <div><div className="eyebrow"><span>Ядро 500</span> данные v0.1</div><h1>Слова, из которых<br /><em>собирается речь.</em></h1><p>Частотные леммы, служебные конструкции и речевые паттерны — с формами и естественными примерами.</p></div>
            <div className="hero-index-card lexical"><div><BookA size={18} /><span>Лексическое ядро</span></div><strong>500</strong><p>единиц нейтрального латиноамериканского испанского</p></div>
          </div>
          <div className="hover-hint"><Sparkles size={16} /><span>Наведи курсор для просмотра; нажми на строку, чтобы закрепить карточку.</span></div>
        </div>
      </section>

      <div className="container reference-layout lexicon-layout">
        <article className="reference-content wide-content">
          <section id="lexicon-controls" className="lexicon-toolbar-section">
            <div className="lexicon-toolbar">
              <label className="lexicon-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Искать: querer, хотеть, quiero…" /><span>{filtered.length}</span></label>
              <label className="select-control"><Filter size={16} /><select value={group} onChange={(e) => changeGroup(e.target.value)}>{groups.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select><ChevronDown size={14} /></label>
              <button className="sort-control" onClick={() => setSort(sort === "rank" ? "alpha" : "rank")}><ArrowDownAZ size={17} />{sort === "rank" ? "По ядру" : "А–Я"}</button>
            </div>
            <div className="active-filter-line"><SlidersHorizontal size={14} /><span>Показано {filtered.length} из {lexicon.length}</span><span className="dot-separator" /> <span>Источник: лексическое ядро v0.1</span></div>
          </section>

          <section id="lexicon-list" className="lexicon-list-section">
            <div className="lexicon-table-head"><span>№</span><span>Единица</span><span>Тип</span><span>Основное значение</span><span>Пример</span></div>
            <div className="lexicon-table" role="list">
              {filtered.map((item) => (
                <button className={`lexicon-row ${activeItem?.id === item.id ? "active" : ""}`} data-lexicon-id={item.id} key={item.id} role="listitem" onMouseEnter={(e)=>show(item,e.currentTarget)} onMouseLeave={scheduleHide} onFocus={(e)=>show(item,e.currentTarget)} onClick={(e)=>{e.stopPropagation();show(item,e.currentTarget,true)}}>
                  <span className="lex-rank">{String(item.rank).padStart(3, "0")}</span>
                  <span className="lex-lemma" lang="es">{item.lemma}</span>
                  <span className="lex-type">{item.type}</span>
                  <span className="lex-translation">{item.translation}</span>
                  <span className="lex-example"><em lang="es">{item.example}</em><small>{item.exampleRu}</small></span>
                </button>
              ))}
              {!filtered.length && <div className="no-results"><Search /><h3>Совпадений нет</h3><p>Попробуйте начальную форму, часть русского перевода или другой фильтр.</p></div>}
            </div>
          </section>

          <section id="lexicon-model" className="grammar-section model-section">
            <div className="section-kicker">Масштабируемая модель</div><h2>Одна статья — много представлений</h2><p className="section-intro">Эта же запись используется в списке, поиске, практике и готовых карточках — без ручного копирования содержания.</p>
            <div className="model-flow"><span>Источник данных</span><i>→</i><span>Статья</span><i>→</i><span>Практика</span><i>→</i><span>Карточки</span></div>
            <div className="grammar-note tone-gray"><Info size={16} /><span>Карточки связываются с 32 речевыми паттернами через общую модель данных. Раздел связей показывается только там, где слово действительно участвует в паттерне.</span></div>
          </section>
        </article>
        <div className="lexicon-aside"><PageToc items={toc} /></div>
      </div>

      <div onMouseEnter={()=>clearTimeout(hideTimer.current)} onMouseLeave={scheduleHide}>
        <LexiconPopover item={activeItem} position={position} pinned={pinned} onClose={closeCard}/>
      </div>
    </div>
  );
}
