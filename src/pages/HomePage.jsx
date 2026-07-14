import { ArrowRight, BookA, BookOpenCheck, Braces, BrainCircuit, CheckCircle2, ChevronRight, MessageCircle, Search, Sparkles, Target, TestTube2, Waypoints } from "lucide-react";

const sections = [
  { icon: BookA, number: "01", title: "Лексика", text: "500 самых частых слов испанского языка с формами, живыми примерами и озвучкой.", href: "/es-419/lexicon/", accent: "blue", meta: "500 статей" },
  { icon: BookOpenCheck, number: "02", title: "Грамматика", text: "Минимальный набор правил для настоящего, прошлого и будущего.", href: "/es-419/grammar/", accent: "red", meta: "15 тем" },
  { icon: Braces, number: "03", title: "Паттерны", text: "Готовые речевые конструкции, из которых собираются новые фразы.", href: "/es-419/patterns/", accent: "purple", meta: "32 модели" },
  { icon: MessageCircle, number: "04", title: "Диалоги", text: "Короткие естественные ситуации с контролем словаря.", href: "/es-419/dialogues/", accent: "green", meta: "8 ситуаций" },
  { icon: TestTube2, number: "05", title: "Практика", text: "Проверка узнавания, формы и самостоятельного ответа.", href: "/es-419/tests/", accent: "amber", meta: "2 187 в банке" },
  { icon: BrainCircuit, number: "06", title: "Карточки", text: "Готовые наборы Anki, Quizlet и Полиглот из общей базы слов, фраз и паттернов.", href: "/es-419/anki/", accent: "slate", meta: "3 формата" }
];

export function HomePage({ onOpenSearch }) {
  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span>ES·419</span> нейтральный латиноамериканский испанский</div>
            <h1>Испанский, сведённый<br />к <em>достаточному.</em></h1>
            <p className="hero-lead">Связанная база знаний, которая сокращает путь от первого слова до первой осмысленной коммуникации — без лишней теории.</p>
            <div className="hero-actions">
              <a className="button primary" href="/es-419/lexicon/">Открыть лексику <ArrowRight size={17} /></a>
              <button className="button secondary" onClick={onOpenSearch}><Search size={17} /> Найти материал</button>
            </div>
            <div className="hero-proof">
              <span><CheckCircle2 /> Только лексическое ядро</span>
              <span><CheckCircle2 /> Естественные примеры</span>
              <span><CheckCircle2 /> Карточки Anki, Quizlet и Полиглот</span>
            </div>
          </div>

          <div className="hero-showcase reveal delay-1" aria-label="Пример речевого паттерна">
            <div className="showcase-top"><span className="mini-label purple">паттерн желания</span><span className="showcase-id">PAT · 001</span></div>
            <div className="pattern-display" lang="es">Quier<span className="ending-text">o</span> <span className="pattern-slot">{`{acción}`}</span></div>
            <div className="pattern-translation">Я хочу <span>{`{действие}`}</span></div>
            <div className="showcase-divider" />
            <div className="example-pair">
              <div><span className="flag-dot">ES</span><p lang="es">Quiero comprar agua.</p></div>
              <div><span className="flag-dot muted">RU</span><p>Я хочу купить воды.</p></div>
            </div>
            <div className="showcase-links"><span><Waypoints size={15} /> 4 связанных правила</span><a href="/es-419/patterns/">Открыть <ChevronRight size={14} /></a></div>
          </div>
        </div>
        <div className="container stats-strip reveal delay-2">
          <div><strong>500</strong><span>лексических единиц</span></div>
          <div><strong>3</strong><span>времени</span></div>
          <div><strong>1</strong><span>система</span></div>
        </div>
      </section>

      <section className="section section-library">
        <div className="container">
          <div className="section-heading split">
            <div><div className="eyebrow neutral">База знаний</div><h2>Навигационная<br />карта языка.</h2></div>
            <p>Начни с любого вопроса, переходи между словами, правилами и паттернами.</p>
          </div>
          <div className="section-card-grid">
            {sections.map(({ icon: Icon, ...item }) => (
              <a className={`section-card accent-${item.accent}`} href={item.href} key={item.title}>
                <div className="section-card-top"><span className="card-number">{item.number}</span><span className="card-meta">{item.meta}</span></div>
                <span className="section-icon"><Icon size={24} /></span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <span className="card-link">Перейти <ArrowRight size={16} /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section methodology-section" id="method">
        <div className="container methodology-grid">
          <div className="method-copy">
            <div className="eyebrow neutral">Метод минимальной достаточности</div>
            <h2>Меньше материала.<br />Больше речевой свободы.</h2>
            <p>Каждый элемент проходит один практический тест: какие новые высказывания мы сможем составить после его освоения?</p>
            <a className="text-link" href="/es-419/sources/">Как устроен отбор <ArrowRight size={16} /></a>
          </div>
          <div className="method-list">
            <div className="method-item"><span><Target /></span><div><strong>Частотность + ценность</strong><p>Корпусные данные дополняются прозрачной редакторской оценкой применимости.</p></div></div>
            <div className="method-item"><span><Waypoints /></span><div><strong>Связи вместо изоляции</strong><p>Слово ведёт к форме, правило — к паттерну, паттерн — к живому примеру.</p></div></div>
            <div className="method-item"><span><Sparkles /></span><div><strong>Естественность прежде лимита</strong><p>Фраза должна звучать по-человечески, даже если ради этого понадобится слово вне ядра.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section start-section" id="future">
        <div className="container start-card">
          <div><span className="mini-label blue">Начать с лексического ядра</span><h2>Лексическая основа уже ждёт!</h2></div>
          <a className="button light" href="/es-419/lexicon/">Перейти к 500 единицам <ArrowRight size={17} /></a>
        </div>
      </section>
    </>
  );
}
