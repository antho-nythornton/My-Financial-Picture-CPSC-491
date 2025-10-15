export default function Budgets() {
  const budgets = []; 
  const totalLimit = 0;
  const totalSpent = 0;

  return (
    <div className="page">
      <h1>Budgets</h1>
      <p>Set limits for categories and track progress.</p>

      <div className="card">
        <h3>Overview</h3>
        <p><strong>Total Limit:</strong> ${totalLimit} &nbsp;|&nbsp; <strong>Spent:</strong> ${totalSpent} &nbsp;|&nbsp; <strong>Remaining:</strong> ${totalLimit - totalSpent}</p>
      </div>

      {budgets.length === 0 ? (
        <div className="empty">No budgets yet. Create your first budget to get started.</div>
      ) : (
        <ul className="list">
          {budgets.map(b => (
            <li key={b.id} className="row">
              <span>{b.category}</span>
              <span>${b.spent} / ${b.limit}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}