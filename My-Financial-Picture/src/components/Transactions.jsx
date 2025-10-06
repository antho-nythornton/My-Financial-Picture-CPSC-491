function Transactions() {
  return (
    <section className="transactions">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <style>{`.material-icons { vertical-align: middle; margin-right: 4px; color: white; }
        .transaction-icon { font-size: 20px; vertical-align: middle; }
        .restaurant-icon { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle; }
        .taxi-icon { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle; }
        .shopping-icon { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle; }
        .business-icon { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle; }
      `}</style>
      <h3>Recent transactions</h3>
      <div className="transaction">
        <span><i class="material-icons restaurant-icon">restaurant</i> Dinner at Nopa</span>
        <span className="amount">-$50</span>
      </div>
      <div className="transaction">
        <span><i class="material-icons taxi-icon">local_taxi</i> Uber ride</span>
        <span className="amount">-$25</span>
      </div>
      <div className="transaction">
        <span><i class="material-icons shopping-icon">shopping_cart</i> Groceries at Whole Foods</span>
        <span className="amount">-$100</span>
      </div>
      <div className="transaction">
        <span><i class="material-icons business-icon">business_center</i> Paycheck from Lighthouse</span>
        <span className="amount positive">+$2,000</span>
      </div>
      <button className="view-all">View all transactions</button>
    </section>
  );
}

export default Transactions;
