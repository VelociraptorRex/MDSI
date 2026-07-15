import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Gauge, Hash, Layers3, LayoutGrid, RefreshCw, RotateCcw, SlidersHorizontal, Volume2, Waypoints, X } from "lucide-react";
import conjugations from "../data/conjugations.json";
import { getVerbKind, VERB_KIND_OPTIONS } from "../utils/verbClassification";
import { speakSpanish, stopSpeech } from "../utils/speech";
import { getTenseForms, getTenseOption, TENSE_OPTIONS } from "./VerbConjugationTables";

const DIFFICULTIES = [
  { id: "easy", label: "Лёгкий", description: "Инфинитив, время и дополнительные формы" },
  { id: "medium", label: "Средний", description: "Инфинитив, время и наклонение" },
  { id: "hard", label: "Сложный", description: "Формы и отдельный инфинитив; максимум 4 пропуска" }
];

const DISPLAY_MODES = [
  { id: "grid", label: "Сетка", icon: LayoutGrid },
  { id: "carousel", label: "Карусель", icon: Layers3 }
];

const MOOD_GROUPS = [
  ["indicative", "Indicativo"],
  ["subjunctive", "Subjuntivo"],
  ["imperative", "Imperativo"]
];

const ALL_VERBS = Object.entries(conjugations).map(([lemma, table]) => ({ lemma, table, kind: getVerbKind(lemma, table) }));

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const normalizeForm = (value) => value.trim().toLocaleLowerCase("es").replace(/\s+/g, " ");

const requestedTense = () => {
  if (typeof window === "undefined") return "indicative.Presente";
  const requested = new URLSearchParams(window.location.search).get("tense");
  return TENSE_OPTIONS.some((option) => option.id === requested) ? requested : "indicative.Presente";
};

function buildTasks({ verbCount, gapCount, difficulty, selectedTenses, verbPool }) {
  return shuffle(verbPool).slice(0, verbCount).map(({ lemma, table }, taskIndex) => {
    const option = getTenseOption(selectedTenses[Math.floor(Math.random() * selectedTenses.length)]);
    const forms = getTenseForms(table, option);
    const limit = Math.min(gapCount, forms.length, difficulty === "hard" ? 4 : 6);
    const gaps = new Set(shuffle(forms.map((_, index) => index)).slice(0, limit));
    return { id: `${taskIndex}-${lemma}-${option.id}`, number: taskIndex + 1, lemma, table, option, forms, gaps };
  });
}

function NumberTiles({ value, max, onChange, label }) {
  return (
    <div className="conjugation-number-tiles" role="group" aria-label={label}>
      {Array.from({ length: max }, (_, index) => index + 1).map((number) => (
        <button className={value === number ? "active" : ""} onClick={() => onChange(number)} aria-pressed={value === number} key={number}>{number}</button>
      ))}
    </div>
  );
}

const clampVerbCount = (value, min, max) => Math.min(max, Math.max(min, Number.parseInt(value, 10) || min));

function VerbCountControl({ value, min = 5, max, onChange }) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const next = clampVerbCount(draft, min, max);
    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className="verb-count-control">
      <div className="verb-count-range">
        <small>{min}</small>
        <input type="range" min={min} max={max} step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label="Количество глаголов"/>
        <small>{max}</small>
      </div>
      <label>
        <span>Точно</span>
        <input
          type="number"
          min={min}
          max={max}
          step="1"
          inputMode="numeric"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
              event.currentTarget.blur();
            }
          }}
          aria-label="Точное количество глаголов"
        />
      </label>
    </div>
  );
}

function ConjugationTaskCard({ task, difficulty, onResult, onComplete, onSpeak }) {
  const [answers, setAnswers] = useState({});
  const [states, setStates] = useState({});
  const refs = useRef([]);
  const infinitiveRef = useRef(null);
  const completedRef = useRef(false);
  const gapIndexes = [...task.gaps].sort((a, b) => a - b);
  const infinitive = task.table.nonFinite.Infinitivo;
  const requiredAnswers = task.gaps.size + (difficulty === "hard" ? 1 : 0);

  useEffect(() => {
    if (!completedRef.current && Object.keys(states).length === requiredAnswers) {
      completedRef.current = true;
      onComplete(task.id, Object.values(states).every((state) => state === "correct"));
    }
  }, [states, requiredAnswers, onComplete, task.id]);

  const check = (index, moveNext = false) => {
    if (states[index] || !answers[index]?.trim()) return;
    const correct = normalizeForm(answers[index]) === normalizeForm(task.forms[index]);
    setStates((current) => ({ ...current, [index]: correct ? "correct" : "wrong" }));
    onResult(`${task.id}-${index}`, correct);
    if (moveNext) {
      const nextIndex = gapIndexes[gapIndexes.indexOf(index) + 1];
      window.setTimeout(() => refs.current[nextIndex]?.focus(), 0);
    }
  };

  const checkInfinitive = (moveNext = false) => {
    if (states.infinitive || !answers.infinitive?.trim()) return;
    const correct = normalizeForm(answers.infinitive) === normalizeForm(infinitive);
    setStates((current) => ({ ...current, infinitive: correct ? "correct" : "wrong" }));
    onResult(`${task.id}-infinitive`, correct);
    if (moveNext) window.setTimeout(() => refs.current[gapIndexes[0]]?.focus(), 0);
  };

  return (
    <article className={`conjugation-task-card difficulty-${difficulty}`}>
      <header>
        <div>
          <small>{difficulty === "hard" ? "Определите глагол и форму" : `${task.option.label} · ${task.option.ru}`}</small>
          <h3 lang="es">{difficulty === "hard" ? `Карточка ${String(task.number).padStart(2, "0")}` : task.lemma}</h3>
          {difficulty !== "hard" && <span>{task.option.moodLabel} · {task.option.moodRu}</span>}
        </div>
        <div className="conjugation-card-actions">
          <button type="button" className="conjugation-speech-button" onClick={onSpeak} aria-label={`Озвучить глагол ${task.lemma}`} title="Озвучить глагол"><Volume2 size={15}/></button>
          <span className="conjugation-card-count"><Hash size={13}/>{requiredAnswers} отв.</span>
        </div>
      </header>

      {difficulty === "hard" && (
        <div className={`hard-infinitive-row ${states.infinitive || ""}`}>
          <span>Infinitivo</span>
          {!states.infinitive && (
            <input
              ref={infinitiveRef}
              value={answers.infinitive || ""}
              onChange={(event) => setAnswers((current) => ({ ...current, infinitive: event.target.value }))}
              onBlur={() => checkInfinitive()}
              onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); checkInfinitive(true); } }}
              placeholder="инфинитив"
              lang="es"
              autoComplete="off"
            />
          )}
          {states.infinitive === "correct" && <span className="checked-form"><b lang="es">{answers.infinitive}</b><CheckCircle2 size={17}/></span>}
          {states.infinitive === "wrong" && <span className="corrected-form"><del lang="es">{answers.infinitive}</del><b lang="es">{infinitive}</b><X size={16}/></span>}
        </div>
      )}

      {difficulty === "easy" && (
        <div className="conjugation-form-hints">
          <span><small>Infinitivo</small><b lang="es">{task.table.nonFinite.Infinitivo}</b></span>
          <span><small>Gerundio</small><b lang="es">{task.table.nonFinite.Gerundio}</b></span>
          <span><small>Participio</small><b lang="es">{task.table.nonFinite.Participio}</b></span>
        </div>
      )}

      <div className="conjugation-answer-table">
        <div className="conjugation-answer-heading">
          <span>Лицо</span><span>{difficulty === "hard" ? "Форма" : `${task.option.label} · ${task.option.moodLabel}`}</span>
        </div>
        {task.option.persons.map((person, index) => {
          const state = states[index];
          const isGap = task.gaps.has(index);
          return (
            <div className={`conjugation-answer-row ${state || ""}`} key={`${task.id}-${person}`}>
              <span>{person}</span>
              {!isGap && <b lang="es">{task.forms[index]}</b>}
              {isGap && !state && (
                <input
                  ref={(element) => { refs.current[index] = element; }}
                  value={answers[index] || ""}
                  onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))}
                  onBlur={() => check(index)}
                  onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); check(index, true); } }}
                  placeholder={`форма · ${person}`}
                  lang="es"
                  autoComplete="off"
                />
              )}
              {state === "correct" && <span className="checked-form"><b lang="es">{answers[index]}</b><CheckCircle2 size={17}/></span>}
              {state === "wrong" && <span className="corrected-form"><del lang="es">{answers[index]}</del><b lang="es">{task.forms[index]}</b><X size={16}/></span>}
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function ConjugationPractice({ session, onProgress }) {
  const [gapCount, setGapCount] = useState(3);
  const [difficulty, setDifficulty] = useState("medium");
  const [verbCount, setVerbCount] = useState(15);
  const [displayMode, setDisplayMode] = useState("carousel");
  const [selectedTenses, setSelectedTenses] = useState(() => [requestedTense()]);
  const [selectedVerbKinds, setSelectedVerbKinds] = useState([]);
  const [retryVerbLemmas, setRetryVerbLemmas] = useState(null);
  const [configuration, setConfiguration] = useState(0);
  const [results, setResults] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());
  const completedTaskIdsRef = useRef(new Set());
  const previousVerbCountRef = useRef(15);
  const autoAdvanceTimerRef = useRef(null);
  const resultRef = useRef(null);
  const wheelLockRef = useRef(0);
  const touchStartRef = useRef(null);

  const verbCounts = useMemo(() => Object.fromEntries(VERB_KIND_OPTIONS.map((option) => [option.id, ALL_VERBS.filter((verb) => verb.kind === option.id).length])), []);
  const baseVerbPool = useMemo(() => selectedVerbKinds.length ? ALL_VERBS.filter((verb) => selectedVerbKinds.includes(verb.kind)) : ALL_VERBS, [selectedVerbKinds]);
  const verbPool = useMemo(() => retryVerbLemmas
    ? ALL_VERBS.filter((verb) => retryVerbLemmas.includes(verb.lemma))
    : baseVerbPool, [baseVerbPool, retryVerbLemmas]);
  const minVerbCount = retryVerbLemmas ? 1 : 5;
  const maxVerbCount = Math.min(100, verbPool.length);

  const tasks = useMemo(
    () => buildTasks({ verbCount, gapCount, difficulty, selectedTenses, verbPool }),
    [session, configuration, verbCount, gapCount, difficulty, selectedTenses, verbPool]
  );
  const total = tasks.reduce((sum, task) => sum + task.gaps.size + (difficulty === "hard" ? 1 : 0), 0);
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const isFinished = total > 0 && answered === total;
  const mistakeLemmas = useMemo(() => tasks
    .filter((task) => Object.entries(results).some(([id, value]) => id.startsWith(`${task.id}-`) && !value))
    .map((task) => task.lemma), [results, tasks]);
  const generationKey = `${session}-${configuration}-${verbCount}-${gapCount}-${difficulty}-${selectedTenses.join("_")}-${selectedVerbKinds.join("_") || "all"}-${retryVerbLemmas?.join("_") || "standard"}`;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearAutoAdvance();
    stopSpeech();
    setResults({});
    setActiveIndex(0);
    completedTaskIdsRef.current = new Set();
    setCompletedTaskIds(new Set());
  }, [tasks, clearAutoAdvance]);

  useEffect(() => () => {
    clearAutoAdvance();
    stopSpeech();
  }, [clearAutoAdvance]);

  useEffect(() => {
    if (isFinished) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isFinished]);

  useEffect(() => {
    onProgress({ correct: Object.values(results).filter(Boolean).length, answered: Object.keys(results).length, total });
  }, [results, total, onProgress]);

  useEffect(() => {
    if (verbCount > maxVerbCount) setVerbCount(maxVerbCount);
  }, [verbCount, maxVerbCount]);

  const record = (id, correct) => setResults((current) => {
    if (Object.hasOwn(current, id)) return current;
    return { ...current, [id]: correct };
  });

  const navigate = useCallback((direction) => {
    clearAutoAdvance();
    setActiveIndex((current) => Math.min(tasks.length - 1, Math.max(0, current + direction)));
  }, [clearAutoAdvance, tasks.length]);

  const goToIndex = useCallback((index) => {
    clearAutoAdvance();
    setActiveIndex(Math.min(tasks.length - 1, Math.max(0, index)));
  }, [clearAutoAdvance, tasks.length]);

  useEffect(() => {
    if (displayMode !== "carousel") return undefined;
    const handleArrowNavigation = (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
      const section = document.getElementById("conjugations");
      const rect = section?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", handleArrowNavigation);
    return () => window.removeEventListener("keydown", handleArrowNavigation);
  }, [displayMode, navigate]);

  const completeTask = useCallback((taskId, allCorrect) => {
    const updated = new Set(completedTaskIdsRef.current);
    updated.add(taskId);
    completedTaskIdsRef.current = updated;
    setCompletedTaskIds(updated);
    const completedIndex = tasks.findIndex((task) => task.id === taskId);
    if (allCorrect && completedIndex >= 0) speakSpanish(tasks[completedIndex].lemma);
    if (displayMode !== "carousel" || !allCorrect || completedIndex < 0 || updated.size === tasks.length) return;

    clearAutoAdvance();
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      setActiveIndex((current) => {
        if (completedIndex !== current) return current;
        for (let step = 1; step <= tasks.length; step += 1) {
          const candidate = (completedIndex + step) % tasks.length;
          if (!updated.has(tasks[candidate].id)) return candidate;
        }
        return current;
      });
    }, 1200);
  }, [clearAutoAdvance, displayMode, tasks]);

  const changeDifficulty = (value) => {
    clearAutoAdvance();
    setDifficulty(value);
    if (value === "hard" && gapCount > 4) setGapCount(4);
  };

  const changeDisplayMode = (value) => {
    clearAutoAdvance();
    setDisplayMode(value);
  };

  const startNewSet = () => {
    clearAutoAdvance();
    stopSpeech();
    if (retryVerbLemmas) {
      const restored = Math.min(Math.max(5, previousVerbCountRef.current), Math.min(100, baseVerbPool.length));
      setRetryVerbLemmas(null);
      setVerbCount(restored);
    }
    setConfiguration((value) => value + 1);
  };

  const startMistakeSet = () => {
    if (!mistakeLemmas.length) return;
    if (!retryVerbLemmas) previousVerbCountRef.current = verbCount;
    clearAutoAdvance();
    stopSpeech();
    setRetryVerbLemmas([...mistakeLemmas]);
    setVerbCount(mistakeLemmas.length);
  };

  const toggleTense = (id) => {
    setSelectedTenses((current) => current.includes(id)
      ? (current.length === 1 ? current : current.filter((item) => item !== id))
      : [...current, id]);
  };

  const toggleVerbKind = (id) => {
    setSelectedVerbKinds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      const available = next.length ? ALL_VERBS.filter((verb) => next.includes(verb.kind)).length : ALL_VERBS.length;
      setVerbCount((count) => Math.min(count, Math.min(100, available)));
      return next;
    });
  };

  const handleWheel = (event) => {
    if (displayMode !== "carousel" || Math.abs(event.deltaX) < 24 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const now = Date.now();
    if (now - wheelLockRef.current < 420) return;
    wheelLockRef.current = now;
    navigate(event.deltaX > 0 ? 1 : -1);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleTouchEnd = (event) => {
    if (displayMode !== "carousel" || !touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) navigate(dx < 0 ? 1 : -1);
  };

  return (
    <div className="conjugation-practice">
      <div className="conjugation-settings-grid">
        <section className="conjugation-setting-card">
          <span><SlidersHorizontal size={15}/> Количество пропусков</span>
          <NumberTiles value={gapCount} max={difficulty === "hard" ? 4 : 6} onChange={setGapCount} label="Количество пропусков"/>
          <small>{difficulty === "hard" ? "На сложном уровне доступно не более четырёх." : "От одного до шести; в короткой парадигме — не больше числа строк."}</small>
        </section>
        <section className="conjugation-setting-card">
          <span><Gauge size={15}/> Уровень сложности</span>
          <div className="difficulty-tiles">
            {DIFFICULTIES.map((item) => <button className={difficulty === item.id ? "active" : ""} onClick={() => changeDifficulty(item.id)} title={item.description} aria-pressed={difficulty === item.id} key={item.id}>{item.label}</button>)}
          </div>
          <small>{DIFFICULTIES.find((item) => item.id === difficulty)?.description}</small>
        </section>
        <section className="conjugation-setting-card">
          <span><Hash size={15}/> Количество глаголов</span>
          <VerbCountControl value={verbCount} min={minVerbCount} max={maxVerbCount} onChange={setVerbCount}/>
          <small>{retryVerbLemmas ? `Повтор ошибок: доступны только ${maxVerbCount} отмеченных глаголов.` : `Доступно от 5 до ${maxVerbCount}; предел зависит от выбранных типов спряжения.`}</small>
        </section>
        <section className="conjugation-setting-card">
          <span><Layers3 size={15}/> Представление карточек</span>
          <div className="display-mode-tiles">
            {DISPLAY_MODES.map(({ id, label, icon: Icon }) => <button className={displayMode === id ? "active" : ""} onClick={() => changeDisplayMode(id)} aria-pressed={displayMode === id} key={id}><Icon size={15}/>{label}</button>)}
          </div>
          <small>{displayMode === "carousel" ? "Карточки идут веером; доступны клик, жест и стрелки." : "Все карточки показаны обычной сеткой."}</small>
        </section>
        <section className="conjugation-setting-card tense-setting-card">
          <span><Check size={15}/> Времена в заданиях</span>
          <div className="tense-pool">
            {MOOD_GROUPS.map(([mood, label]) => (
              <div className="tense-pool-group" key={mood}>
                <b>{label}</b>
                <div>{TENSE_OPTIONS.filter((item) => item.mood === mood).map((item) => <button className={selectedTenses.includes(item.id) ? "active" : ""} onClick={() => toggleTense(item.id)} aria-pressed={selectedTenses.includes(item.id)} key={item.id}>{item.label}</button>)}</div>
              </div>
            ))}
          </div>
          <small>Синяя плитка включена в пул. Хотя бы одна плитка всегда остаётся активной.</small>
        </section>
        <section className="conjugation-setting-card verb-kind-setting-card">
          <span><Waypoints size={15}/> Тип спряжения</span>
          <div className="verb-kind-pool" role="group" aria-label="Типы спряжения">
            {VERB_KIND_OPTIONS.map((item) => <button className={selectedVerbKinds.includes(item.id) ? "active" : ""} onClick={() => toggleVerbKind(item.id)} aria-pressed={selectedVerbKinds.includes(item.id)} key={item.id}><b>{item.label}</b><span>{item.hint} · {verbCounts[item.id]}</span></button>)}
          </div>
          <small>{selectedVerbKinds.length ? `Активно: ${selectedVerbKinds.length}. В доступном банке ${verbPool.length} глаголов.` : `Ничего не выбрано: используются все ${ALL_VERBS.length} глаголов в случайном порядке.`}</small>
        </section>
      </div>

      <div className="conjugation-task-toolbar">
        <span>{tasks.length} глаголов · {selectedTenses.length} форм в пуле · {total} ответов{retryVerbLemmas ? " · повтор ошибок" : ""}</span>
        <button onClick={startNewSet}><RefreshCw size={15}/> Другие глаголы</button>
      </div>

      <div className={`conjugation-task-grid mode-${displayMode}`} onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} aria-live="polite">
        {tasks.map((task, index) => {
          const offset = index - activeIndex;
          const distance = Math.abs(offset);
          const carouselStyle = displayMode === "carousel" ? {
            transform: `translateX(${offset * 74}px) translateZ(${-distance * 24}px) rotateY(${offset === 0 ? 0 : offset > 0 ? -1.6 : 1.6}deg) scale(${1 - Math.min(distance, 2) * 0.035})`,
            zIndex: 100 - distance,
            opacity: distance > 2 ? 0 : 1,
            visibility: distance > 2 ? "hidden" : "visible"
          } : undefined;
          const inactive = displayMode === "carousel" && index !== activeIndex;
          return (
            <div className={`carousel-card-shell ${index === activeIndex ? "is-active" : ""} ${completedTaskIds.has(task.id) ? "is-complete" : ""}`} style={carouselStyle} key={`${generationKey}-${task.id}`}>
              <div className="carousel-card-content" inert={inactive ? "" : undefined} aria-hidden={inactive || undefined}>
                <ConjugationTaskCard task={task} difficulty={difficulty} onResult={record} onComplete={completeTask} onSpeak={() => speakSpanish(task.lemma)}/>
              </div>
              {inactive && distance <= 2 && <button className="carousel-card-hit" onClick={() => goToIndex(index)} aria-label={`Открыть карточку ${index + 1}: ${difficulty === "hard" ? "скрытый глагол" : task.lemma}`}/>}
            </div>
          );
        })}
      </div>

      {displayMode === "carousel" && (
        <div className="conjugation-carousel-nav">
          <button onClick={() => navigate(-1)} disabled={activeIndex === 0} aria-label="Предыдущая карточка"><ChevronLeft size={18}/></button>
          <span><b>{activeIndex + 1}</b> / {tasks.length}<small>{completedTaskIds.size} заполнено</small></span>
          <button onClick={() => navigate(1)} disabled={activeIndex === tasks.length - 1} aria-label="Следующая карточка"><ChevronRight size={18}/></button>
        </div>
      )}

      {isFinished && (
        <div className="conjugation-finish" ref={resultRef} tabIndex="-1">
          <span><CheckCircle2 size={24}/></span>
          <small>Практика 04 завершена</small>
          <h3>{correct} из {total}</h3>
          <p>форм заполнено правильно</p>
          <div className="conjugation-finish-actions">
            <button type="button" onClick={startNewSet}><RefreshCw size={16}/> Новый набор глаголов</button>
            <button type="button" className="mistake-set-button" onClick={startMistakeSet} disabled={!mistakeLemmas.length}><RotateCcw size={16}/>{mistakeLemmas.length ? `Повторить ошибки · ${mistakeLemmas.length}` : "Ошибок нет"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
