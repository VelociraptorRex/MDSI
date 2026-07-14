export function ColorLegend({ compact = false }) {
  return (
    <div className={`color-legend ${compact ? "compact" : ""}`} aria-label="Цветовые обозначения">
      <span><i className="dot ending" />окончания</span>
      <span><i className="dot plural" />множественное</span>
      <span><i className="dot irregular" />неправильное</span>
      <span><i className="dot pattern" />паттерн</span>
      {!compact && <span><i className="dot comment" />комментарий</span>}
    </div>
  );
}
