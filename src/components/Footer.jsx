import { ArrowUpRight } from "lucide-react";
import { sitePath } from "../utils/sitePath";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">MDSI <span>·</span> español esencial</div>
          <p>Минимально достаточная система для первой осмысленной коммуникации.</p>
        </div>
        <div className="footer-links">
          <a href={sitePath("/es-419/sources/")}>Методика <ArrowUpRight size={14} /></a>
          <a href={sitePath("/es-419/lexicon/")}>Лексическое ядро</a>
          <a href={sitePath("/es-419/anki/")}>Карточки</a>
          <span>Содержательная версия v1.10</span>
        </div>
      </div>
    </footer>
  );
}
