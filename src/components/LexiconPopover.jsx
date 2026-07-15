import { ArrowUpRight, BookOpen, Braces, CircleDot, Hash, Layers3, MapPin, Pin, Volume2, Waypoints, X } from "lucide-react";
import conjugations from "../data/conjugations.json";
import { patterns } from "../data/patterns";
import { sitePath } from "../utils/sitePath";
import { speakSpanish } from "../utils/speech";
import { VerbConjugationTables } from "./VerbConjugationTables";

const patternLinks = patterns.reduce((index, pattern) => {
  pattern.lexicon.forEach((lemma) => {
    const key = lemma.toLowerCase();
    index.set(key, [...(index.get(key) || []), pattern]);
  });
  return index;
}, new Map());

function grammarMeta(item) {
  const lowerType=item.type.toLowerCase();const forms=item.forms||"";const article=forms.match(/^(el|la)\b/i)?.[1];const plural=forms.split(/[;,]/).map((part)=>part.trim()).find((part)=>/^(los|las)\b/i.test(part)||/s$/.test(part)&&part!==item.lemma);
  return {gender:lowerType.includes("существительное")?(article==="la"?"женский":article==="el"?"мужской":"по форме"):null,plural:lowerType.includes("существительное")?(plural||"см. формы"):null,patterns:patternLinks.get(item.lemma.toLowerCase())||[]};
}

function VerbForms({table,mode}){return <div className="verb-forms"><div className="non-finite-grid">{Object.entries(table.nonFinite).map(([name,value])=><span key={name}><small>{name==="Infinitivo"?"Инфинитив":name==="Gerundio"?"Герундий":"Причастие"}</small><b lang="es">{value}</b></span>)}{table.specialForms.map((value)=><span key={value}><small>Безличная форма</small><b lang="es">{value}</b></span>)}</div><VerbConjugationTables table={table} mode={mode}/><p className="conjugation-note">Формы стандарта es-419; <b>vosotros</b> намеренно не включено. Режим набора времён переключается над списком слов.</p></div>}

const escapeRegExp=(value)=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const collectForms=(value)=>typeof value==="string"?[value]:Array.isArray(value)?value.flatMap(collectForms):value&&typeof value==="object"?Object.values(value).flatMap(collectForms):[];
const withoutAccents=(value)=>value.normalize("NFD").replace(/\p{M}/gu,"");
function lexicalVariants(value){
  const cleaned=value.trim().replace(/^no\s+/i,"").replace(/[¿¡]/g,"").replace(/\.{2,}.*$/u,"").replace(/[?!]+/g,"").split(/\s+(?=\p{Script=Cyrillic})/u)[0].replace(/\s*\+\s*(?:infinitivo|gerundio|sustantivo).*$/iu,"").trim();
  if(!cleaned)return[];
  return [cleaned,cleaned.replace(/^(?:el|la|los|las|un|una|unos|unas)\s+/iu,""),cleaned.split(/\s*\+\s*/u)[0]].filter(Boolean);
}
function exampleMatch(item,table){
  const patternVerb=Object.keys(conjugations).find((verb)=>item.lemma.toLowerCase().startsWith(`${verb} `));
  const patternTable=patternVerb?conjugations[patternVerb]:null;
  const source=table||patternTable;
  const conjugated=source?[...source.specialForms,...collectForms(source.nonFinite),...collectForms(source.indicative),...collectForms(source.subjunctive),...collectForms(source.imperative)]:[];
  const raw=[...conjugated,item.lemma,...item.forms.split(/[;,/]/)];
  const candidates=[...new Set(raw.flatMap(lexicalVariants))].sort((a,b)=>b.length-a.length);
  for(const candidate of candidates){
    const exact=item.example.match(new RegExp(`(^|[^\\p{L}\\p{M}])(${escapeRegExp(candidate)})(?=$|[^\\p{L}\\p{M}])`,"iu"));
    if(exact)return{start:exact.index+exact[1].length,end:exact.index+exact[1].length+exact[2].length};
  }
  const normalized=withoutAccents(item.example);
  for(const candidate of candidates){
    const attached=normalized.match(new RegExp(`(^|[^\\p{L}])(${escapeRegExp(withoutAccents(candidate))}(?:(?:me|te|se|lo|la|los|las|le|les|nos)){1,2})(?=$|[^\\p{L}])`,"iu"));
    if(attached)return{start:attached.index+attached[1].length,end:attached.index+attached[1].length+attached[2].length};
  }
  return null;
}
function highlightedExample(item,table){const match=exampleMatch(item,table);if(!match)return item.example;return <>{item.example.slice(0,match.start)}<mark className="example-target">{item.example.slice(match.start,match.end)}</mark>{item.example.slice(match.end)}</>}

export function LexiconPopover({item,position,onClose,pinned=false,conjugationMode="core"}) {
  if(!item)return null;const meta=grammarMeta(item);const style=position?{left:position.left,top:position.top}:undefined;const verbTable=conjugations[item.lemma.toLowerCase()]||null;
  return <aside className={`lexicon-popover ${verbTable?"verb-card":""} ${pinned?"is-pinned":""}`} style={style} role="dialog" aria-label={`Карточка слова ${item.lemma}`}>
    <div className="popover-accent"/><button className="popover-close" onClick={onClose} aria-label="Закрыть карточку"><X size={17}/></button>
    <div className="popover-head"><div><span className="popover-rank">ядро · #{item.rank}</span><div className="popover-title-row"><h2 lang="es">{item.lemma}</h2><button className="word-audio-button" onClick={()=>speakSpanish(item.lemma)} aria-label={`Произнести ${item.lemma}`}><Volume2 size={18}/></button></div><p>{item.type}</p></div><div className="popover-statuses"><span className="status-chip"><CircleDot size={13}/> es-419</span>{pinned&&<span className="pinned-chip"><Pin size={12}/> закреплено</span>}</div></div>
    <div className="popover-translation">{item.translation}</div>
    {(meta.gender||meta.plural)&&<div className="grammar-facts">{meta.gender&&<div><span><Layers3 size={14}/> Род</span><b>{meta.gender}</b></div>}{meta.plural&&<div><span><Hash size={14}/> Мн. число</span><b className="plural-text" lang="es">{meta.plural}</b></div>}</div>}
    <div className="popover-block forms-block"><div className="popover-label"><Braces size={14}/> Формы и варианты</div>{verbTable?<VerbForms table={verbTable} mode={conjugationMode}/>:<p className="form-line" lang="es">{item.forms}</p>}</div>
    <div className="popover-block example-block"><div className="popover-label"><BookOpen size={14}/> Естественный пример</div><blockquote lang="es">{highlightedExample(item,verbTable)}</blockquote><p>{item.exampleRu}</p></div>
    {meta.patterns.length>0&&<div className="popover-links"><div className="popover-label"><Waypoints size={14}/> Связанные паттерны</div><div className="pattern-chips">{meta.patterns.map((pattern)=><a href={sitePath(`/es-419/patterns/#${pattern.id}`)} title={pattern.function} key={pattern.id}>{pattern.template}<ArrowUpRight size={12}/></a>)}</div></div>}
    <div className="popover-note"><MapPin size={14}/><span>Латиноамериканское употребление</span></div>
  </aside>;
}
