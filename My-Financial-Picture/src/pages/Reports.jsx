export default function Reports() {
  return (
    <div className="page">
      <h1>Reports</h1>
      <p>Visualize spending, income, and trends over time.</p>

      <div className="card">
        <h3>Spending by Category (This Month)</h3>
        <div className="empty">No data yet — $0 across all categories.</div>
      </div>

      <div className="card">
        <h3>Monthly Trend</h3>
        <div className="empty">No data to chart yet.</div>
      </div>
    </div>
  );
}