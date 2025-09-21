function CategoryChart() {
  return (
    <div className="chart-box">
      <h3>Spending by category</h3>
      <ul className="category-list">
        <li>Dining <div className="bar" style={{ width: "80%" }}></div></li>
        <li>Groceries <div className="bar" style={{ width: "60%" }}></div></li>
        <li>Transportation <div className="bar" style={{ width: "40%" }}></div></li>
        <li>Shopping <div className="bar" style={{ width: "30%" }}></div></li>
        <li>Travel <div className="bar" style={{ width: "20%" }}></div></li>
      </ul>
    </div>
  );
}

export default CategoryChart;
