import fs from "node:fs";
import path from "node:path";

const target = path.resolve("local-package/MDSI-local");
fs.rmSync(path.dirname(target), { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(path.resolve("dist"), path.join(target, "site"), { recursive: true });

const launcher = `#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
LOG="/tmp/mdsi-local-site.log"

if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display alert "Не найден Python 3" message "Установите Python 3 или запустите сайт командой npm run dev из папки исходников."'
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory site >"$LOG" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM
sleep 1

if ! kill -0 "$SERVER_PID" 2>/dev/null; then
  osascript -e 'display alert "Сайт не запустился" message "Возможно, порт 8765 уже занят. Подробности: /tmp/mdsi-local-site.log"'
  exit 1
fi

open "http://127.0.0.1:$PORT/es-419/"
echo "MDSI запущен: http://127.0.0.1:$PORT/es-419/"
echo "Не закрывайте это окно во время работы. Для остановки нажмите Control+C."
wait "$SERVER_PID"
`;

const readme = `MDSI — ЛОКАЛЬНАЯ ВЕРСИЯ
=============================

1. Дважды нажмите «Открыть MDSI.command».
2. Если macOS впервые заблокирует файл: нажмите на него правой кнопкой → «Открыть» → ещё раз «Открыть».
3. Откроется браузер с адресом http://127.0.0.1:8765/es-419/
4. Не закрывайте окно Terminal, пока пользуетесь сайтом.
5. Для остановки нажмите Control+C или закройте Terminal.

Почему нельзя просто открыть site/index.html:
браузеры запрещают веб-приложениям загружать JavaScript-модули через file://. Это ограничение безопасности браузера, а не отсутствие данных.

Внутри находятся все 500 лексических единиц, расширенная практика и готовые файлы Anki, Quizlet и Polyglот в разделе «Карточки».
`;

fs.writeFileSync(path.join(target, "Открыть MDSI.command"), launcher, { mode: 0o755 });
fs.writeFileSync(path.join(target, "ПРОЧТИ МЕНЯ.txt"), readme);
console.log(`Локальный пакет создан: ${target}`);
