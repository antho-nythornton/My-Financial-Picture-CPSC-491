function SummaryCard({ title, value, trend }) {
  const isPositive = trend >= 0;
  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className={`trend ${isPositive ? "positive" : "negative"}`}>
        {isPositive ? "+" : ""}{trend}%
      </div>
    </div>
  );
}

export default SummaryCard;
