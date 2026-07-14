import fs from "node:fs";
import path from "node:path";

const pages = [
  { route: "es-419", page: "home", title: "MDSI — Español esencial" },
  { route: "es-419/grammar", page: "grammar", title: "Грамматика — MDSI" },
  { route: "es-419/lexicon", page: "lexicon", title: "Лексика — MDSI" },
  { route: "es-419/patterns", page: "patterns", title: "Паттерны — MDSI" },
  { route: "es-419/dialogues", page: "dialogues", title: "Диалоги — MDSI" },
  { route: "es-419/tests", page: "tests", title: "Практика — MDSI" },
  { route: "es-419/anki", page: "anki", title: "Карточки Anki, Quizlet и Полиглот — MDSI" },
  { route: "es-419/sources", page: "sources", title: "Методика — MDSI" }
];

const shell = ({ page, title }) => `<!doctype html>
<html lang="ru" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="MDSI — связанная база минимально достаточного испанского языка es-419." />
    <meta name="theme-color" content="#f7f8fc" />
    <script>try{const saved=localStorage.getItem("mdsi-theme");document.documentElement.dataset.theme=saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}</script>
    <title>${title}</title>
  </head>
  <body data-page="${page}">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

for (const page of pages) {
  const directory = path.resolve(page.route);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), shell(page));
}

fs.writeFileSync(path.resolve("index.html"), `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>MDSI — запуск</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f6f7fb;color:#182033;font:15px/1.65 system-ui,-apple-system,sans-serif}.card{width:min(620px,100%);padding:38px;border:1px solid #e0e5ee;border-radius:24px;background:white;box-shadow:0 22px 70px rgba(24,32,51,.12)}.mark{width:44px;height:44px;display:grid;place-items:center;margin-bottom:24px;border-radius:13px;background:#182033;color:white;font-weight:800}h1{margin:0 0 12px;font-size:32px;letter-spacing:-.04em}p{margin:0 0 18px;color:#596377}.local{display:none;padding:14px 16px;border-radius:12px;background:#fff6e8;color:#75511e}.server{display:inline-flex;padding:12px 17px;border-radius:11px;background:#2764e7;color:white;text-decoration:none;font-weight:700}code{padding:2px 5px;border-radius:5px;background:#eef1f6}small{display:block;margin-top:20px;color:#8a93a3}
  </style>
</head>
<body>
  <main class="card"><div class="mark">M</div><h1>MDSI · español esencial</h1><p id="status">Открываем испанское ядро…</p><div class="local" id="local"><b>Этот файл открыт напрямую с диска.</b><br>Современные браузеры не разрешают так загружать модули сайта. Запустите файл <code>Открыть MDSI.command</code> из готового локального пакета.</div><a class="server" id="link" href="/es-419/">Перейти к сайту</a><small>Лексическое ядро содержит 500 единиц.</small></main>
  <script>
    if(location.protocol === "file:") { document.getElementById("local").style.display="block"; document.getElementById("status").textContent="Для локальной версии нужен мини-сервер."; document.getElementById("link").style.display="none"; }
    else { location.replace("/es-419/"); }
  </script>
</body>
</html>`);
