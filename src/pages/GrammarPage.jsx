import { useEffect } from "react";
import { AlertCircle, ArrowRight, AudioLines, BookOpen, Braces, ChevronDown, CircleHelp, Clock3, CornerDownRight, Layers3, Megaphone, MessageSquareText, MoveRight, Quote, Sparkles, Split, Type } from "lucide-react";
import { PageToc } from "../components/PageToc";
import { ColorLegend } from "../components/ColorLegend";

const toc = [
  { id: "reading", label: "Алфавит и чтение" },
  { id: "word-order", label: "Порядок слов" },
  { id: "nouns", label: "Именная группа" },
  { id: "pronouns", label: "Местоимения" },
  { id: "syntax", label: "Отрицание и вопросы" },
  { id: "present", label: "Настоящее время" },
  { id: "past", label: "Основное прошедшее" },
  { id: "future", label: "Будущее" },
  { id: "conditional", label: "Условное" },
  { id: "imperative", label: "Повелительное наклонение" },
  { id: "irregular", label: "Неправильные глаголы" },
  { id: "patterns", label: "Основные паттерны" }
];

const endings = ({ root, end }) => <span lang="es">{root}<strong className="ending-text">{end}</strong></span>;

function RuleCard({ icon: Icon, title, kicker, children, className = "" }) {
  return <article className={`rule-card ${className}`}><div className="rule-card-head"><span className="rule-icon"><Icon size={19} /></span><div><span>{kicker}</span><h3>{title}</h3></div></div>{children}</article>;
}

function Note({ children, tone = "gray" }) {
  return <div className={`grammar-note tone-${tone}`}><AlertCircle size={16} /><span>{children}</span></div>;
}

function SpoilerSummary({ kicker, title }) {
  return <summary className="grammar-spoiler-summary"><span><span className="section-kicker">{kicker}</span><span className="grammar-spoiler-title">{title}</span></span><ChevronDown size={22}/></summary>;
}

export function GrammarPage() {
  useEffect(() => {
    const openHashSection = () => {
      const target = window.location.hash && document.querySelector(window.location.hash);
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openHashSection();
    window.addEventListener("hashchange", openHashSection);
    return () => window.removeEventListener("hashchange", openHashSection);
  }, []);

  return (
    <div className="reference-page">
      <section className="page-hero compact-hero">
        <div className="container">
          <div className="breadcrumbs"><a href="/es-419/">Главная</a><span>/</span><span>Грамматика</span></div>
          <div className="reference-hero-grid">
            <div><div className="eyebrow"><span>Справочник</span> грамматическое ядро v1.2</div><h1>Грамматика,<br /><em>которой достаточно.</em></h1><p>Короткие правила, таблицы и паттерны для базовых высказываний о настоящем, прошлом и будущем.</p></div>
            <div className="hero-index-card"><div><BookOpen size={18} /><span>Объём ядра</span></div><strong>15</strong><p>тем, необходимых для функционального использования первых 500 единиц</p></div>
          </div>
          <ColorLegend />
        </div>
      </section>

      <div className="container reference-layout">
        <article className="reference-content grammar-content">
          <details id="reading" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="01 · Фонетика и письмо" title="Алфавит и чтение"/>
            <div className="section-kicker">01 · Фонетика и письмо</div><h2>Алфавит и чтение</h2><p className="section-intro">Испанское письмо предсказуемо: большинство букв читаются одинаково, а ударение обычно можно определить по окончанию слова.</p>
            <div className="alphabet-ribbon" aria-label="Испанский алфавит">A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z</div>
            <div className="rule-grid three">
              <RuleCard icon={AudioLines} kicker="чтение" title="Гласные не редуцируются"><p><b>a</b> · casa, <b>e</b> · mesa, <b>i</b> · vivir, <b>o</b> · todo, <b>u</b> · uno</p><div className="micro-example" lang="es">casa · mesa · vino</div></RuleCard>
              <RuleCard icon={Type} kicker="ударение" title="Базовое правило"><p>Если слово заканчивается на гласную, <b>n</b> или <b>s</b>, ударение обычно на предпоследнем слоге.</p><div className="micro-example" lang="es">c<span>á</span>sa · h<span>ó</span>mbre</div></RuleCard>
              <RuleCard icon={Quote} kicker="знаки" title="Вопрос с самого начала"><p>Открывающие знаки сразу показывают интонацию и границы фразы.</p><div className="micro-example pattern-color" lang="es">¿Cómo estás? · ¡Qué bien!</div></RuleCard>
            </div>
            <div className="reading-table table-card"><div className="table-title">Особые буквы и сочетания</div><div className="reading-row"><b>c</b><span>перед e, i → [s]; иначе → [k]</span><em lang="es">cena · casa</em></div><div className="reading-row"><b>g</b><span>перед e, i → как сильное h; иначе твёрдо</span><em lang="es">gente · gato</em></div><div className="reading-row"><b>j / h</b><span>j произносится сильно; h не читается</span><em lang="es">joven · hablar</em></div><div className="reading-row"><b>r / rr</b><span>одиночный удар / вибрирующий звук</span><em lang="es">pero · perro</em></div><div className="reading-row"><b>ll / y</b><span>в большинстве регионов звучат сходно</span><em lang="es">llave · yo</em></div></div>
          </details>

          <details id="word-order" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="02 · Синтаксис" title="Порядок слов"/>
            <div className="section-kicker">02 · Синтаксис</div><h2>Порядок слов</h2><p className="section-intro">Нейтральная схема — субъект + глагол + дополнение. Местоимение-субъект часто опускается: форма глагола уже показывает лицо.</p>
            <div className="formula-card"><span className="formula-token subject">(Yo)<small>кто</small></span><MoveRight /><span className="formula-token verb">quiero<small>что делает</small></span><MoveRight /><span className="formula-token object">café<small>что / кого</small></span></div>
            <div className="contrast-grid"><div><span className="mini-label gray">нейтрально</span><p lang="es">Quiero café.</p><small>Я хочу кофе.</small></div><div><span className="mini-label gray">с акцентом на субъекте</span><p lang="es">Yo quiero café.</p><small>Именно я хочу кофе.</small></div></div>
          </details>

          <details id="nouns" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="03 · Именная группа" title="Артикли, существительные и признаки"/>
            <div className="section-kicker">03 · Именная группа</div><h2>Артикли, существительные и признаки</h2>
            <div className="rule-grid two">
              <RuleCard icon={Layers3} kicker="артикли" title="Определённые и неопределённые">
                <table className="mini-table"><thead><tr><th></th><th>м.р.</th><th>ж.р.</th></tr></thead><tbody><tr><th>этот / эти</th><td><b>el</b> · <span className="plural-text">los</span></td><td><b>la</b> · <span className="plural-text">las</span></td></tr><tr><th>один / какие-то</th><td><b>un</b> · <span className="plural-text">unos</span></td><td><b>una</b> · <span className="plural-text">unas</span></td></tr></tbody></table>
              </RuleCard>
              <RuleCard icon={Split} kicker="род" title="Чаще всего -o / -a"><div className="example-stack"><p lang="es"><b>el</b> libr<span className="ending-text">o</span> · <b>la</b> cas<span className="ending-text">a</span></p><p lang="es"><b>el</b> problem<span className="ending-text">a</span> · <b>la</b> man<span className="ending-text">o</span></p></div><Note>Окончание помогает, но артикль надёжнее: исключения нужно запоминать вместе со словом.</Note></RuleCard>
            </div>
            <div className="rule-grid two top-gap">
              <RuleCard icon={Braces} kicker="множественное число" title="Добавьте -s или -es"><div className="plural-examples"><span lang="es">casa → casa<strong className="plural-text">s</strong></span><span lang="es">papel → papel<strong className="plural-text">es</strong></span><span lang="es">luz → lu<strong className="irregular-text">ces</strong></span></div><Note>После согласной обычно добавляется <b>-es</b>; z меняется на c.</Note></RuleCard>
              <RuleCard icon={Sparkles} kicker="согласование" title="Прилагательное следует за именем"><div className="example-stack"><p lang="es">un libro nuev<span className="ending-text">o</span></p><p lang="es">dos casas nuev<span className="ending-text">as</span></p></div><p className="translation-line">новая книга · два новых дома</p></RuleCard>
            </div>
          </details>

          <details id="pronouns" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="04 · Местоимения" title="Кто говорит и к кому"/>
            <div className="section-kicker">04 · Местоимения</div><h2>Кто говорит и к кому</h2><p className="section-intro">В активном ядре используется <b>ustedes</b>; форма <b>vosotros</b> остаётся справочной для понимания европейского варианта.</p>
            <div className="table-card responsive-table"><table><thead><tr><th>Лицо</th><th>Ед. число</th><th>Мн. число</th><th>Обращение</th></tr></thead><tbody><tr><td>1</td><td lang="es">yo</td><td lang="es">nosotros / nosotras</td><td>я · мы</td></tr><tr><td>2</td><td lang="es">tú</td><td lang="es"><strong>ustedes</strong></td><td>ты · вы</td></tr><tr><td>3</td><td lang="es">él / ella / usted</td><td lang="es">ellos / ellas / ustedes</td><td>он, она, Вы · они, вы</td></tr></tbody></table></div>
            <Note tone="purple">В Латинской Америке <b>ustedes</b> — обычное множественное «вы» и сочетается с формой 3-го лица множественного числа.</Note>
          </details>

          <details id="syntax" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="05 · Конструкция фразы" title="Отрицание и вопросы"/>
            <div className="section-kicker">05 · Конструкция фразы</div><h2>Отрицание и вопросы</h2>
            <div className="rule-grid two">
              <RuleCard icon={CornerDownRight} kicker="отрицание" title="no перед глаголом"><div className="syntax-formula"><span className="negative-token">No</span><span lang="es">entiendo.</span></div><div className="syntax-formula"><span className="negative-token">No</span><span lang="es">puedo ir.</span></div><Note>Двойное отрицание нормально: <span lang="es">No veo nada.</span></Note></RuleCard>
              <RuleCard icon={CircleHelp} kicker="вопрос" title="Интонация + ¿ ?"><div className="syntax-formula"><span lang="es">¿Hablas español?</span></div><div className="syntax-formula pattern-color"><span lang="es">¿Dónde vives?</span></div><p className="question-words">qué · quién · dónde · cuándo · cómo · cuánto · por qué</p></RuleCard>
            </div>
          </details>

          <details id="present" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="06 · Глагол" title="Настоящее время"/>
            <div className="section-kicker">06 · Глагол</div><h2>Настоящее время</h2><p className="section-intro">Уберите окончание инфинитива и добавьте окончание лица. В таблице показаны только активные формы ядра.</p>
            <div className="table-card conjugation-table responsive-table"><table><thead><tr><th></th><th>-ar · hablar</th><th>-er · comer</th><th>-ir · vivir</th></tr></thead><tbody><tr><td>yo</td><td>{endings({root:"habl",end:"o"})}</td><td>{endings({root:"com",end:"o"})}</td><td>{endings({root:"viv",end:"o"})}</td></tr><tr><td>tú</td><td>{endings({root:"habl",end:"as"})}</td><td>{endings({root:"com",end:"es"})}</td><td>{endings({root:"viv",end:"es"})}</td></tr><tr><td>él / ella / usted</td><td>{endings({root:"habl",end:"a"})}</td><td>{endings({root:"com",end:"e"})}</td><td>{endings({root:"viv",end:"e"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"habl",end:"amos"})}</td><td>{endings({root:"com",end:"emos"})}</td><td>{endings({root:"viv",end:"imos"})}</td></tr><tr><td>ellos / ustedes</td><td>{endings({root:"habl",end:"an"})}</td><td>{endings({root:"com",end:"en"})}</td><td>{endings({root:"viv",end:"en"})}</td></tr></tbody></table></div>
            <div className="example-banner"><span className="flag-dot">ES</span><p lang="es">Trabajo y estudio, pero hoy descanso.</p><span>Я работаю и учусь, но сегодня отдыхаю.</span></div>
          </details>

          <details id="past" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="07 · Прошлое" title="Pretérito indefinido"/>
            <div className="section-kicker">07 · Прошлое</div><h2>Pretérito indefinido</h2><p className="section-intro">Основное прошедшее ядра: завершённое событие в определённый момент — вчера, в прошлом году, однажды.</p>
            <div className="rule-grid two">
              <div className="table-card responsive-table"><table><thead><tr><th></th><th>hablar</th><th>comer / vivir</th></tr></thead><tbody><tr><td>yo</td><td>{endings({root:"habl",end:"é"})}</td><td>{endings({root:"com",end:"í"})}</td></tr><tr><td>tú</td><td>{endings({root:"habl",end:"aste"})}</td><td>{endings({root:"com",end:"iste"})}</td></tr><tr><td>él / usted</td><td>{endings({root:"habl",end:"ó"})}</td><td>{endings({root:"com",end:"ió"})}</td></tr><tr><td>nosotros</td><td>{endings({root:"habl",end:"amos"})}</td><td>{endings({root:"com",end:"imos"})}</td></tr><tr><td>ellos / ustedes</td><td>{endings({root:"habl",end:"aron"})}</td><td>{endings({root:"com",end:"ieron"})}</td></tr></tbody></table></div>
              <RuleCard icon={Clock3} kicker="ситуация" title="Событие завершено"><div className="timeline"><i /><span>Ayer</span><b lang="es">llegué</b><span>a Lima</span></div><div className="example-stack"><p lang="es">Ayer trabajé hasta las seis.</p><small>Вчера я работал до шести.</small><p lang="es">La película terminó tarde.</p><small>Фильм закончился поздно.</small></div></RuleCard>
            </div>
          </details>

          <details id="future" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="08 · Будущее" title="ir a + infinitivo"/>
            <div className="section-kicker">08 · Будущее</div><h2>ir a + infinitivo</h2><p className="section-intro">Главный способ говорить о планах и ближайшем будущем в первоначальном ядре.</p>
            <div className="pattern-rule-card"><span className="pattern-label">PATTERN</span><div className="pattern-formula"><span lang="es" className="irregular-text">voy / vas / va</span><b lang="es">a</b><span lang="es" className="pattern-slot">{`{infinitivo}`}</span></div><div className="pattern-examples"><p lang="es">Voy a llamar esta noche.</p><span>Я позвоню сегодня вечером.</span><p lang="es">Vamos a comer aquí.</p><span>Мы поедим здесь.</span></div></div>
          </details>

          <details id="conditional" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="09 · Условное наклонение" title="Вежливость и гипотеза"/>
            <div className="section-kicker">09 · Условное наклонение</div><h2>Вежливость и гипотеза</h2><p className="section-intro">Окончания добавляются ко всему инфинитиву. Для начала особенно полезны вежливые формы <b>quisiera</b> и <b>me gustaría</b>.</p>
            <div className="conditional-strip"><span lang="es">hablar</span><b>+</b><span className="ending-pill">ía</span><span className="ending-pill">ías</span><span className="ending-pill">ía</span><span className="ending-pill">íamos</span><span className="ending-pill">ían</span></div>
            <div className="contrast-grid"><div><span className="mini-label purple">вежливая просьба</span><p lang="es">Quisiera un café, por favor.</p><small>Я хотел бы кофе, пожалуйста.</small></div><div><span className="mini-label purple">желание</span><p lang="es">Me gustaría viajar más.</p><small>Мне хотелось бы больше путешествовать.</small></div></div>
          </details>

          <details id="imperative" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="10 · Повелительное наклонение" title="Просьба, совет и команда"/>
            <div className="section-kicker">10 · Повелительное наклонение</div><h2>Просьба, совет и команда</h2><p className="section-intro">Для начала достаточно трёх обращений: неформального <b>tú</b>, вежливого <b>usted</b> и множественного <b>ustedes</b>. Личное местоимение обычно не произносится.</p>
            <div className="rule-grid two">
              <div className="table-card responsive-table imperative-table"><table><thead><tr><th></th><th>hablar</th><th>comer</th><th>vivir</th></tr></thead><tbody><tr><td>tú</td><td>{endings({root:"habl",end:"a"})}</td><td>{endings({root:"com",end:"e"})}</td><td>{endings({root:"viv",end:"e"})}</td></tr><tr><td>usted</td><td>{endings({root:"habl",end:"e"})}</td><td>{endings({root:"com",end:"a"})}</td><td>{endings({root:"viv",end:"a"})}</td></tr><tr><td>ustedes</td><td>{endings({root:"habl",end:"en"})}</td><td>{endings({root:"com",end:"an"})}</td><td>{endings({root:"viv",end:"an"})}</td></tr></tbody></table></div>
              <RuleCard icon={Megaphone} kicker="отрицательная просьба" title="no + особая форма"><div className="example-stack"><p lang="es">No habl<span className="ending-text">es</span> tan rápido.</p><small>Не говори так быстро.</small><p lang="es">No com<span className="ending-text">a</span> aquí.</p><small>Не ешьте здесь.</small><p lang="es">No olvid<span className="ending-text">en</span> las llaves.</p><small>Не забудьте ключи.</small></div><Note>Эти отрицательные формы совпадают с presente de subjuntivo. В ядре их можно запомнить как готовые командные окончания, не изучая пока всё наклонение.</Note></RuleCard>
            </div>
            <div className="imperative-irregular"><div className="table-title">Ключевые неправильные формы tú</div><div className="irregular-command-grid">{[["decir","di"],["hacer","haz"],["ir","ve"],["poner","pon"],["salir","sal"],["ser","sé"],["tener","ten"],["venir","ven"]].map(([verb,form])=><span key={verb}><small lang="es">{verb}</small><b className="irregular-text" lang="es">{form}</b></span>)}</div></div>
            <div className="contrast-grid"><div><span className="mini-label purple">местоимение после команды</span><p lang="es">Dime la verdad.</p><small>Скажи мне правду.</small></div><div><span className="mini-label purple">вежливая просьба</span><p lang="es">Repita más despacio, por favor.</p><small>Повторите помедленнее, пожалуйста.</small></div></div>
          </details>

          <details id="irregular" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="11 · Частотные исключения" title="Основные неправильные глаголы"/>
            <div className="section-kicker">11 · Частотные исключения</div><h2>Основные неправильные глаголы</h2><p className="section-intro">Зелёным показаны формы, которые нельзя надёжно получить по регулярной модели.</p>
            <div className="table-card responsive-table irregular-table"><table><thead><tr><th>Глагол</th><th>yo</th><th>tú</th><th>él / usted</th><th>Прошедшее yo</th></tr></thead><tbody><tr><td lang="es">ser</td><td className="irregular-text">soy</td><td className="irregular-text">eres</td><td className="irregular-text">es</td><td className="irregular-text">fui</td></tr><tr><td lang="es">estar</td><td className="irregular-text">estoy</td><td>estás</td><td>está</td><td className="irregular-text">estuve</td></tr><tr><td lang="es">tener</td><td className="irregular-text">tengo</td><td className="irregular-text">tienes</td><td className="irregular-text">tiene</td><td className="irregular-text">tuve</td></tr><tr><td lang="es">ir</td><td className="irregular-text">voy</td><td className="irregular-text">vas</td><td className="irregular-text">va</td><td className="irregular-text">fui</td></tr><tr><td lang="es">hacer</td><td className="irregular-text">hago</td><td>haces</td><td>hace</td><td className="irregular-text">hice</td></tr><tr><td lang="es">poder</td><td className="irregular-text">puedo</td><td className="irregular-text">puedes</td><td className="irregular-text">puede</td><td className="irregular-text">pude</td></tr><tr><td lang="es">decir</td><td className="irregular-text">digo</td><td className="irregular-text">dices</td><td className="irregular-text">dice</td><td className="irregular-text">dije</td></tr></tbody></table></div>
            <a className="inline-callout" href="/es-419/lexicon/?q=ser"><span><MessageSquareText size={19} /><b>Открыть формы в словарных статьях</b></span><ArrowRight size={17} /></a>
          </details>

          <details id="patterns" className="grammar-section grammar-spoiler">
            <SpoilerSummary kicker="12 · Немедленная речь" title="Основные паттерны"/>
            <div className="section-kicker">12 · Немедленная речь</div><h2>Основные паттерны</h2><p className="section-intro">Паттерн можно использовать раньше, чем вы изучите полное объяснение всех его частей.</p>
            <div className="pattern-grid">
              {[['Quiero {infinitivo}.','желание','Quiero aprender español.'],['No puedo {infinitivo}.','возможность','No puedo hablar ahora.'],['Tengo que {infinitivo}.','необходимость','Tengo que salir temprano.'],['Me gusta {sustantivo}.','предпочтение','Me gusta esta canción.'],['Creo que {frase}.','мнение','Creo que va a llover.'],['¿Dónde está {lugar}?','местонахождение','¿Dónde está el baño?']].map(([pattern,fn,example]) => <a href="/es-419/patterns/" className="pattern-tile" key={pattern}><span>{fn}</span><h3 lang="es">{pattern}</h3><p lang="es">{example}</p><ArrowRight size={16} /></a>)}
            </div>
          </details>
        </article>
        <PageToc items={toc} />
      </div>
    </div>
  );
}
