import {
  ArrowRight,
  BrainCircuit,
  Braces,
  CheckCircle2,
  Database,
  Download,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Layers3,
  MessageSquareQuote,
  PackageCheck,
  Repeat2,
  Settings2,
  ShieldCheck
} from "lucide-react";
import { PageToc } from "../components/PageToc";
import manifest from "../data/ankiManifest.json";
import { sitePath } from "../utils/sitePath";

const toc = [
  { id:"deck-structure", label:"Состав карточек" },
  { id:"card-design", label:"Три формата" },
  { id:"installation", label:"Скачивание и импорт" },
  { id:"generation", label:"Архитектура данных" }
];

const ankiHref = sitePath(`/downloads/${manifest.filename}`);
const quizletHref = sitePath(`/downloads/${manifest.quizletFilename}`);
const polyglotHref = sitePath(`/downloads/${manifest.polyglotFilename}`);

export function AnkiPage() {
  return <div className="reference-page anki-page">
    <section className="page-hero anki-hero compact-hero">
      <div className="container">
        <div className="breadcrumbs"><a href={sitePath("/es-419/")}>Главная</a><span>/</span><span>Карточки</span></div>
        <div className="reference-hero-grid">
          <div>
            <div className="eyebrow"><span>Anki, Quizlet и Полиглот</span> MDSI v{manifest.version}</div>
            <h1>Повторение,<br/><em>встроенное в систему.</em></h1>
            <p>Лексика, естественные фразы и речевые паттерны собраны из тех же данных, что и на сайте. Выбирай удобный формат!</p>
            <div className="anki-hero-actions">
              <a className="button primary" href={ankiHref} download><FileArchive size={17}/> Anki · скачать .apkg</a>
              <a className="button secondary" href={quizletHref} download><FileText size={17}/> Quizlet · скачать .txt</a>
              <a className="button secondary" href={polyglotHref} download><FileSpreadsheet size={17}/> Полиглот · скачать .xls</a>
              <span><BrainCircuit size={15}/>{manifest.totalCards.toLocaleString("ru-RU")} в Anki · {manifest.quizletCards.toLocaleString("ru-RU")} в Quizlet и Полиглоте</span>
            </div>
          </div>
          <div className="hero-index-card anki-index-card">
            <div><Download size={18}/><span>Готовые карточки</span></div>
            <strong>3</strong>
            <p>формата из единой базы: Anki для интервальных повторений, Quizlet для импорта и Полиглот для работы с таблицей</p>
          </div>
        </div>
      </div>
    </section>

    <div className="container reference-layout">
      <article className="reference-content">
        <section id="deck-structure" className="grammar-section">
          <div className="section-kicker">Общая база</div>
          <h2>Что находится внутри</h2>
          <p className="section-intro">Все три формата собираются из одного содержания: различается только устройство карточек и способ импорта.</p>
          <div className="anki-deck-grid">
            <article><span><Layers3/></span><small>01 · Лексика</small><strong>{manifest.lexicalNotes.toLocaleString("ru-RU")}</strong><h3>Слова и выражения</h3><p>В Anki лексика получает два направления и развёрнутый оборот. В Quizlet и Полиглоте каждой единице соответствует одна строка «испанский — русский».</p></article>
            <article><span><MessageSquareQuote/></span><small>02 · Фразы</small><strong>{manifest.phraseCards.toLocaleString("ru-RU")}</strong><h3>Естественные предложения</h3><p>Цельные испанские фразы соединены с естественным русским переводом и не дублируются в обратном направлении.</p></article>
            <article><span><Braces/></span><small>03 · Паттерны</small><strong>{manifest.patternCards}</strong><h3>Продуктивные конструкции</h3><p>Испанский речевой каркас соединён с русским каркасом: одна конструкция — одна запись.</p></article>
          </div>
        </section>

        <section id="card-design" className="grammar-section">
          <div className="section-kicker">Три способа повторения</div>
          <h2>Как выглядят форматы</h2>
          <div className="anki-preview-grid">
            <article className="anki-preview-card">
              <div className="anki-preview-top"><span>Anki · развёрнутая карточка</span><small>ядро · № 21</small></div>
              <h3 lang="es">querer</h3><p>глагол</p>
              <div className="anki-answer"><strong>хотеть; желать</strong><span lang="es">quiero, quieres, quiere; quise; querido; queriendo</span><blockquote><b lang="es">Quiero aprender español.</b><small>Я хочу выучить испанский.</small></blockquote></div>
            </article>
            <article className="anki-preview-card phrase-preview">
              <div className="anki-preview-top"><span>Quizlet · одна пара</span><small>табуляция</small></div>
              <h3 lang="es">la casa</h3><p>испанский термин</p>
              <div className="anki-answer"><strong>дом</strong><span>Одна строка файла: <b lang="es">la casa</b> → дом. Обратного дубля нет.</span></div>
            </article>
            <article className="anki-preview-card phrase-preview">
              <div className="anki-preview-top"><span>Полиглот · строка таблицы</span><small>.xlsx</small></div>
              <h3 lang="es">la casa</h3><p>существительное, ж.р.</p>
              <div className="anki-answer"><strong>дом</strong><blockquote><b lang="es">Mi casa está cerca del parque.</b><small>Мой дом находится рядом с парком.</small></blockquote></div>
            </article>
          </div>
          <div className="anki-principles">
            <div><Repeat2/><span><b>Два направления в Anki</b>Узнавание не подменяет активное воспроизведение.</span></div>
            <div><ShieldCheck/><span><b>Одна запись в Quizlet</b>Без обратных дублей и лишних комментариев.</span></div>
            <div><FileSpreadsheet/><span><b>Готовая таблица Полиглота</b>Семь совместимых колонок и пустой прогресс.</span></div>
          </div>
        </section>

        <section id="installation" className="grammar-section">
          <div className="section-kicker">Три файла</div>
          <h2>Скачивание и импорт</h2>
          <div className="install-steps">
            <article><span>1</span><div><h3>Anki · пакет .apkg</h3><p>Файл <code>{manifest.filename}</code> содержит три подколоды, оформление и настройки интервального повторения.</p></div></article>
            <article><span>2</span><div><h3>Quizlet · текстовый файл</h3><p>В файле <code>{manifest.quizletFilename}</code> термин и перевод разделены табуляцией, а карточки — переносом строки.</p></div></article>
            <article><span>3</span><div><h3>Полиглот · таблица Excel</h3><p>Файл <code>{manifest.polyglotFilename}</code> содержит {manifest.polyglotCards.toLocaleString("ru-RU")} строк на листе <code>es</code>; столбец «Выучено» полностью пуст.</p></div></article>
          </div>
          <div className="anki-settings">
            <Settings2/>
            <div><strong>Одна база, три формата</strong><p>Anki содержит {manifest.totalCards.toLocaleString("ru-RU")} карточки с обратным направлением; Quizlet и Полиглот — по {manifest.quizletCards.toLocaleString("ru-RU")} уникальные записи без обратных дублей.</p></div>
            <div className="card-download-links">
              <a href={ankiHref} download>Anki .apkg <ArrowRight size={15}/></a>
              <a href={quizletHref} download>Quizlet .txt <ArrowRight size={15}/></a>
              <a href={polyglotHref} download>Полиглот .xls <ArrowRight size={15}/></a>
            </div>
          </div>
        </section>

        <section id="generation" className="grammar-section">
          <div className="section-kicker">Воспроизводимая база</div>
          <h2>Карточки не живут отдельно от сайта</h2>
          <div className="anki-pipeline">
            <div><Database/><strong>Общие данные</strong><span>500 статей · {manifest.phraseCards} фраз · {manifest.patternCards} паттерна</span></div>
            <ArrowRight/>
            <div><PackageCheck/><strong>Проверенные экспорты</strong><span>одинаковые термины, переводы и порядок</span></div>
            <ArrowRight/>
            <div><FileArchive/><strong>.apkg + .txt + .xlsx</strong><span>{manifest.totalCards.toLocaleString("ru-RU")} Anki · {manifest.quizletCards.toLocaleString("ru-RU")} Quizlet и Полиглот</span></div>
          </div>
          <div className="grammar-note tone-gray"><CheckCircle2 size={16}/><span>Команда <code>npm run generate:cards</code> пересобирает Anki и Quizlet. Строки таблицы Полиглота формируются из того же нормализованного набора <code>polyglotRows</code> при выпуске версии.</span></div>
        </section>
      </article>
      <PageToc items={toc}/>
    </div>
  </div>;
}
