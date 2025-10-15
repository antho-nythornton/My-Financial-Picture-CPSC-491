export default function Accounts() {
  const accounts = [];
  const totalBalance = 0;

  return (
    <div className="page">
      <h1>Accounts</h1>
      <p>Link bank/credit accounts or add manual ones.</p>

      <div className="card">
        <h3>Total Balance</h3>
        <div className="big">${totalBalance}</div>
      </div>

      {accounts.length === 0 ? (
        <div className="empty">No accounts yet. Link an account to see balances here.</div>
      ) : (
        <table className="table">
          <thead><tr><th>Name</th><th>Type</th><th>Balance</th></tr></thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id}><td>{a.name}</td><td>{a.type}</td><td>${a.balance}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}