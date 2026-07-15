import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  AudioLines,
  BookOpen,
  Braces,
  ChevronDown,
  CircleHelp,
  Clock3,
  CornerDownRight,
  Eye,
  EyeOff,
  Layers3,
  MessageSquareText,
  MoveRight,
  Quote,
  Sparkles,
  Split,
  Type
} from "lucide-react";
import { PageToc } from "../components/PageToc";
import { ColorLegend } from "../components/ColorLegend";
import { sitePath } from "../utils/sitePath";

const grammarCategories = [
  {
    id: "foundation",
    label: "Основа фразы",
    topics: [
      ["reading", "Алфавит и чтение"],
      ["word-order", "Порядок слов"],
      ["syntax", "Отрицание и вопросы"]
    ]
  },
  {
    id: "noun-group",
    label: "Артикль и существительное",
    topics: [
      ["articles", "Определённость и артикли"],
      ["nouns", "Род и число существительных"]
    ]
  },
  {
    id: "description",
    label: "Признак и количество",
    topics: [
      ["adjectives", "Прилагательные и сравнение"],
      ["numerals", "Основные числительные"]
    ]
  },
  {
    id: "pronoun-group",
    label: "Местоимения",
    topics: [
      ["pronouns", "Личные местоимения"],
      ["objects-reflexive", "Дополнения и возвратность"],
      ["determiners", "Притяжательные и указательные"],
      ["question-negative", "Вопросительные и отрицательные"]
    ]
  },
  {
    id: "verb-group",
    label: "Глагол",
    topics: [
      ["conjugations", "Три спряжения"],
      ["ser-estar-hay", "ser, estar и hay"],
      ["present", "Presente de indicativo"],
      ["past", "Pretérito indefinido"],
      ["future", "ir a + infinitivo"],
      ["future-simple", "Futuro simple"],
      ["conditional", "Condicional simple"],
      ["imperative", "Imperativo"],
      ["non-finite", "Infinitivo, gerundio, participio"],
      ["irregular", "Частотные неправильные глаголы"]
    ]
  },
  {
    id: "adverb-group",
    label: "Наречия",
    topics: [["adverbs", "Наречия"]]
  },
  {
    id: "service-words",
    label: "Предлоги и союзы",
    topics: [
      ["prepositions", "Основные предлоги"],
      ["conjunctions", "Основные союзы"]
    ]
  },
  {
    id: "speech-patterns",
    label: "Готовые конструкции",
    topics: [["patterns", "Основные речевые паттерны"]]
  }
];

const toc = grammarCategories.map(({ id, label }) => ({ id, label }));
const topicCount = grammarCategories.reduce((sum, category) => sum + category.topics.length, 0);
const grammarPersons = ["yo", "tú", "él / ella / usted", "nosotros / nosotras", "ellos / ellas / ustedes"];

const irregularVerbs = [
  { verb: "ser", present: ["soy", "eres", "es", "somos", "son"], past: ["fui", "fuiste", "fue", "fuimos", "fueron"], future: ["seré", "serás", "será", "seremos", "serán"] },
  { verb: "estar", present: ["estoy", "estás", "está", "estamos", "están"], past: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"], future: ["estaré", "estarás", "estará", "estaremos", "estarán"] },
  { verb: "tener", present: ["tengo", "tienes", "tiene", "tenemos", "tienen"], past: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"], future: ["tendré", "tendrás", "tendrá", "tendremos", "tendrán"] },
  { verb: "ir", present: ["voy", "vas", "va", "vamos", "van"], past: ["fui", "fuiste", "fue", "fuimos", "fueron"], future: ["iré", "irás", "irá", "iremos", "irán"] },
  { verb: "hacer", present: ["hago", "haces", "hace", "hacemos", "hacen"], past: ["hice", "hiciste", "hizo", "hicimos", "hicieron"], future: ["haré", "harás", "hará", "haremos", "harán"] },
  { verb: "poder", present: ["puedo", "puedes", "puede", "podemos", "pueden"], past: ["pude", "pudiste", "pudo", "pudimos", "pudieron"], future: ["podré", "podrás", "podrá", "podremos", "podrán"] },
  { verb: "decir", present: ["digo", "dices", "dice", "decimos", "dicen"], past: ["dije", "dijiste", "dijo", "dijimos", "dijeron"], future: ["diré", "dirás", "dirá", "diremos", "dirán"] }
];

const endings = ({ root, end }) => <span lang="es">{root}<strong className="ending-text">{end}</strong></span>;

function RuleCard({ icon: Icon, title, kicker, children, className = "" }) {
  return <article className={`rule-card ${className}`}><div className="rule-card-head"><span className="rule-icon"><Icon size={19} /></span><div><span>{kicker}</span><h3>{title}</h3></div></div>{children}</article>;
}

function Note({ children, tone = "gray" }) {
  return <div className={`grammar-note tone-${tone}`}><AlertCircle size={16} /><span>{children}</span></div>;
}

function TranslationTable({ title, children, className = "" }) {
  const [translationsVisible, setTranslationsVisible] = useState(true);
  return (
    <div className={`translation-table-block ${translationsVisible ? "" : "translations-hidden"} ${className}`}>
      <div className="translation-table-toolbar">
        <span>{title}</span>
        <button type="button" onClick={() => setTranslationsVisible((visible) => !visible)} aria-pressed={translationsVisible}>
          {translationsVisible ? <EyeOff size={15}/> : <Eye size={15}/>}
          {translationsVisible ? "Скрыть перевод" : "Показать перевод"}
        </button>
      </div>
      <div className="table-card responsive-table translation-table-scroll">{children}</div>
    </div>
  );
}

function PersonFormTable({ forms, className = "" }) {
  return <table className={`person-form-table ${className}`}><tbody>{grammarPersons.map((person, index) => <tr key={person}><th>{person}</th><td lang="es">{forms[index]}</td></tr>)}</tbody></table>;
}

function IrregularVerbCard({ verb, present, past, future }) {
  const tenses = [["Presente", present], ["Pretérito", past], ["Futuro", future]];
  return <article className="irregular-verb-card"><header><span>verbo</span><h3 lang="es">{verb}</h3></header><div className="irregular-verb-tenses">{tenses.map(([title, forms]) => <section className="compact-tense-table" key={title}><h4>{title}</h4><PersonFormTable forms={forms} className="green-forms"/></section>)}</div></article>;
}

function PracticeLink({ tense, label }) {
  return <div className="grammar-practice-action"><a href={sitePath(`/es-419/tests/?tense=${encodeURIComponent(tense)}#conjugations`)}>{label || "Практиковать"}<ArrowRight size={15}/></a></div>;
}

function GrammarCategory({ index, id, title, topics, children, open = false }) {
  return (
    <details id={id} className="grammar-category" {...(open ? { open: true } : {})}>
      <summary className="grammar-category-summary">
        <span className="grammar-category-number">{String(index).padStart(2, "0")}</span>
        <span className="grammar-category-heading"><strong>{title}</strong><small>{topics.length} {topics.length === 1 ? "тема" : topics.length < 5 ? "темы" : "тем"}</small></span>
        <ChevronDown size={22}/>
      </summary>
      <div className="grammar-category-body">
        {topics.length > 1 && <nav className="grammar-topic-links" aria-label={`Темы раздела «${title}»`}>
          {topics.map(([topicId, topicTitle], topicIndex) => (
            <a href={`#${topicId}`} key={topicId}><span>{index}.{topicIndex + 1}</span><b>{topicTitle}</b><ArrowRight size={15}/></a>
          ))}
        </nav>}
        <div className="grammar-topic-stack">{children}</div>
      </div>
    </details>
  );
}

function GrammarTopic({ id, number, title, intro, children, hideHeader = false }) {
  return (
    <section id={id} className="grammar-topic">
      {!hideHeader && <header className="grammar-topic-header"><span>{number}</span><div><h2>{title}</h2>{intro && <p>{intro}</p>}</div></header>}
      {hideHeader && intro && <p className="single-topic-intro">{intro}</p>}
      {children}
    </section>
  );
}

export function GrammarPage() {
  useEffect(() => {
    const openHashSection = () => {
      if (!window.location.hash) return;
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (!target) return;
      if (target instanceof HTMLDetailsElement) target.open = true;
      const parent = target.closest("details.grammar-category");
      if (parent) parent.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    openHashSection();
    window.addEventListener("hashchange", openHashSection);
    return () => window.removeEventListener("hashchange", openHashSection);
  }, []);

  return (
    <div className="reference-page">
      <section className="page-hero compact-hero">
        <div className="container">
          <div className="breadcrumbs"><a href={sitePath("/es-419/")}>Главная</a><span>/</span><span>Грамматика</span></div>
          <div className="reference-hero-grid">
            <div><div className="eyebrow"><span>Справочник</span> грамматическое ядро v1.10</div><h1>Грамматика,<br /><em>которой достаточно.</em></h1><p>Только правила, необходимые для базовой речи и понимания первых 500 единиц. Большие темы раскрываются по мере необходимости.</p></div>
            <div className="hero-index-card"><div><BookOpen size={18} /><span>Объём ядра</span></div><strong>{topicCount}</strong><p>коротких тем в 8 разделах — без редких времён и энциклопедических исключений</p></div>
          </div>
          <ColorLegend />
        </div>
      </section>

      <div className="container reference-layout">
        <article className="reference-content grammar-catalog">
          <GrammarCategory index={1} id="foundation" title="Основа фразы" topics={grammarCategories[0].topics} open>
            <GrammarTopic id="reading" number="1.1" title="Алфавит и чтение" intro="Испанское письмо довольно предсказуемо: гласные не редуцируются, а знак ударения прямо показывает отклонение от обычного правила.">
              <div className="alphabet-ribbon" aria-label="Испанский алфавит">A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z</div>
              <div className="rule-grid three">
                <RuleCard icon={AudioLines} kicker="гласные" title="Всегда отчётливы"><p><b>a</b> · casa, <b>e</b> · mesa, <b>i</b> · vivir, <b>o</b> · todo, <b>u</b> · uno</p></RuleCard>
                <RuleCard icon={Type} kicker="ударение" title="Базовое правило"><p>После гласной, <b>n</b> или <b>s</b> — обычно предпоследний слог; иначе последний.</p><div className="micro-example" lang="es">c<span>á</span>sa · habl<span>á</span>r</div></RuleCard>
                <RuleCard icon={Quote} kicker="особые знаки" title="Вопрос виден сразу"><p>Вопрос и восклицание имеют открывающий и закрывающий знак.</p><div className="micro-example pattern-color" lang="es">¿Cómo estás? · ¡Muy bien!</div></RuleCard>
              </div>
              <div className="reading-table table-card"><div className="table-title">Сочетания, которые нужно знать</div><div className="reading-row"><b>c</b><span>перед e, i → [s]; иначе → [k]</span><em lang="es">cena · casa</em></div><div className="reading-row"><b>g</b><span>перед e, i → сильный [х]; иначе → [г]</span><em lang="es">gente · gato</em></div><div className="reading-row"><b>j / h</b><span>j → сильный [х]; h не читается</span><em lang="es">joven · hablar</em></div><div className="reading-row"><b>r / rr</b><span>одноударный / вибрирующий звук</span><em lang="es">pero · perro</em></div><div className="reading-row"><b>ll / y</b><span>в большинстве регионов звучат сходно</span><em lang="es">llave · yo</em></div></div>
            </GrammarTopic>

            <GrammarTopic id="word-order" number="1.2" title="Порядок слов" intro="Нейтральная схема — субъект + глагол + дополнение. Личное местоимение часто не нужно: лицо уже видно по форме глагола.">
              <div className="formula-card"><span className="formula-token subject">(Yo)<small>кто</small></span><MoveRight /><span className="formula-token verb">quiero<small>что делает</small></span><MoveRight /><span className="formula-token object">café<small>что</small></span></div>
              <div className="contrast-grid"><div><span className="mini-label gray">нейтрально</span><p lang="es">Quiero café.</p><small>Я хочу кофе.</small></div><div><span className="mini-label gray">с акцентом</span><p lang="es">Yo quiero café.</p><small>Именно я хочу кофе.</small></div></div>
              <Note>Прилагательное обычно следует за существительным: <span lang="es">una casa pequeña</span>.</Note>
            </GrammarTopic>

            <GrammarTopic id="syntax" number="1.3" title="Отрицание и вопросы" intro="Для базовой отрицательной и вопросительной фразы перестраивать всё предложение не требуется.">
              <div className="rule-grid two">
                <RuleCard icon={CornerDownRight} kicker="отрицание" title="no перед глаголом"><div className="syntax-formula"><span className="negative-token">No</span><span lang="es">entiendo.</span></div><div className="syntax-formula"><span className="negative-token">No</span><span lang="es">puedo ir.</span></div><Note>Двойное отрицание нормально: <span lang="es">No veo nada.</span></Note></RuleCard>
                <RuleCard icon={CircleHelp} kicker="вопрос" title="Интонация + ¿ ?"><div className="syntax-formula"><span lang="es">¿Hablas español?</span></div><div className="syntax-formula pattern-color"><span lang="es">¿Dónde vives?</span></div><p className="question-words">qué · quién · dónde · cuándo · cómo · cuánto · por qué</p></RuleCard>
              </div>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={2} id="noun-group" title="Артикль и существительное" topics={grammarCategories[1].topics}>
            <GrammarTopic id="articles" number="2.1" title="Определённость и артикли" intro="Артикль показывает род и число, а также различает уже понятный предмет и один из возможных.">
              <div className="rule-grid two">
                <RuleCard icon={Layers3} kicker="известный предмет" title="el · la · los · las"><table className="mini-table"><thead><tr><th></th><th>м.р.</th><th>ж.р.</th></tr></thead><tbody><tr><th>ед. число</th><td><b>el</b> libro</td><td><b>la</b> casa</td></tr><tr><th>мн. число</th><td><b>los</b> libros</td><td><b>las</b> casas</td></tr></tbody></table></RuleCard>
                <RuleCard icon={Split} kicker="один из многих" title="un · una · unos · unas"><div className="example-stack"><p lang="es"><b>un</b> problema</p><p lang="es"><b>una</b> pregunta</p><p lang="es"><b>unos</b> minutos</p></div></RuleCard>
              </div>
              <div className="contrast-grid"><div><span className="mini-label purple">слияние</span><p lang="es">a + el → <b>al</b></p><small>Voy al trabajo.</small></div><div><span className="mini-label purple">слияние</span><p lang="es">de + el → <b>del</b></p><small>Vengo del trabajo.</small></div></div>
              <Note>Без артикля обычно называют профессию после <b>ser</b>: <span lang="es">Soy profesor.</span> Перед ударным <b>a-</b> у некоторых существительных используется <b>el</b>: <span lang="es">el agua</span>, но <span lang="es">las aguas</span>.</Note>
            </GrammarTopic>

            <GrammarTopic id="nouns" number="2.2" title="Род и число существительных" intro="Род лучше запоминать вместе с артиклем. Окончание помогает, но не заменяет словарь.">
              <div className="rule-grid two">
                <RuleCard icon={Split} kicker="род" title="Чаще всего -o / -a"><div className="example-stack"><p lang="es"><b>el</b> libr<span className="ending-text">o</span> · <b>la</b> cas<span className="ending-text">a</span></p><p lang="es"><b>el</b> problem<span className="irregular-text">a</span> · <b>la</b> man<span className="irregular-text">o</span></p></div><p className="translation-line">Ещё одно частотное исключение: <span lang="es">el día</span>.</p></RuleCard>
                <RuleCard icon={Braces} kicker="множественное число" title="-s, -es и z → c"><div className="plural-examples"><span lang="es">casa → casa<strong className="plural-text">s</strong></span><span lang="es">papel → papel<strong className="plural-text">es</strong></span><span lang="es">luz → lu<strong className="irregular-text">ces</strong></span></div></RuleCard>
              </div>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={3} id="description" title="Признак и количество" topics={grammarCategories[2].topics}>
            <GrammarTopic id="adjectives" number="3.1" title="Прилагательные и сравнение" intro="Прилагательное обычно стоит после существительного и согласуется с ним в роде и числе.">
              <div className="rule-grid two">
                <RuleCard icon={Sparkles} kicker="согласование" title="-o меняется на -a"><div className="example-stack"><p lang="es">un libro nuev<span className="ending-text">o</span></p><p lang="es">dos casas nuev<span className="ending-text">as</span></p><p lang="es">una película interesant<span className="ending-text">e</span></p></div><Note>Формы на <b>-e</b> и большинство форм на согласную не меняются по роду.</Note></RuleCard>
                <RuleCard icon={Layers3} kicker="сравнение" title="más / menos / tan"><div className="example-stack"><p lang="es">más grande <b>que</b></p><p lang="es">menos caro <b>que</b></p><p lang="es">tan bueno <b>como</b></p></div><p className="translation-line"><b>mejor</b> — лучше · <b>peor</b> — хуже</p></RuleCard>
              </div>
              <Note tone="purple">Два частотных сокращения перед существительным: <span lang="es"><b>buen</b> día</span> и <span lang="es"><b>gran</b> problema</span>.</Note>
            </GrammarTopic>

            <GrammarTopic id="numerals" number="3.2" title="Основные числительные" intro="Для ядра достаточно уверенно строить числа до ста и узнавать основные порядковые формы.">
              <div className="number-reference-grid">
                <div className="table-card"><div className="table-title">0–15</div><p lang="es">cero · uno · dos · tres · cuatro · cinco · seis · siete · ocho · nueve · diez · once · doce · trece · catorce · quince</p></div>
                <div className="table-card"><div className="table-title">Десятки</div><p lang="es">veinte · treinta · cuarenta · cincuenta · sesenta · setenta · ochenta · noventa · cien</p></div>
              </div>
              <div className="contrast-grid"><div><span className="mini-label gray">после 30</span><p lang="es">treinta <b>y</b> uno</p><small>тридцать один</small></div><div><span className="mini-label gray">порядок</span><p lang="es">primero · segundo · tercero</p><small>первый · второй · третий</small></div></div>
              <Note><b>uno</b> перед существительным сокращается: <span lang="es">un libro · una casa</span>. Порядковое числительное согласуется: <span lang="es">la primera vez</span>.</Note>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={4} id="pronoun-group" title="Местоимения" topics={grammarCategories[3].topics}>
            <GrammarTopic id="pronouns" number="4.1" title="Личные местоимения" intro="В активном латиноамериканском ядре используется ustedes. Vosotros для построения собственных фраз не требуется.">
              <TranslationTable title="Личные местоимения">
                <table><thead><tr><th>Лицо</th><th>Единственное число</th><th className="translation-column">Перевод</th><th>Множественное число</th><th className="translation-column">Перевод</th></tr></thead><tbody>
                  <tr><td>1</td><td lang="es"><b>yo</b></td><td className="translation-column">я</td><td lang="es"><b>nosotros / nosotras</b></td><td className="translation-column">мы</td></tr>
                  <tr><td>2</td><td lang="es"><b>tú</b></td><td className="translation-column">ты</td><td lang="es"><b>ustedes</b></td><td className="translation-column">вы</td></tr>
                  <tr><td>3</td><td lang="es"><b>él / ella / usted</b></td><td className="translation-column">он / она / Вы</td><td lang="es"><b>ellos / ellas</b></td><td className="translation-column">они</td></tr>
                </tbody></table>
              </TranslationTable>
              <Note tone="purple"><b>Ustedes</b> сочетается с формой 3-го лица множественного числа: <span lang="es">ustedes hablan</span>.</Note>
              <p className="reference-footnote"><span lang="es">vosotros / vosotras</span> — «вы» в Испании; форма дана только для узнавания и не входит в активную модель es-419.</p>
            </GrammarTopic>

            <GrammarTopic id="objects-reflexive" number="4.2" title="Дополнения и возвратность" intro="Короткие местоимения обычно стоят перед спрягаемым глаголом, но присоединяются к инфинитиву и утвердительной команде.">
              <TranslationTable title="Личные, объектные и возвратные формы" className="wide-grammar-table">
                <table><thead><tr><th>Личное</th><th className="translation-column">Перевод</th><th>Прямое дополнение</th><th className="translation-column">Перевод</th><th>Косвенное дополнение</th><th className="translation-column">Перевод</th><th>Возвратность</th><th className="translation-column">Перевод</th></tr></thead><tbody>
                  <tr><td lang="es"><b>yo</b></td><td className="translation-column">я</td><td lang="es"><b>me</b></td><td className="translation-column">меня</td><td lang="es"><b>me</b></td><td className="translation-column">мне</td><td lang="es"><b>me</b></td><td className="translation-column">себя / себе</td></tr>
                  <tr><td lang="es"><b>tú</b></td><td className="translation-column">ты</td><td lang="es"><b>te</b></td><td className="translation-column">тебя</td><td lang="es"><b>te</b></td><td className="translation-column">тебе</td><td lang="es"><b>te</b></td><td className="translation-column">себя / себе</td></tr>
                  <tr><td lang="es"><b>él / ella / usted</b></td><td className="translation-column">он / она / Вы</td><td lang="es"><b>lo / la</b></td><td className="translation-column">его / её / Вас</td><td lang="es"><b>le</b></td><td className="translation-column">ему / ей / Вам</td><td lang="es"><b>se</b></td><td className="translation-column">себя / себе</td></tr>
                  <tr><td lang="es"><b>nosotros / nosotras</b></td><td className="translation-column">мы</td><td lang="es"><b>nos</b></td><td className="translation-column">нас</td><td lang="es"><b>nos</b></td><td className="translation-column">нам</td><td lang="es"><b>nos</b></td><td className="translation-column">себя / себе</td></tr>
                  <tr><td lang="es"><b>ellos / ellas / ustedes</b></td><td className="translation-column">они / вы</td><td lang="es"><b>los / las</b></td><td className="translation-column">их / Вас</td><td lang="es"><b>les</b></td><td className="translation-column">им / Вам</td><td lang="es"><b>se</b></td><td className="translation-column">себя / себе</td></tr>
                </tbody></table>
              </TranslationTable>
              <div className="contrast-grid"><div><span className="mini-label gray">перед глаголом</span><p lang="es"><b>Lo</b> veo.</p><small>Я вижу это / его.</small></div><div><span className="mini-label gray">с инфинитивом</span><p lang="es">Quiero ver<b>lo</b>.</p><small>Я хочу это увидеть.</small></div></div>
              <Note>Если рядом стоят <b>le / les</b> и <b>lo / la / los / las</b>, первое местоимение меняется на <b>se</b>: <span lang="es">Se lo digo.</span></Note>
            </GrammarTopic>

            <GrammarTopic id="determiners" number="4.3" title="Притяжательные и указательные" intro="Эти слова стоят перед существительным и заменяют артикль.">
              <div className="rule-grid two">
                <RuleCard icon={MessageSquareText} kicker="чей" title="Притяжательные формы" className="full-width-rule-card">
                  <TranslationTable title="Перед существительным" className="embedded-translation-table">
                    <table><thead><tr><th>Владелец</th><th>Единственное число</th><th>Множественное число</th><th className="translation-column">Русское значение</th></tr></thead><tbody>
                      <tr><td lang="es">yo</td><td lang="es"><b>mi</b></td><td lang="es"><b>mis</b></td><td className="translation-column">мой / моя / мои</td></tr>
                      <tr><td lang="es">tú</td><td lang="es"><b>tu</b></td><td lang="es"><b>tus</b></td><td className="translation-column">твой / твоя / твои</td></tr>
                      <tr><td lang="es">él / ella / usted</td><td lang="es"><b>su</b></td><td lang="es"><b>sus</b></td><td className="translation-column">его / её / Ваш</td></tr>
                      <tr><td lang="es">nosotros / nosotras</td><td lang="es"><b>nuestro / nuestra</b></td><td lang="es"><b>nuestros / nuestras</b></td><td className="translation-column">наш / наша / наши</td></tr>
                      <tr><td lang="es">ellos / ellas / ustedes</td><td lang="es"><b>su</b></td><td lang="es"><b>sus</b></td><td className="translation-column">их / Ваш</td></tr>
                    </tbody></table>
                  </TranslationTable>
                  <Note><b>su</b> может означать «его», «её», «Ваш» или «их»; смысл даёт контекст.</Note>
                </RuleCard>
                <RuleCard icon={CornerDownRight} kicker="какой именно" title="este · ese · aquel" className="full-width-rule-card"><div className="example-stack"><p lang="es"><b>este</b> libro — этот, рядом</p><p lang="es"><b>ese</b> libro — тот, ближе к собеседнику</p><p lang="es"><b>aquel</b> libro — тот, далеко</p></div><p className="translation-line">esta · estos · estas и аналогичные формы согласуются с существительным</p></RuleCard>
              </div>
            </GrammarTopic>

            <GrammarTopic id="question-negative" number="4.4" title="Вопросительные и отрицательные слова" intro="В вопросе ударение пишется обязательно. После глагола отрицательное слово обычно требует no.">
              <div className="word-chip-grid"><span><b lang="es">qué</b><small>что / какой</small></span><span><b lang="es">quién</b><small>кто</small></span><span><b lang="es">cuál</b><small>который</small></span><span><b lang="es">cuánto</b><small>сколько</small></span><span><b lang="es">algo</b><small>что-то</small></span><span><b lang="es">nada</b><small>ничего</small></span><span><b lang="es">alguien</b><small>кто-то</small></span><span><b lang="es">nadie</b><small>никто</small></span></div>
              <div className="contrast-grid"><div><span className="mini-label gray">после глагола</span><p lang="es">No veo <b>nada</b>.</p><small>Я ничего не вижу.</small></div><div><span className="mini-label gray">перед глаголом</span><p lang="es"><b>Nadie</b> viene.</p><small>Никто не приходит.</small></div></div>
              <Note tone="purple"><span lang="es"><b>que</b></span> без ударения связывает части фразы: <span lang="es">Creo que sí.</span> Форма <span lang="es"><b>lo que</b></span> означает «то, что».</Note>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={5} id="verb-group" title="Глагол" topics={grammarCategories[4].topics}>
            <GrammarTopic id="conjugations" number="5.1" title="Три спряжения" intro="Последние две буквы инфинитива показывают модель. Личные окончания добавляются к основе глагола.">
              <div className="rule-grid three">
                <RuleCard icon={Layers3} kicker="I спряжение · -ar" title="hablar"><PersonFormTable forms={["hablo", "hablas", "habla", "hablamos", "hablan"]}/></RuleCard>
                <RuleCard icon={Layers3} kicker="II спряжение · -er" title="comer"><PersonFormTable forms={["como", "comes", "come", "comemos", "comen"]}/></RuleCard>
                <RuleCard icon={Layers3} kicker="III спряжение · -ir" title="vivir"><PersonFormTable forms={["vivo", "vives", "vive", "vivimos", "viven"]}/></RuleCard>
              </div>
            </GrammarTopic>

            <GrammarTopic id="ser-estar-hay" number="5.2" title="ser, estar и hay" intro="Все три формы могут переводиться через «быть», но отвечают на разные вопросы.">
              <div className="rule-grid three">
                <RuleCard icon={Sparkles} kicker="что это" title="ser"><p>Идентичность, происхождение, профессия, класс или характеристика.</p><PersonFormTable forms={["soy", "eres", "es", "somos", "son"]} className="green-forms"/><div className="micro-example" lang="es">Soy profesor. · Es importante.</div></RuleCard>
                <RuleCard icon={Clock3} kicker="где / в каком состоянии" title="estar"><p>Местонахождение и состояние в конкретный момент.</p><PersonFormTable forms={["estoy", "estás", "está", "estamos", "están"]} className="green-forms"/><div className="micro-example" lang="es">Estoy en casa. · Está cansada.</div></RuleCard>
                <RuleCard icon={CornerDownRight} kicker="есть / имеется" title="hay"><p>Сообщает о наличии; форма не меняется по числу.</p><table className="person-form-table green-forms"><tbody><tr><th>единственное</th><td lang="es">hay</td></tr><tr><th>множественное</th><td lang="es">hay</td></tr></tbody></table><div className="micro-example" lang="es">Hay un problema. · Hay libros.</div></RuleCard>
              </div>
            </GrammarTopic>

            <GrammarTopic id="present" number="5.3" title="Presente de indicativo" intro="Используется для настоящего, привычек и общеизвестных фактов.">
              <div className="rule-grid two">
                <div className="table-card conjugation-table responsive-table"><table><thead><tr><th></th><th>-ar · hablar</th><th>-er · comer</th><th>-ir · vivir</th></tr></thead><tbody><tr><td>yo</td><td>{endings({root:"habl",end:"o"})}</td><td>{endings({root:"com",end:"o"})}</td><td>{endings({root:"viv",end:"o"})}</td></tr><tr><td>tú</td><td>{endings({root:"habl",end:"as"})}</td><td>{endings({root:"com",end:"es"})}</td><td>{endings({root:"viv",end:"es"})}</td></tr><tr><td>él / ella / usted</td><td>{endings({root:"habl",end:"a"})}</td><td>{endings({root:"com",end:"e"})}</td><td>{endings({root:"viv",end:"e"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"habl",end:"amos"})}</td><td>{endings({root:"com",end:"emos"})}</td><td>{endings({root:"viv",end:"imos"})}</td></tr><tr><td>ellos / ustedes</td><td>{endings({root:"habl",end:"an"})}</td><td>{endings({root:"com",end:"en"})}</td><td>{endings({root:"viv",end:"en"})}</td></tr></tbody></table></div>
                <RuleCard icon={Clock3} kicker="ситуация" title="Сейчас, обычно, вообще"><div className="timeline present"><i /><span>Ahora</span><b lang="es">estudio</b><span>español</span></div><div className="example-stack"><p lang="es">Trabajo desde casa.</p><small>Я работаю из дома.</small><p lang="es">Vivimos en Lima.</p><small>Мы живём в Лиме.</small></div></RuleCard>
              </div>
              <div className="table-card responsive-table irregular-roots-table"><div className="table-title">Особые формы · Presente</div><table><thead><tr><th></th><th lang="es">tener</th><th lang="es">poder</th><th lang="es">hacer</th></tr></thead><tbody>{grammarPersons.map((person, index) => <tr key={`present-${person}`}><td>{person}</td><td className="irregular-text" lang="es">{["tengo", "tienes", "tiene", "tenemos", "tienen"][index]}</td><td className="irregular-text" lang="es">{["puedo", "puedes", "puede", "podemos", "pueden"][index]}</td><td className="irregular-text" lang="es">{["hago", "haces", "hace", "hacemos", "hacen"][index]}</td></tr>)}</tbody></table></div>
              <PracticeLink tense="indicative.Presente" label="Практиковать Presente"/>
            </GrammarTopic>

            <GrammarTopic id="past" number="5.4" title="Pretérito indefinido" intro="Основное прошедшее ядра: завершённое событие в определённый момент — вчера, однажды, в прошлом году.">
              <div className="rule-grid two">
                <div className="table-card responsive-table"><table><thead><tr><th></th><th>hablar</th><th>comer / vivir</th></tr></thead><tbody><tr><td>yo</td><td>{endings({root:"habl",end:"é"})}</td><td>{endings({root:"com",end:"í"})}</td></tr><tr><td>tú</td><td>{endings({root:"habl",end:"aste"})}</td><td>{endings({root:"com",end:"iste"})}</td></tr><tr><td>él / usted</td><td>{endings({root:"habl",end:"ó"})}</td><td>{endings({root:"com",end:"ió"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"habl",end:"amos"})}</td><td>{endings({root:"com",end:"imos"})}</td></tr><tr><td>ellos / ustedes</td><td>{endings({root:"habl",end:"aron"})}</td><td>{endings({root:"com",end:"ieron"})}</td></tr></tbody></table></div>
                <RuleCard icon={Clock3} kicker="ситуация" title="Событие завершено"><div className="timeline"><i /><span>Ayer</span><b lang="es">llegué</b><span>a Lima</span></div><div className="example-stack"><p lang="es">Ayer trabajé hasta las seis.</p><small>Вчера я работал до шести.</small><p lang="es">La película terminó tarde.</p><small>Фильм закончился поздно.</small></div></RuleCard>
              </div>
              <div className="table-card responsive-table irregular-roots-table"><div className="table-title">Особые формы · Pretérito indefinido</div><table><thead><tr><th></th><th lang="es">tener</th><th lang="es">poder</th><th lang="es">hacer</th></tr></thead><tbody>{grammarPersons.map((person, index) => <tr key={`past-${person}`}><td>{person}</td><td className="irregular-text" lang="es">{["tuve", "tuviste", "tuvo", "tuvimos", "tuvieron"][index]}</td><td className="irregular-text" lang="es">{["pude", "pudiste", "pudo", "pudimos", "pudieron"][index]}</td><td className="irregular-text" lang="es">{["hice", "hiciste", "hizo", "hicimos", "hicieron"][index]}</td></tr>)}</tbody></table></div>
              <PracticeLink tense="indicative.PreteritoIndefinido" label="Практиковать Pretérito"/>
            </GrammarTopic>

            <GrammarTopic id="future" number="5.5" title="ir a + infinitivo" intro="Самый полезный способ говорить о намерении, плане и ближайшем будущем. Меняется только ir.">
              <div className="pattern-rule-card"><span className="pattern-label">PATTERN</span><div className="pattern-formula"><span lang="es" className="irregular-text">voy / vas / va / vamos / van</span><b lang="es">a</b><span lang="es" className="pattern-slot">{`{infinitivo}`}</span></div><div className="pattern-examples"><p lang="es">Voy a llamar esta noche.</p><span>Я позвоню сегодня вечером.</span><p lang="es">Vamos a comer aquí.</p><span>Мы поедим здесь.</span></div></div>
            </GrammarTopic>

            <GrammarTopic id="future-simple" number="5.6" title="Futuro simple" intro="Факт, прогноз или обещание в будущем. Окончание добавляется ко всему инфинитиву.">
              <div className="rule-grid two">
                <div className="table-card conjugation-table responsive-table"><table><thead><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr></thead><tbody><tr><td>yo</td><td>{endings({root:"hablar",end:"é"})}</td><td>{endings({root:"comer",end:"é"})}</td><td>{endings({root:"vivir",end:"é"})}</td></tr><tr><td>tú</td><td>{endings({root:"hablar",end:"ás"})}</td><td>{endings({root:"comer",end:"ás"})}</td><td>{endings({root:"vivir",end:"ás"})}</td></tr><tr><td>él / ella / usted</td><td>{endings({root:"hablar",end:"á"})}</td><td>{endings({root:"comer",end:"á"})}</td><td>{endings({root:"vivir",end:"á"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"hablar",end:"emos"})}</td><td>{endings({root:"comer",end:"emos"})}</td><td>{endings({root:"vivir",end:"emos"})}</td></tr><tr><td>ellos / ustedes</td><td>{endings({root:"hablar",end:"án"})}</td><td>{endings({root:"comer",end:"án"})}</td><td>{endings({root:"vivir",end:"án"})}</td></tr></tbody></table></div>
                <RuleCard icon={Clock3} kicker="ситуация" title="Прогноз, факт или обещание"><div className="timeline future"><i /><span>Mañana</span><b lang="es">será</b><span>un buen día</span></div><div className="example-stack"><p lang="es">Te llamaré esta noche.</p><small>Я позвоню тебе сегодня вечером.</small><p lang="es">Viviremos aquí.</p><small>Мы будем жить здесь.</small></div></RuleCard>
              </div>
              <div className="table-card responsive-table irregular-roots-table"><div className="table-title">Особые основы · Futuro simple</div><table><thead><tr><th></th><th lang="es">tener · tendr-</th><th lang="es">poder · podr-</th><th lang="es">hacer · har-</th></tr></thead><tbody>{grammarPersons.map((person, index) => <tr key={`future-${person}`}><td>{person}</td><td className="irregular-text" lang="es">{["tendré", "tendrás", "tendrá", "tendremos", "tendrán"][index]}</td><td className="irregular-text" lang="es">{["podré", "podrás", "podrá", "podremos", "podrán"][index]}</td><td className="irregular-text" lang="es">{["haré", "harás", "hará", "haremos", "harán"][index]}</td></tr>)}</tbody></table></div>
              <PracticeLink tense="indicative.FuturoImperfecto" label="Практиковать Futuro simple"/>
            </GrammarTopic>

            <GrammarTopic id="conditional" number="5.7" title="Condicional simple" intro="Нужен прежде всего для вежливости, желания и гипотетического результата.">
              <div className="conditional-strip"><span lang="es">hablar</span><b>+</b><span className="ending-pill">ía</span><span className="ending-pill">ías</span><span className="ending-pill">ía</span><span className="ending-pill">íamos</span><span className="ending-pill">ían</span></div>
              <div className="contrast-grid"><div><span className="mini-label purple">вежливая просьба</span><p lang="es">¿Podrías ayudarme, por favor?</p><small>Ты не мог бы мне помочь?</small></div><div><span className="mini-label purple">желание</span><p lang="es">Me gustaría viajar más.</p><small>Мне хотелось бы больше путешествовать.</small></div></div>
              <PracticeLink tense="indicative.CondicionalSimple" label="Практиковать Condicional"/>
            </GrammarTopic>

            <GrammarTopic id="imperative" number="5.8" title="Imperativo" intro="Формы просьбы, совета и команды. Для ядра достаточно tú, usted, nosotros и ustedes.">
              <div className="table-card responsive-table imperative-table"><table><thead><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr></thead><tbody><tr><td>tú</td><td>{endings({root:"habl",end:"a"})}</td><td>{endings({root:"com",end:"e"})}</td><td>{endings({root:"viv",end:"e"})}</td></tr><tr><td>usted</td><td>{endings({root:"habl",end:"e"})}</td><td>{endings({root:"com",end:"a"})}</td><td>{endings({root:"viv",end:"a"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"habl",end:"emos"})}</td><td>{endings({root:"com",end:"amos"})}</td><td>{endings({root:"viv",end:"amos"})}</td></tr><tr><td>ustedes</td><td>{endings({root:"habl",end:"en"})}</td><td>{endings({root:"com",end:"an"})}</td><td>{endings({root:"viv",end:"an"})}</td></tr></tbody></table></div>
              <Note>Отрицательная команда: <span lang="es">no hables · no coma · no vivan</span>. Частотные формы <b>tú</b>: <span lang="es">di · haz · ve · pon · sal · sé · ten · ven</span>.</Note>
              <div className="contrast-grid"><div><span className="mini-label gray">просьба · tú</span><p lang="es">Habla más despacio, por favor.</p><small>Говори помедленнее, пожалуйста.</small></div><div><span className="mini-label gray">приглашение · ustedes</span><p lang="es">Vengan mañana a las diez.</p><small>Приходите завтра в десять.</small></div></div>
              <PracticeLink tense="imperative.Afirmativo" label="Практиковать Imperativo"/>
            </GrammarTopic>

            <GrammarTopic id="non-finite" number="5.9" title="Infinitivo, gerundio, participio" intro="Три неличные формы не меняются по лицам и входят в самые частые конструкции.">
              <div className="rule-grid three">
                <RuleCard icon={Braces} kicker="инфинитив" title="-ar · -er · -ir"><p>Действие без лица и времени.</p><div className="example-stack compact-examples"><p lang="es">Quiero <b>hablar</b> contigo.</p><small>Я хочу поговорить с тобой.</small><p lang="es">Tenemos que <b>salir</b> temprano.</p><small>Нам нужно выйти рано.</small></div></RuleCard>
                <RuleCard icon={Clock3} kicker="герундий" title="-ando · -iendo"><p>Разворачивающееся действие с <b>estar</b>.</p><div className="example-stack compact-examples"><p lang="es">Estoy <b>leyendo</b> un libro.</p><small>Я сейчас читаю книгу.</small><p lang="es">Estamos <b>trabajando</b> en casa.</p><small>Мы сейчас работаем дома.</small></div></RuleCard>
                <RuleCard icon={Sparkles} kicker="причастие" title="-ado · -ido"><p>Результат или признак.</p><div className="example-stack compact-examples"><p lang="es">La puerta está <b>cerrada</b>.</p><small>Дверь закрыта.</small><p lang="es">El trabajo está <b>terminado</b>.</p><small>Работа закончена.</small></div></RuleCard>
              </div>
              <Note>Только самые частые особые формы: <span lang="es"><b>hecho, dicho, visto, puesto, escrito, abierto</b></span>; герундии <span lang="es"><b>yendo, leyendo, diciendo, durmiendo</b></span>.</Note>
            </GrammarTopic>

            <GrammarTopic id="irregular" number="5.10" title="Частотные неправильные глаголы" intro="Зелёным показаны формы, которые нельзя надёжно получить по регулярной модели.">
              <div className="irregular-verb-list">{irregularVerbs.map((verb) => <IrregularVerbCard {...verb} key={verb.verb}/>)}</div>
              <div className="example-banner irregular-examples"><span className="flag-dot">ES</span><div><p lang="es">Hoy puedo ir, pero ayer no pude.</p><small>Сегодня я могу пойти, но вчера не смог.</small><p lang="es">Ella me dice la verdad y ayer me dijo lo mismo.</p><small>Она говорит мне правду и вчера сказала то же самое.</small><p lang="es">Tenemos tiempo; mañana tendremos más.</p><small>У нас есть время; завтра будет больше.</small></div></div>
              <a className="inline-callout" href={sitePath("/es-419/lexicon/?q=ser")}><span><MessageSquareText size={19} /><b>Открыть полные формы в словарных статьях</b></span><ArrowRight size={17} /></a>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={6} id="adverb-group" title="Наречия" topics={grammarCategories[5].topics}>
            <GrammarTopic id="adverbs" number="6.1" title="Наречия" intro="Наречие не согласуется ни в роде, ни в числе и описывает действие, признак или всю фразу." hideHeader>
              <TranslationTable title="Готовые наречия и примеры" className="wide-grammar-table">
                <table><thead><tr><th>Группа</th><th>Слова</th><th className="translation-column">Перевод</th><th>Два примера</th><th className="translation-column">Перевод примеров</th></tr></thead><tbody>
                  <tr><td>Место</td><td lang="es"><b>aquí · allí · cerca · lejos</b></td><td className="translation-column">здесь · там · близко · далеко</td><td lang="es">Vivo aquí.<br/>El banco está cerca.</td><td className="translation-column">Я живу здесь.<br/>Банк находится рядом.</td></tr>
                  <tr><td>Время</td><td lang="es"><b>hoy · ayer · mañana · siempre</b></td><td className="translation-column">сегодня · вчера · завтра · всегда</td><td lang="es">Trabajo hoy.<br/>Llegué ayer.</td><td className="translation-column">Я работаю сегодня.<br/>Я приехал вчера.</td></tr>
                  <tr><td>Степень и образ</td><td lang="es"><b>muy · más · poco · bien</b></td><td className="translation-column">очень · больше · мало · хорошо</td><td lang="es">Hablas muy bien.<br/>Necesito un poco más.</td><td className="translation-column">Ты говоришь очень хорошо.<br/>Мне нужно ещё немного.</td></tr>
                </tbody></table>
              </TranslationTable>
              <RuleCard icon={Sparkles} kicker="образование" title="женская форма + -mente" className="adverb-formation-card"><div className="adverb-formation-grid"><div className="example-stack"><p lang="es">rápida + mente → <b>rápidamente</b></p><p lang="es">fácil + mente → <b>fácilmente</b></p></div><div className="example-stack compact-examples"><p lang="es">Habla <b>rápidamente</b>.</p><small>Он говорит быстро.</small><p lang="es">Lo hago <b>fácilmente</b>.</p><small>Я делаю это легко.</small></div></div><Note>Если у прилагательного уже есть знак ударения, он сохраняется.</Note></RuleCard>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={7} id="service-words" title="Предлоги и союзы" topics={grammarCategories[6].topics}>
            <GrammarTopic id="prepositions" number="7.1" title="Основные предлоги" intro="У предлога редко есть единственный русский эквивалент, поэтому ядро лучше запоминать через функции и короткие примеры.">
              <div className="service-word-grid"><span><b lang="es">a</b><small>куда, к; личное a</small></span><span><b lang="es">de</b><small>из, от, принадлежность</small></span><span><b lang="es">en</b><small>в, на, где</small></span><span><b lang="es">con / sin</b><small>с / без</small></span><span><b lang="es">desde / hasta</b><small>от / до</small></span><span><b lang="es">sobre / entre</b><small>на, о / между</small></span></div>
              <TranslationTable title="Функции и естественные примеры" className="wide-grammar-table top-gap">
                <table><thead><tr><th>Предлог</th><th>Функция</th><th>Примеры</th><th className="translation-column">Перевод</th></tr></thead><tbody>
                  <tr><td lang="es"><b>a</b></td><td>направление; человек как объект</td><td lang="es">Voy <b>a</b> casa.<br/>Llamo <b>a</b> Ana.</td><td className="translation-column">Я иду домой.<br/>Я звоню Ане.</td></tr>
                  <tr><td lang="es"><b>de</b></td><td>происхождение; принадлежность</td><td lang="es">Soy <b>de</b> Chile.<br/>Es el libro <b>de</b> Ana.</td><td className="translation-column">Я из Чили.<br/>Это книга Аны.</td></tr>
                  <tr><td lang="es"><b>en</b></td><td>место; нахождение внутри</td><td lang="es">Vivo <b>en</b> Lima.<br/>El café está <b>en</b> la mesa.</td><td className="translation-column">Я живу в Лиме.<br/>Кофе стоит на столе.</td></tr>
                  <tr><td lang="es"><b>con / sin</b></td><td>совместность / отсутствие</td><td lang="es">Trabajo <b>con</b> Marta.<br/>Viajo <b>sin</b> dinero.</td><td className="translation-column">Я работаю с Мартой.<br/>Я путешествую без денег.</td></tr>
                  <tr><td lang="es"><b>desde / hasta</b></td><td>начальная / конечная граница</td><td lang="es">Trabajo <b>desde</b> casa.<br/>Estudio <b>hasta</b> las seis.</td><td className="translation-column">Я работаю из дома.<br/>Я учусь до шести.</td></tr>
                  <tr><td lang="es"><b>sobre / entre</b></td><td>на, о / между</td><td lang="es">El libro está <b>sobre</b> la mesa.<br/>Estoy <b>entre</b> Ana y Luis.</td><td className="translation-column">Книга лежит на столе.<br/>Я между Аной и Луисом.</td></tr>
                  <tr><td lang="es"><b>por</b></td><td>причина; путь; обмен</td><td lang="es">Gracias <b>por</b> todo.<br/>Camino <b>por</b> el centro.<br/>Diez euros <b>por</b> día.</td><td className="translation-column">Спасибо за всё.<br/>Я иду через центр.<br/>Десять евро в день.</td></tr>
                  <tr><td lang="es"><b>para</b></td><td>цель; адресат; срок</td><td lang="es">Estudio <b>para</b> trabajar.<br/>Es <b>para</b> ti.<br/><b>Para</b> mañana.</td><td className="translation-column">Я учусь, чтобы работать.<br/>Это для тебя.<br/>К завтрашнему дню.</td></tr>
                </tbody></table>
              </TranslationTable>
            </GrammarTopic>

            <GrammarTopic id="conjunctions" number="7.2" title="Основные союзы" intro="Этого набора достаточно, чтобы соединять слова, противопоставлять, объяснять причину и задавать условие.">
              <div className="word-chip-grid conjunction-chip-grid"><span><b lang="es">y</b><small>и</small></span><span><b lang="es">o</b><small>или</small></span><span><b lang="es">pero</b><small>но</small></span><span><b lang="es">porque</b><small>потому что</small></span><span><b lang="es">si</b><small>если</small></span><span><b lang="es">aunque</b><small>хотя</small></span><span><b lang="es">mientras</b><small>пока</small></span><span><b lang="es">que</b><small>что</small></span></div>
              <TranslationTable title="Союзы в коротких фразах" className="wide-grammar-table top-gap">
                <table><thead><tr><th>Союз</th><th className="translation-column">Перевод</th><th>Пример</th><th className="translation-column">Перевод примера</th></tr></thead><tbody>
                  <tr><td lang="es"><b>y</b></td><td className="translation-column">и</td><td lang="es">Trabajo <b>y</b> estudio.</td><td className="translation-column">Я работаю и учусь.</td></tr>
                  <tr><td lang="es"><b>o</b></td><td className="translation-column">или</td><td lang="es">¿Café <b>o</b> agua?</td><td className="translation-column">Кофе или вода?</td></tr>
                  <tr><td lang="es"><b>pero</b></td><td className="translation-column">но</td><td lang="es">Quiero ir, <b>pero</b> no puedo.</td><td className="translation-column">Я хочу пойти, но не могу.</td></tr>
                  <tr><td lang="es"><b>porque</b></td><td className="translation-column">потому что</td><td lang="es">No voy <b>porque</b> trabajo.</td><td className="translation-column">Я не иду, потому что работаю.</td></tr>
                  <tr><td lang="es"><b>si</b></td><td className="translation-column">если</td><td lang="es"><b>Si</b> quieres, vamos juntos.</td><td className="translation-column">Если хочешь, пойдём вместе.</td></tr>
                  <tr><td lang="es"><b>aunque</b></td><td className="translation-column">хотя</td><td lang="es">Voy, <b>aunque</b> estoy cansado.</td><td className="translation-column">Я пойду, хотя устал.</td></tr>
                  <tr><td lang="es"><b>mientras</b></td><td className="translation-column">пока; в то время как</td><td lang="es">Trabajo <b>mientras</b> ella estudia.</td><td className="translation-column">Я работаю, пока она учится.</td></tr>
                  <tr><td lang="es"><b>que</b></td><td className="translation-column">что</td><td lang="es">Creo <b>que</b> tiene razón.</td><td className="translation-column">Думаю, он прав.</td></tr>
                </tbody></table>
              </TranslationTable>
              <Note>Перед звуком [и] союз <b>y</b> становится <b>e</b>: <span lang="es">padre e hijo</span>. Перед звуком [о] союз <b>o</b> становится <b>u</b>: <span lang="es">siete u ocho</span>.</Note>
            </GrammarTopic>
          </GrammarCategory>

          <GrammarCategory index={8} id="speech-patterns" title="Готовые конструкции" topics={grammarCategories[7].topics}>
            <GrammarTopic id="patterns" number="8.1" title="Основные речевые паттерны" intro="Паттерн можно использовать раньше, чем вы изучите полное объяснение всех его частей." hideHeader>
              <div className="pattern-grid">
                {[["Quiero {infinitivo}.","желание","Quiero aprender español."],["No puedo {infinitivo}.","возможность","No puedo hablar ahora."],["Tengo que {infinitivo}.","необходимость","Tengo que salir temprano."],["Me gusta {sustantivo}.","предпочтение","Me gusta esta canción."],["Creo que {frase}.","мнение","Creo que va a llover."],["¿Dónde está {lugar}?","местонахождение","¿Dónde está el baño?"]].map(([pattern, fn, example]) => <a href={sitePath("/es-419/patterns/")} className="pattern-tile" key={pattern}><span>{fn}</span><h3 lang="es">{pattern}</h3><p lang="es">{example}</p><ArrowRight size={16} /></a>)}
              </div>
              <div className="grammar-practice-action pattern-study-action"><a href={sitePath("/es-419/patterns/")}>ИЗУЧАТЬ ПАТТЕРНЫ<ArrowRight size={15}/></a></div>
            </GrammarTopic>
          </GrammarCategory>
        </article>
        <PageToc items={toc} />
      </div>
    </div>
  );
}
