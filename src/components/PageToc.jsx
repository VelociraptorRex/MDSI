import { useEffect, useState } from "react";
import { List, Pin } from "lucide-react";

export function PageToc({ items, title = "На этой странице" }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const nodes = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-18% 0px -68%", threshold: [0, 0.25, 0.6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="page-toc" aria-label={title}>
      <div className="toc-title"><List size={16} />{title}<Pin size={13} className="pin" /></div>
      <nav>
        {items.map((item) => <a key={item.id} className={active === item.id ? "active" : ""} href={`#${item.id}`}>{item.label}</a>)}
      </nav>
    </aside>
  );
}
