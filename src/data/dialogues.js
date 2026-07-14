export const dialogues = [
  {
    id: "meeting", title: "Первое знакомство", situation: "Два человека знакомятся перед занятием.", level: "базовый", coverage: 100,
    goals: ["представиться", "назвать страну", "спросить собеседника"], patterns: ["me llamo…", "¿de dónde eres?", "soy de…"],
    lines: [
      ["Laura", "Hola, me llamo Laura. ¿Cómo te llamas?", "Привет, меня зовут Лаура. Как тебя зовут?"],
      ["Daniel", "Me llamo Daniel. Mucho gusto.", "Меня зовут Даниэль. Очень приятно."],
      ["Laura", "Mucho gusto. ¿De dónde eres?", "Очень приятно. Откуда ты?"],
      ["Daniel", "Soy de Colombia, pero vivo en Chile. ¿Y tú?", "Я из Колумбии, но живу в Чили. А ты?"],
      ["Laura", "Soy de México. Estoy aquí por trabajo.", "Я из Мексики. Я здесь по работе."],
      ["Daniel", "Qué bien. Nos vemos en clase.", "Здорово. Увидимся на занятии."]
    ], note: "В нейтральной беседе местоимение yo обычно не требуется: форма soy уже показывает лицо."
  },
  {
    id: "cafe", title: "В кафе", situation: "Посетитель делает простой заказ и просит счёт.", level: "базовый", coverage: 96,
    goals: ["сделать заказ", "уточнить наличие", "попросить счёт"], patterns: ["quisiera…", "¿hay…?", "la cuenta, por favor"],
    lines: [
      ["Mesera", "Buenas tardes. ¿Qué va a tomar?", "Добрый день. Что будете пить?"],
      ["Cliente", "Quisiera un café con leche, por favor.", "Я хотел бы кофе с молоком, пожалуйста."],
      ["Mesera", "Claro. ¿Quiere comer algo?", "Конечно. Хотите что-нибудь поесть?"],
      ["Cliente", "Sí. ¿Hay pan?", "Да. Есть хлеб?"],
      ["Mesera", "Sí, hay pan y fruta.", "Да, есть хлеб и фрукты."],
      ["Cliente", "Entonces, pan y fruta. Gracias.", "Тогда хлеб и фрукты. Спасибо."],
      ["Cliente", "Disculpe, la cuenta, por favor.", "Извините, счёт, пожалуйста."],
      ["Mesera", "Claro. ¿Va a pagar con tarjeta?", "Конечно. Будете платить картой?"]
    ], note: "¿Qué va a tomar? — обычный вежливый вопрос персонала; буквально «что собираетесь взять/выпить?»."
  },
  {
    id: "directions", title: "Как пройти к станции", situation: "Человек спрашивает дорогу в центре города.", level: "базовый", coverage: 94,
    goals: ["привлечь внимание", "спросить дорогу", "понять ориентиры"], patterns: ["disculpe…", "¿dónde está…?", "sigue todo recto"],
    lines: [
      ["Viajero", "Disculpe, ¿dónde está la estación?", "Извините, где вокзал?"],
      ["Vecina", "Está cerca. Sigue todo recto hasta el banco.", "Он рядом. Идите всё время прямо до банка."],
      ["Viajero", "¿Y después?", "А потом?"],
      ["Vecina", "Después gira a la derecha. La estación está al otro lado de la calle.", "Потом поверните направо. Вокзал находится на другой стороне улицы."],
      ["Viajero", "¿Se puede ir caminando?", "Можно дойти пешком?"],
      ["Vecina", "Sí, son unos diez minutos.", "Да, это около десяти минут."],
      ["Viajero", "Muchas gracias por su ayuda.", "Большое спасибо за помощь."],
      ["Vecina", "De nada.", "Не за что."]
    ], note: "Форма usted выражена формой глагола 3-го лица; само местоимение обычно не произносится."
  },
  {
    id: "hotel", title: "В гостинице", situation: "Гость приезжает в отель и получает номер.", level: "базовый", coverage: 95,
    goals: ["сообщить о бронировании", "уточнить завтрак", "получить ключ"], patterns: ["tengo una reserva", "¿está incluido?", "¿a qué hora…?"],
    lines: [
      ["Huésped", "Buenas noches. Tengo una reserva a nombre de Elena Ruiz.", "Добрый вечер. У меня бронь на имя Элены Руис."],
      ["Recepcionista", "Un momento, por favor. Sí, una habitación para dos noches.", "Минутку, пожалуйста. Да, номер на две ночи."],
      ["Huésped", "Exacto. ¿El desayuno está incluido?", "Именно. Завтрак включён?"],
      ["Recepcionista", "Sí. El desayuno es de siete a diez.", "Да. Завтрак с семи до десяти."],
      ["Huésped", "Perfecto. ¿Dónde está la habitación?", "Отлично. Где находится номер?"],
      ["Recepcionista", "En el tercer piso. Aquí tiene la llave.", "На третьем этаже. Вот ваш ключ."],
      ["Huésped", "Gracias. ¿Se puede pagar mañana?", "Спасибо. Можно заплатить завтра?"],
      ["Recepcionista", "Sí, no hay problema.", "Да, без проблем."]
    ], note: "A nombre de — устойчивая формула «на имя кого-либо». Она помечается как ситуационное дополнение к ядру."
  },
  {
    id: "shopping", title: "Покупка одежды", situation: "Покупатель узнаёт цену и просит другой размер.", level: "базовый", coverage: 91,
    goals: ["узнать цену", "описать предмет", "сделать выбор"], patterns: ["¿cuánto cuesta?", "¿tiene otro…?", "me llevo…"],
    lines: [
      ["Cliente", "Disculpe, ¿cuánto cuesta esta camisa?", "Извините, сколько стоит эта рубашка?"],
      ["Vendedora", "Cuesta treinta dólares.", "Она стоит тридцать долларов."],
      ["Cliente", "Me gusta, pero es un poco pequeña. ¿Tiene otra más grande?", "Мне нравится, но она немного мала. У вас есть другая, побольше?"],
      ["Vendedora", "Sí, tengo una azul.", "Да, у меня есть синяя."],
      ["Cliente", "La azul está bien. Me la llevo.", "Синяя подходит. Я её беру."],
      ["Vendedora", "¿Va a pagar con tarjeta o en efectivo?", "Будете платить картой или наличными?"],
      ["Cliente", "Con tarjeta, por favor.", "Картой, пожалуйста."]
    ], note: "Me la llevo буквально означает «я уношу её с собой» и обычно используется при окончательном выборе товара."
  },
  {
    id: "plans", title: "Планы на выходные", situation: "Друзья договариваются, что делать в субботу.", level: "базовый", coverage: 100,
    goals: ["предложить план", "назвать время", "согласиться"], patterns: ["¿quieres…?", "vamos a…", "nos vemos…"],
    lines: [
      ["Ana", "¿Qué vas a hacer el sábado?", "Что ты собираешься делать в субботу?"],
      ["Luis", "Todavía no sé. ¿Por qué?", "Я ещё не знаю. А что?"],
      ["Ana", "Quiero ir al parque. Hace buen tiempo.", "Я хочу пойти в парк. Погода хорошая."],
      ["Luis", "Buena idea. Podemos caminar y después comer en el centro.", "Хорошая идея. Можем погулять, а потом поесть в центре."],
      ["Ana", "Perfecto. ¿A qué hora nos vemos?", "Отлично. Во сколько встретимся?"],
      ["Luis", "A las once, frente al banco.", "В одиннадцать, напротив банка."],
      ["Ana", "De acuerdo. Nos vemos el sábado.", "Договорились. Увидимся в субботу."]
    ], note: "Настоящее время и ir a + infinitivo естественно сосуществуют при обсуждении ближайших планов."
  },
  {
    id: "work", title: "Работа и учёба", situation: "Знакомые рассказывают о своём обычном дне.", level: "базовый", coverage: 100,
    goals: ["описать распорядок", "говорить о длительности", "выразить оценку"], patterns: ["trabajo desde…", "hace… que", "me parece…"],
    lines: [
      ["Marta", "¿Dónde trabajas?", "Где ты работаешь?"],
      ["Pablo", "Trabajo en una empresa pequeña desde hace dos años.", "Я работаю в небольшой компании уже два года."],
      ["Marta", "¿Te gusta tu trabajo?", "Тебе нравится твоя работа?"],
      ["Pablo", "Sí, pero tengo mucho trabajo. ¿Y tú?", "Да, но у меня много работы. А ты?"],
      ["Marta", "Estudio historia en la universidad y trabajo por las tardes.", "Я изучаю историю в университете и работаю по вечерам."],
      ["Pablo", "Parece difícil.", "Кажется, это трудно."],
      ["Marta", "A veces sí, pero me gusta mucho.", "Иногда да, но мне очень нравится."]
    ], note: "Desde hace + период сочетается с настоящим временем, если ситуация продолжается сейчас."
  },
  {
    id: "health", title: "Самочувствие", situation: "Человек объясняет врачу простую проблему.", level: "базовый", coverage: 96,
    goals: ["описать боль", "назвать время начала", "понять рекомендацию"], patterns: ["me duele…", "desde ayer", "tiene que…"],
    lines: [
      ["Doctora", "Buenos días. ¿Qué le pasa?", "Добрый день. Что с вами?"],
      ["Paciente", "Me duele la cabeza y estoy muy cansado.", "У меня болит голова, и я очень устал."],
      ["Doctora", "¿Desde cuándo?", "С каких пор?"],
      ["Paciente", "Desde ayer por la noche.", "Со вчерашнего вечера."],
      ["Doctora", "¿Tiene fiebre?", "У вас есть температура?"],
      ["Paciente", "No, creo que no.", "Нет, думаю, что нет."],
      ["Doctora", "Tiene que descansar y beber más agua.", "Вам нужно отдохнуть и пить больше воды."],
      ["Paciente", "De acuerdo. Muchas gracias.", "Хорошо. Большое спасибо."]
    ], note: "Me duele + единственное число; me duelen + множественное: me duelen los ojos."
  }
];
