function Transactions() {
  return (
    <section className="transactions">
      <h3>Recent transactions</h3>
      <div className="transaction">
        <span>🍽️ Dinner at Nopa</span>
        <span className="amount">-$50</span>
      </div>
      <div className="transaction">
        <span>🚖 Uber ride</span>
        <span className="amount">-$25</span>
      </div>
      <div className="transaction">
        <span>🛒 Groceries at Whole Foods</span>
        <span className="amount">-$100</span>
      </div>
      <div className="transaction">
        <span>💼 Paycheck from Lighthouse</span>
        <span className="amount positive">+$2,000</span>
      </div>
      <button className="view-all">View all transactions</button>
    </section>
  );
}

export default Transactions;
