#!/usr/bin/env python3
"""Build a classic Anki .apkg package from normalized MDSI JSON data."""

import hashlib
import json
import sqlite3
import sys
import time
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"


def checksum(value: str) -> int:
    return int(hashlib.sha1(value.encode("utf-8")).hexdigest()[:8], 16)


def guid(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:16]


def field(name: str, order: int, size: int = 20) -> dict:
    return {"name": name, "ord": order, "sticky": False, "rtl": False, "font": "Arial", "size": size, "media": []}


def template(name: str, order: int, question: str, answer: str, deck_id: int) -> dict:
    return {"name": name, "ord": order, "qfmt": question, "afmt": answer, "did": deck_id, "bqfmt": "", "bafmt": ""}


def model(model_id: int, name: str, deck_id: int, fields: list, templates: list, css: str, requirements: list) -> dict:
    return {
        "id": model_id,
        "name": name,
        "type": 0,
        "mod": int(time.time()),
        "usn": -1,
        "sortf": 0,
        "did": deck_id,
        "tmpls": templates,
        "flds": fields,
        "css": css,
        "latexPre": "\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}",
        "latexPost": "\\end{document}",
        "req": requirements,
        "vers": []
    }


def deck(deck_id: int, name: str, description: str, modified: int) -> dict:
    return {
        "id": deck_id,
        "name": name,
        "desc": description,
        "mod": modified,
        "usn": -1,
        "dyn": 0,
        "conf": 1,
        "extendNew": 10,
        "extendRev": 50,
        "collapsed": False,
        "browserCollapsed": False,
        "newToday": [0, 0],
        "revToday": [0, 0],
        "lrnToday": [0, 0],
        "timeToday": [0, 0]
    }


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: package-anki.py INPUT.json OUTPUT.apkg")

    source_path = Path(sys.argv[1]).resolve()
    output_path = Path(sys.argv[2]).resolve()
    data = json.loads(source_path.read_text(encoding="utf-8"))
    output_path.parent.mkdir(parents=True, exist_ok=True)

    now = int(time.time())
    now_ms = int(time.time() * 1000)
    root_deck_id = 1764000100000
    lexical_deck_id = 1764000100001
    phrase_deck_id = 1764000100002
    pattern_deck_id = 1764000100003
    lexical_model_id = 1764000200001
    phrase_model_id = 1764000200002
    pattern_model_id = 1764000200003

    card_css = """
.card{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;font-size:20px;text-align:left;color:#182033;background:#f7f8fc;padding:24px;line-height:1.5}.mdsi{max-width:680px;margin:auto}.kicker{color:#2764e7;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.prompt{margin:18px 0 10px;font-size:31px;font-weight:750;line-height:1.2}.translation{font-size:24px;font-weight:700}.meta{margin-top:12px;color:#70798b;font-size:14px}.forms{margin-top:16px;padding:12px 14px;border-radius:10px;background:#edf3ff;color:#285ebb;font-size:17px}.example{margin-top:18px;padding:16px;border-left:4px solid #7b5ce7;background:#f1edff}.example .es{font-family:Georgia,serif;font-size:21px}.example .ru{margin-top:5px;color:#626b7b;font-size:14px}.pattern{font-family:Georgia,serif;color:#6647cf}.note{margin-top:14px;color:#70798b;font-size:13px}.rank{display:inline-block;margin-top:16px;color:#9098a8;font-size:11px}hr#answer{margin:22px 0;border:0;border-top:1px solid #dfe4ed}.nightMode .card{color:#f7f8fc;background:#10131b}.nightMode .forms{color:#8cb1ff;background:#1c2c4c}.nightMode .example{background:#2c2348}.nightMode .example .ru,.nightMode .meta,.nightMode .note{color:#abb3c1}
""".strip()

    lexical_model = model(
        lexical_model_id,
        "MDSI · Лексическая единица",
        lexical_deck_id,
        [field("Lemma", 0, 28), field("Translation", 1), field("Type", 2, 14), field("Forms", 3, 18), field("Example", 4, 20), field("ExampleRu", 5, 14), field("Rank", 6, 11), field("SourceId", 7, 10)],
        [
            template("01 · Узнавание", 0, '<div class="mdsi"><div class="kicker">Испанский → русский</div><div class="prompt" lang="es">{{Lemma}}</div><div class="meta">{{Type}}</div></div>', '<div class="mdsi">{{FrontSide}}<hr id="answer"><div class="translation">{{Translation}}</div><div class="forms" lang="es">{{Forms}}</div><div class="example"><div class="es" lang="es">{{Example}}</div><div class="ru">{{ExampleRu}}</div></div><span class="rank">Ядро · № {{Rank}}</span></div>', lexical_deck_id),
            template("02 · Активное воспроизведение", 1, '<div class="mdsi"><div class="kicker">Русский → испанский</div><div class="prompt">{{Translation}}</div><div class="meta">{{Type}}</div></div>', '<div class="mdsi">{{FrontSide}}<hr id="answer"><div class="translation" lang="es">{{Lemma}}</div><div class="forms" lang="es">{{Forms}}</div><div class="example"><div class="es" lang="es">{{Example}}</div><div class="ru">{{ExampleRu}}</div></div><span class="rank">Ядро · № {{Rank}}</span></div>', lexical_deck_id)
        ],
        card_css,
        [[0, "all", [0]], [1, "all", [1]]]
    )

    phrase_model = model(
        phrase_model_id,
        "MDSI · Естественная фраза",
        phrase_deck_id,
        [field("Russian", 0, 22), field("Spanish", 1, 25), field("Focus", 2, 13), field("SourceId", 3, 10)],
        [template("Фраза", 0, '<div class="mdsi"><div class="kicker">Сформулируйте по-испански</div><div class="prompt">{{Russian}}</div><div class="meta">{{Focus}}</div></div>', '<div class="mdsi">{{FrontSide}}<hr id="answer"><div class="translation" lang="es">{{Spanish}}</div><div class="note">Допустимы другие естественные формулировки с тем же смыслом.</div></div>', phrase_deck_id)],
        card_css,
        [[0, "all", [0]]]
    )

    pattern_model = model(
        pattern_model_id,
        "MDSI · Речевой паттерн",
        pattern_deck_id,
        [field("Function", 0, 14), field("Template", 1, 26), field("Translation", 2, 18), field("Grammar", 3, 13), field("Examples", 4, 18), field("Note", 5, 13), field("SourceId", 6, 10)],
        [template("Паттерн", 0, '<div class="mdsi"><div class="kicker">Речевая функция</div><div class="prompt">{{Function}}</div><div class="meta">Вспомните готовую конструкцию</div></div>', '<div class="mdsi">{{FrontSide}}<hr id="answer"><div class="translation pattern" lang="es">{{Template}}</div><div class="meta">{{Translation}}</div><div class="forms">{{Grammar}}</div><div class="example">{{Examples}}</div><div class="note">{{Note}}</div></div>', pattern_deck_id)],
        card_css,
        [[0, "all", [0]]]
    )

    models = {str(item["id"]): item for item in [lexical_model, phrase_model, pattern_model]}
    decks = {
        str(root_deck_id): deck(root_deck_id, "MDSI · Español esencial", f'Минимально достаточный испанский es-419 · версия {data.get("version", "")}', now),
        str(lexical_deck_id): deck(lexical_deck_id, "MDSI · Español esencial::01 · Лексика", "500 единиц: узнавание и активное воспроизведение", now),
        str(phrase_deck_id): deck(phrase_deck_id, "MDSI · Español esencial::02 · Естественные фразы", "Фразы из редакторского банка и словарных примеров", now),
        str(pattern_deck_id): deck(pattern_deck_id, "MDSI · Español esencial::03 · Речевые паттерны", "Продуктивные конструкции с примерами", now)
    }

    database_path = output_path.with_suffix(".anki2.tmp")
    if database_path.exists():
        database_path.unlink()
    connection = sqlite3.connect(database_path)
    cursor = connection.cursor()
    cursor.executescript("""
CREATE TABLE col (id integer primary key, crt integer not null, mod integer not null, scm integer not null, ver integer not null, dty integer not null, usn integer not null, ls integer not null, conf text not null, models text not null, decks text not null, dconf text not null, tags text not null);
CREATE TABLE notes (id integer primary key, guid text not null, mid integer not null, mod integer not null, usn integer not null, tags text not null, flds text not null, sfld integer not null, csum integer not null, flags integer not null, data text not null);
CREATE TABLE cards (id integer primary key, nid integer not null, did integer not null, ord integer not null, mod integer not null, usn integer not null, type integer not null, queue integer not null, due integer not null, ivl integer not null, factor integer not null, reps integer not null, lapses integer not null, left integer not null, odue integer not null, odid integer not null, flags integer not null, data text not null);
CREATE TABLE revlog (id integer primary key, cid integer not null, usn integer not null, ease integer not null, ivl integer not null, lastIvl integer not null, factor integer not null, time integer not null, type integer not null);
CREATE TABLE graves (usn integer not null, oid integer not null, type integer not null);
CREATE INDEX ix_notes_usn ON notes (usn);
CREATE INDEX ix_cards_usn ON cards (usn);
CREATE INDEX ix_revlog_usn ON revlog (usn);
CREATE INDEX ix_cards_nid ON cards (nid);
CREATE INDEX ix_cards_sched ON cards (did, queue, due);
CREATE INDEX ix_revlog_cid ON revlog (cid);
""")

    default_config = {"1": {"id": 1, "name": "MDSI · спокойный темп", "mod": now, "usn": -1, "maxTaken": 60, "autoplay": True, "timer": 0, "replayq": True, "new": {"bury": True, "delays": [1, 10], "initialFactor": 2500, "ints": [1, 4], "order": 1, "perDay": 20}, "rev": {"bury": True, "ease4": 1.3, "fuzz": 0.05, "ivlFct": 1, "maxIvl": 36500, "perDay": 200, "hardFactor": 1.2}, "lapse": {"delays": [10], "leechAction": 0, "leechFails": 8, "minInt": 1, "mult": 0}}}
    conf = {"nextPos": 1, "estTimes": True, "activeDecks": [root_deck_id], "curDeck": root_deck_id, "newSpread": 0, "collapseTime": 1200, "timeLim": 0, "sortType": "noteFld", "sortBackwards": False, "addToCur": True}
    cursor.execute("INSERT INTO col VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", (1, now, now_ms, now_ms, 11, 0, 0, 0, json.dumps(conf), json.dumps(models, ensure_ascii=False), json.dumps(decks, ensure_ascii=False), json.dumps(default_config, ensure_ascii=False), "{}"))

    note_counter = 0
    card_counter = 0
    due_by_deck = {lexical_deck_id: 0, phrase_deck_id: 0, pattern_deck_id: 0}

    def add_note(source_id: str, model_id: int, deck_id: int, values: list, tags: list, card_orders: list) -> None:
        nonlocal note_counter, card_counter
        note_counter += 1
        note_id = now_ms + note_counter
        fields_value = FIELD_SEPARATOR.join(str(value or "") for value in values)
        sort_value = str(values[0] or "")
        tag_value = " " + " ".join(tag.replace(" ", "_") for tag in tags if tag) + " "
        cursor.execute("INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)", (note_id, guid(source_id), model_id, now, -1, tag_value, fields_value, sort_value, checksum(sort_value), 0, ""))
        for order in card_orders:
            card_counter += 1
            due_by_deck[deck_id] += 1
            card_id = now_ms + 100000 + card_counter
            cursor.execute("INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (card_id, note_id, deck_id, order, now, -1, 0, 0, due_by_deck[deck_id], 0, 2500, 0, 0, 0, 0, 0, 0, ""))

    for item in data["lexicon"]:
        add_note(
            f'lex:{item["id"]}', lexical_model_id, lexical_deck_id,
            [item["lemma"], item["translation"], item["type"], item["forms"], item["example"], item["exampleRu"], str(item["rank"]), item["id"]],
            ["mdsi", "es419", "lexicon", item.get("tag", ""), f'rank_{int(item["rank"]):04d}'], [0, 1]
        )

    for item in data["sentences"]:
        add_note(
            f'phrase:{item["id"]}', phrase_model_id, phrase_deck_id,
            [item["ru"], item["es"], item.get("focus", ""), item["id"]],
            ["mdsi", "es419", "phrase", item.get("focus", "")], [0]
        )

    for item in data["patterns"]:
        examples = "".join(f'<div class="es" lang="es">{pair[0]}</div><div class="ru">{pair[1]}</div>' for pair in item["examples"])
        add_note(
            f'pattern:{item["id"]}', pattern_model_id, pattern_deck_id,
            [item["function"], item["template"], item["translation"], " · ".join(item["grammar"]), examples, item["note"], item["id"]],
            ["mdsi", "es419", "pattern", item["category"]], [0]
        )

    conf["nextPos"] = max(due_by_deck.values()) + 1
    cursor.execute("UPDATE col SET conf=? WHERE id=1", (json.dumps(conf),))
    connection.commit()
    connection.close()

    if output_path.exists():
        output_path.unlink()
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as package:
        package.write(database_path, "collection.anki2")
        package.writestr("media", "{}")
    database_path.unlink()

    print(json.dumps({"notes": note_counter, "cards": card_counter, "output": str(output_path)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
