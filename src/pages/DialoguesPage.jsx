import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Eye, EyeOff, MessageCircle, MessagesSquare, Waypoints } from "lucide-react";
import { PageToc } from "../components/PageToc";
import { dialogues } from "../data/dialogues";
import { sitePath } from "../utils/sitePath";

const toc = [
  { id:"dialogue-list", label:"Восемь ситуаций" },
  ...dialogues.map((item)=>({ id:item.id, label:item.title }))
];

function DialogueCard({ dialogue, initiallyOpen=false }) {
  const [open,setOpen]=useState(initiallyOpen);
  const [translation,setTranslation]=useState(true);
  return <article className={`dialogue-card ${open?"open":""}`} id={dialogue.id}>
    <div className="dialogue-cover">
      <div className="dialogue-cover-copy"><span className="dialogue-level">{dialogue.level}</span><h2>{dialogue.title}</h2><p>{dialogue.situation}</p><div className="dialogue-goals">{dialogue.goals.map((goal)=><span key={goal}>{goal}</span>)}</div></div>
      <div className="coverage-ring" style={{"--coverage":`${dialogue.coverage * 3.6}deg`}}><strong>{dialogue.coverage}%</strong><span>покрытие<br/>ядром</span></div>
    </div>
    <button className="dialogue-open" onClick={()=>setOpen(!open)}><span>{open?"Свернуть диалог":"Открыть диалог"}</span>{open?<ChevronUp/>:<ChevronDown/>}</button>
    {open&&<div className="dialogue-body">
      <div className="dialogue-tools"><span><MessagesSquare size={15}/>{dialogue.lines.length} реплик</span><button onClick={()=>setTranslation(!translation)}>{translation?<EyeOff size={15}/>:<Eye size={15}/>} {translation?"Скрыть перевод":"Показать перевод"}</button></div>
      <div className="conversation">{dialogue.lines.map(([speaker,es,ru],index)=><div className={`conversation-line ${index%2?"reply":""}`} key={`${speaker}-${index}`}><span className="speaker-avatar">{speaker[0]}</span><div><b>{speaker}</b><p lang="es">{es}</p>{translation&&<small>{ru}</small>}</div></div>)}</div>
      <div className="dialogue-patterns"><span><Waypoints size={14}/> Используемые паттерны</span><div>{dialogue.patterns.map((pattern)=><a href={sitePath("/es-419/patterns/")} key={pattern}>{pattern}</a>)}</div></div>
      <div className="dialogue-note"><BookOpen size={15}/><span>{dialogue.note}</span></div>
    </div>}
  </article>;
}

export function DialoguesPage(){return <div className="reference-page dialogues-page">
  <section className="page-hero dialogues-hero compact-hero"><div className="container"><div className="breadcrumbs"><a href={sitePath("/es-419/")}>Главная</a><span>/</span><span>Диалоги</span></div><div className="reference-hero-grid"><div><div className="eyebrow"><span>Связная речь</span> проверенные ситуации</div><h1>Коротко.<br/><em>Естественно. По делу.</em></h1><p>Диалоги — просто способ проверить себя после того, как вся лексика выучена, а грамматика отработана до автоматизма.</p></div><div className="hero-index-card green-card"><div><MessageCircle size={18}/><span>Первый набор</span></div><strong>{dialogues.length}</strong><p>повседневных ситуаций с переводом и языковым комментарием</p></div></div></div></section>
  <div className="container reference-layout"><article className="reference-content">
    <section id="dialogue-list" className="dialogue-list"><div className="section-kicker">Ситуации</div><h2>От знакомства до визита к врачу</h2><p className="section-intro">Перевод можно скрыть, чтобы использовать каждый диалог для самостоятельного понимания.</p>{dialogues.map((dialogue,index)=><DialogueCard dialogue={dialogue} initiallyOpen={index===0} key={dialogue.id}/>)}</section>
  </article><PageToc items={toc}/></div>
  </div>}
