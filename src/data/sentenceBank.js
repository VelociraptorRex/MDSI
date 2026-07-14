import lexicon from "./lexicon.json" with { type: "json" };

// Редакторские фразы дополняются примерами всех 500 словарных статей.
// Пунктуация удаляется только в режиме конструктора предложений.
const curatedSentenceBank = [
  { id:"b01", es:"Quiero aprender español.", ru:"Я хочу выучить испанский.", focus:"желание" },
  { id:"b02", es:"¿Dónde está la estación?", ru:"Где находится вокзал?", focus:"вопрос" },
  { id:"b03", es:"Vamos a comer aquí.", ru:"Мы собираемся поесть здесь.", focus:"будущее" },
  { id:"b04", es:"Me gustan las películas antiguas.", ru:"Мне нравятся старые фильмы.", focus:"gustar" },
  { id:"b05", es:"Ayer trabajé hasta las seis.", ru:"Вчера я работал до шести.", focus:"прошлое" },
  { id:"b06", es:"Aquí no se puede fumar.", ru:"Здесь нельзя курить.", focus:"безличная конструкция" },
  { id:"b07", es:"Tengo que salir temprano.", ru:"Мне нужно уйти рано.", focus:"необходимость" },
  { id:"b08", es:"Hay una farmacia cerca.", ru:"Рядом есть аптека.", focus:"наличие" },
  { id:"b09", es:"Creo que es una buena idea.", ru:"Думаю, это хорошая идея.", focus:"мнение" },
  { id:"b10", es:"Puedo ayudarte mañana.", ru:"Я могу помочь тебе завтра.", focus:"возможность" },
  { id:"b11", es:"Vivimos aquí desde hace dos años.", ru:"Мы живём здесь уже два года.", focus:"длительность" },
  { id:"b12", es:"¿Cuánto cuestan estos zapatos?", ru:"Сколько стоят эти ботинки?", focus:"цена" },
  { id:"b13", es:"Acabamos de llegar al hotel.", ru:"Мы только что приехали в отель.", focus:"недавнее действие" },
  { id:"b14", es:"Si quieres, vamos juntos.", ru:"Если хочешь, пойдём вместе.", focus:"условие" },
  { id:"b15", es:"La oficina está en el tercer piso.", ru:"Офис находится на третьем этаже.", focus:"местонахождение" },
  { id:"b16", es:"Necesito comprar un cargador.", ru:"Мне нужно купить зарядку.", focus:"потребность" },
  { id:"b17", es:"¿Puede repetir más despacio?", ru:"Можете повторить помедленнее?", focus:"вежливая просьба" },
  { id:"b18", es:"No encuentro mis llaves.", ru:"Я не могу найти свои ключи.", focus:"отрицание" },
  { id:"b19", es:"Primero comemos y después salimos.", ru:"Сначала мы едим, а потом выходим.", focus:"последовательность" },
  { id:"b20", es:"Este libro es más fácil que el otro.", ru:"Эта книга легче другой.", focus:"сравнение" },
  { id:"b21", es:"Abre la ventana, por favor.", ru:"Открой окно, пожалуйста.", focus:"повелительное" },
  { id:"b22", es:"No hables tan rápido.", ru:"Не говори так быстро.", focus:"отрицательное повелительное" },
  { id:"b23", es:"Dime la verdad.", ru:"Скажи мне правду.", focus:"неправильное повелительное" },
  { id:"b24", es:"Esperen aquí un momento.", ru:"Подождите здесь минутку.", focus:"повелительное ustedes" }
];

const lexicalSentenceBank = lexicon
  .filter((item) => item.example && item.exampleRu)
  .map((item) => ({ id:`lex-${item.id}`, es:item.example, ru:item.exampleRu, focus:item.type, lemma:item.lemma }));

const seen = new Set();
export const sentenceBank = [...curatedSentenceBank, ...lexicalSentenceBank].filter((item) => {
  const key = item.es.trim().toLocaleLowerCase("es");
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
