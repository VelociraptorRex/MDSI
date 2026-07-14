import { sentenceBank } from "./sentenceBank.js";
import lexicon from "./lexicon.json" with { type: "json" };

const curatedChoiceExercises = [
  { id:"c1", prompt:"Что означает «todavía»?", options:["ещё, всё ещё","никогда","сразу","слишком"], answer:0, explanation:"Todavía no estoy listo — Я ещё не готов." },
  { id:"c2", prompt:"Выберите естественный перевод: «Мне нужно уйти рано». ", options:["Tengo salir temprano.","Tengo que salir temprano.","Hay salir temprano.","Estoy salir temprano."], answer:1, explanation:"Личная необходимость выражается через tener que + infinitivo." },
  { id:"c3", prompt:"Какая фраза означает «Рядом есть аптека»?", options:["La farmacia es cerca.","Está una farmacia cerca.","Hay una farmacia cerca.","Tiene una farmacia cerca."], answer:2, explanation:"Наличие нового предмета выражается безличным hay." },
  { id:"c4", prompt:"Выберите правильную форму: «Мне нравятся старые фильмы». ", options:["Me gusta las películas antiguas.","Me gustan las películas antiguas.","Yo gusto las películas antiguas.","Me gustan la película antigua."], answer:1, explanation:"С существительным во множественном числе используется gustan." },
  { id:"c5", prompt:"Что лучше сказать официанту?", options:["Quiero café ahora.","Dame café.","Quisiera un café, por favor.","Tengo café."], answer:2, explanation:"Quisiera + существительное — нейтральная вежливая просьба." },
  { id:"c6", prompt:"Как сказать «Мы собираемся поесть здесь»?", options:["Estamos comer aquí.","Vamos a comer aquí.","Vamos comer aquí.","Fuimos a comer aquí."], answer:1, explanation:"Ближайшее будущее: форма ir + a + infinitivo." },
  { id:"c7", prompt:"Выберите завершённое действие в прошлом.", options:["Trabajo en casa.","Voy a trabajar en casa.","Trabajé en casa ayer.","Estoy trabajando en casa."], answer:2, explanation:"Trabajé — pretérito indefinido, ayer задаёт завершённый момент." },
  { id:"c8", prompt:"Что означает «Me parece buena idea»?", options:["Мне нужна хорошая идея.","Я придумал хорошую идею.","Мне кажется, это хорошая идея.","Мне не нравится эта идея."], answer:2, explanation:"Me parece + оценка — «мне кажется / представляется»." },
  { id:"c9", prompt:"Как спросить цену нескольких ботинок?", options:["¿Cuánto cuesta estos zapatos?","¿Cuántos cuestan estos zapatos?","¿Cuánto cuestan estos zapatos?","¿Qué precio cuestan?"], answer:2, explanation:"Cuánto остаётся в единственном числе как вопрос о сумме, а глагол согласуется: cuestan." },
  { id:"c10", prompt:"Выберите нейтральное множественное «вы» для es-419.", options:["vosotros","ustedes","ellos","nosotros"], answer:1, explanation:"В первоначальном латиноамериканском ядре активной формой является ustedes." },
  { id:"c11", prompt:"Как сказать «Я только что приехал»?", options:["Voy a llegar.","Acabo de llegar.","Vuelvo a llegar.","Dejo de llegar."], answer:1, explanation:"Acabar de + infinitivo обозначает совсем недавнее действие." },
  { id:"c12", prompt:"Выберите правильное реальное условие.", options:["Si tendré tiempo, te llamaré.","Si tengo tiempo, te llamo.","Si tengo tiempo, te llamaría ayer.","Si tiempo, llamo."], answer:1, explanation:"После si в реальном условии употребляется настоящее: si tengo…" },
  { id:"c13", prompt:"Как попросить друга открыть окно?", options:["Abres la ventana.","Abre la ventana, por favor.","Abrir la ventana.","Abra tú la ventana."], answer:1, explanation:"Утвердительная команда tú от abrir — abre." },
  { id:"c14", prompt:"Выберите вежливую команду для usted: «Повторите». ", options:["Repite.","Repites.","Repita.","Repetir."], answer:2, explanation:"Для usted у глагола -ir используется командное окончание -a: repita." },
  { id:"c15", prompt:"Какая форма означает «Не говори так быстро»?", options:["No habla tan rápido.","No hablar tan rápido.","No hables tan rápido.","No hable tú tan rápido."], answer:2, explanation:"Отрицательная команда tú: no + форма на -es → no hables." },
  { id:"c16", prompt:"Какая неправильная команда tú образована от decir?", options:["dice","diga","di","decir"], answer:2, explanation:"Утвердительная команда tú от decir — di: Dime la verdad." }
];

const typeFamily = (type) => {
  const value = type.toLowerCase();
  if (value.includes("глагол")) return "verb";
  if (value.includes("существитель")) return "noun";
  if (value.includes("прилагатель")) return "adjective";
  if (/артикль|предлог|союз|местоимение|определитель|числительное/.test(value)) return "function";
  return "expression";
};

const lexicalChoiceExercises = lexicon.map((item, index) => {
  const family = typeFamily(item.type);
  const pool = lexicon.filter((candidate) => typeFamily(candidate.type) === family && candidate.id !== item.id && candidate.translation !== item.translation);
  const distractors = [];
  for (let offset = 0; distractors.length < 3 && offset < pool.length; offset += 1) {
    const candidate = pool[(index * 7 + offset * 11) % pool.length]?.translation;
    if (candidate && !distractors.includes(candidate)) distractors.push(candidate);
  }
  return {
    id:`lc-${item.id}`,
    prompt:`Что означает «${item.lemma}»?`,
    options:[item.translation, ...distractors],
    answer:0,
    explanation:`${item.example} — ${item.exampleRu}`
  };
}).filter((item) => item.options.length === 4);

export const choiceExercises = [...curatedChoiceExercises, ...lexicalChoiceExercises];

const curatedFormExercises = [
  { id:"f1", prompt:"yo · tener · настоящее", answer:["tengo"], hint:"У глагола неправильная форма 1-го лица.", explanation:"tener → tengo" },
  { id:"f2", prompt:"tú · poder · настоящее", answer:["puedes"], hint:"В корне o меняется на ue.", explanation:"poder → puedes" },
  { id:"f3", prompt:"ustedes · hablar · настоящее", answer:["hablan"], hint:"Ustedes использует форму 3-го лица множественного числа.", explanation:"habl- + -an → hablan" },
  { id:"f4", prompt:"yo · trabajar · завершённое прошлое", answer:["trabajé","trabaje"], displayAnswer:"trabajé", hint:"Для yo у -ar окончание -é.", explanation:"trabaj- + -é → trabajé" },
  { id:"f5", prompt:"él · comer · завершённое прошлое", answer:["comió","comio"], displayAnswer:"comió", hint:"Для él/ella у -er окончание -ió.", explanation:"com- + -ió → comió" },
  { id:"f6", prompt:"nosotros · vivir · настоящее", answer:["vivimos"], hint:"Основа viv- и окончание -imos.", explanation:"viv- + -imos → vivimos" },
  { id:"f7", prompt:"ellos · ir · настоящее", answer:["van"], hint:"Полностью неправильная форма.", explanation:"ir → van" },
  { id:"f8", prompt:"la casa → множественное число", answer:["las casas"], hint:"Изменяются и артикль, и существительное.", explanation:"la casa → las casas" },
  { id:"f9", prompt:"tú · hablar · утвердительная команда", answer:["habla"], hint:"Совпадает с формой él/ella настоящего времени.", explanation:"hablar → habla" },
  { id:"f10", prompt:"usted · comer · вежливая команда", answer:["coma"], hint:"Для -er используется командное окончание -a.", explanation:"comer → coma" },
  { id:"f11", prompt:"ustedes · vivir · команда", answer:["vivan"], hint:"Для ustedes добавляется -an.", explanation:"vivir → vivan" },
  { id:"f12", prompt:"tú · hacer · утвердительная команда", answer:["haz"], hint:"Неправильная короткая форма.", explanation:"hacer → haz" },
  { id:"f13", prompt:"tú · decir · утвердительная команда", answer:["di"], hint:"Неправильная короткая форма.", explanation:"decir → di" },
  { id:"f14", prompt:"tú · hablar · отрицательная команда", answer:["no hables"], hint:"No + форма на -es.", explanation:"hablar → no hables" }
];

const lexicalFormExercises = lexicon.flatMap((item) => {
  const type = item.type.toLowerCase();
  const exercises = [];
  const firstBlock = item.forms.split(";")[0].split(",").map((part) => part.trim()).filter(Boolean);

  if (type.includes("глагол")) {
    const persons = ["yo", "tú", "él / ella / usted"];
    if (firstBlock.length >= 3) {
      firstBlock.slice(0, 3).forEach((form, index) => exercises.push({
        id:`vf-${item.id}-${index}`,
        prompt:`${persons[index]} · ${item.lemma} · настоящее`,
        answer:[form],
        hint:"Определите лицо и вспомните изменение основы и окончание.",
        explanation:`${item.lemma} → ${form}`
      }));
    } else if (firstBlock.length === 1 && firstBlock[0] !== item.lemma) {
      exercises.push({ id:`vf-${item.id}-3`, prompt:`él / ella · ${item.lemma} · настоящее`, answer:[firstBlock[0]], hint:"Глагол обычно употребляется в третьем лице.", explanation:`${item.lemma} → ${firstBlock[0]}` });
    } else if (firstBlock.length === 2) {
      exercises.push({ id:`vf-${item.id}-sg`, prompt:`${item.lemma} · с одним предметом`, answer:[firstBlock[0]], hint:"Нужна форма единственного числа.", explanation:`${item.lemma} → ${firstBlock[0]}` });
      exercises.push({ id:`vf-${item.id}-pl`, prompt:`${item.lemma} · с несколькими предметами`, answer:[firstBlock[1]], hint:"Нужна форма множественного числа.", explanation:`${item.lemma} → ${firstBlock[1]}` });
    }
  }

  if (type.includes("существитель")) {
    const allForms = item.forms.split(/[;,]/).map((part) => part.trim()).filter(Boolean);
    const singular = allForms.find((form) => /^(el|la)\s/i.test(form));
    const plural = allForms.find((form) => /^(los|las)\s/i.test(form));
    if (singular && plural) exercises.push({
      id:`nf-${item.id}`,
      prompt:`${singular} → множественное число`,
      answer:[plural],
      hint:"Измените артикль и существительное.",
      explanation:`${singular} → ${plural}`
    });
  }

  if (type.includes("прилагатель")) {
    const variants = firstBlock.filter((form) => !/\s/.test(form));
    if (variants.length >= 4) {
      [[1,"женский род, ед. число"],[2,"мужской род, мн. число"],[3,"женский род, мн. число"]].forEach(([index,label]) => exercises.push({
        id:`af-${item.id}-${index}`,
        prompt:`${item.lemma} · ${label}`,
        answer:[variants[index]],
        hint:"Согласуйте форму прилагательного по роду и числу.",
        explanation:`${item.lemma} → ${variants[index]}`
      }));
    } else if (variants.length >= 2 && variants[0] !== variants[1]) {
      exercises.push({ id:`af-${item.id}-pl`, prompt:`${item.lemma} · множественное число`, answer:[variants[1]], hint:"Образуйте форму множественного числа.", explanation:`${item.lemma} → ${variants[1]}` });
    }
  }

  return exercises;
});

export const formExercises = [...curatedFormExercises, ...lexicalFormExercises];

const withoutPunctuation = (text) => text.replace(/[¿?¡!.,;:]/g, "").replace(/\s+/g, " ").trim();
export const sentenceExercises = sentenceBank.map((item) => {
  const answer = withoutPunctuation(item.es).split(" ");
  return { id:`s-${item.id}`, translation:item.ru, focus:item.focus, tokens:[...answer], answer };
});

const curatedSituationExercises = [
  { id:"o1", situation:"Вы хотите вежливо заказать кофе с молоком.", useful:[{word:"quisiera",label:"глагол"},{word:"café",label:"существительное"}], sample:"Quisiera un café con leche, por favor.", translation:"Я хотел бы кофе с молоком, пожалуйста." },
  { id:"o2", situation:"Вы не расслышали и просите собеседника повторить медленнее.", useful:[{word:"repetir",label:"глагол"},{word:"despacio",label:"наречие"}], sample:"¿Puede repetir más despacio, por favor?", translation:"Можете повторить помедленнее, пожалуйста?" },
  { id:"o3", situation:"Вы говорите другу, что завтра можете помочь.", useful:[{word:"ayudar",label:"глагол"},{word:"mañana",label:"наречие"}], sample:"Puedo ayudarte mañana.", translation:"Я могу помочь тебе завтра." },
  { id:"o4", situation:"Вы спрашиваете, можно ли заплатить картой.", useful:[{word:"pagar",label:"глагол"},{word:"tarjeta",label:"существительное"}], sample:"¿Se puede pagar con tarjeta?", translation:"Можно заплатить картой?" },
  { id:"o5", situation:"Вы объясняете, что живёте здесь уже два года.", useful:[{word:"vivir",label:"глагол"},{word:"año",label:"существительное"}], sample:"Vivo aquí desde hace dos años.", translation:"Я живу здесь уже два года." },
  { id:"o6", situation:"Вы предлагаете вместе пойти в парк в субботу.", useful:[{word:"ir",label:"глагол"},{word:"parque",label:"существительное"}], sample:"Si quieres, vamos juntos al parque el sábado.", translation:"Если хочешь, пойдём вместе в парк в субботу." },
  { id:"o7", situation:"Вы просите друга открыть окно.", useful:[{word:"abrir",label:"глагол"},{word:"ventana",label:"существительное"}], sample:"Abre la ventana, por favor.", translation:"Открой окно, пожалуйста." },
  { id:"o8", situation:"Вы просите нескольких людей подождать здесь.", useful:[{word:"esperar",label:"глагол"},{word:"momento",label:"существительное"}], sample:"Esperen aquí un momento, por favor.", translation:"Подождите здесь минутку, пожалуйста." },
  { id:"o9", situation:"Вы советуете знакомому не работать так много.", useful:[{word:"trabajar",label:"глагол"},{word:"mucho",label:"наречие"}], sample:"No trabajes tanto hoy.", translation:"Не работай сегодня так много." },
  { id:"o10", situation:"Вы просите собеседника сказать правду.", useful:[{word:"decir",label:"глагол"},{word:"verdad",label:"существительное"}], sample:"Dime la verdad, por favor.", translation:"Скажи мне правду, пожалуйста." }
];

const hintLabels={verb:"глагол",noun:"существительное",adjective:"прилагательное"};
const normalizeWord=(value)=>value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zñü]+/g," ").trim();
const formVariants=(item)=>{
  const family=typeFamily(item.type);const parts=[item.lemma,...item.forms.split(/[;,]/)].map(normalizeWord).filter(Boolean);
  return parts.flatMap((part)=>{const words=part.split(" ").filter(Boolean);if(!words.length)return[];return family==="noun"?[words.at(-1)]:[words[0]]});
};
const appearsIn=(sample,item)=>{const tokens=new Set(normalizeWord(sample).split(" "));return formVariants(item).some((variant)=>tokens.has(variant))};
const situationHints=(source)=>{
  const allowed=["verb","noun","adjective"];const central=typeFamily(source.type);const order=[...(allowed.includes(central)?[central]:[]),...allowed.filter((family)=>family!==central)];const candidates=[source,...lexicon.filter((item)=>item.id!==source.id)];const selected=[];
  for(const family of order){const match=candidates.find((item)=>typeFamily(item.type)===family&&appearsIn(source.example,item)&&!selected.some((hint)=>hint.word===item.lemma));if(match)selected.push({word:match.lemma,label:hintLabels[family]});if(selected.length===2)break}
  if(!selected.length)selected.push({word:source.lemma,label:source.type.split(/[\/,]/)[0].trim()});
  return selected;
};

const lexicalSituationExercises = lexicon
  .filter((item) => item.example && item.exampleRu)
  .map((item) => ({
    id:`lo-${item.id}`,
    situation:`Передайте по-испански естественную мысль: «${item.exampleRu}»`,
    useful:situationHints(item),
    sample:item.example,
    translation:item.exampleRu
  }));

export const situationExercises = [...curatedSituationExercises, ...lexicalSituationExercises];
