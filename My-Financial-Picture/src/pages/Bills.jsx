export default function Bills() {
  const bills = [];
  return (
    <div className="page">
      <h1>Bills</h1>
      <p>Track upcoming bills and due dates.</p>

      {bills.length === 0 ? (
        <div className="empty">No upcoming bills. Add your first bill to get reminders.</div>
      ) : (
        <ul className="list">
          {bills.map(b => (
            <li key={b.id} className="row">
              <span>{b.name}</span>
              <span>${b.amount} due {b.dueDate}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}