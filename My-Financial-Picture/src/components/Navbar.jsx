import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <div className="navbar-left">
        <h2>Finance Tracker</h2>
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Reports</li>
        <li>Budgets</li>
        <li>Accounts</li>
        <li>Bills</li>
        <li>Planner</li>
      </ul>

      <div className="navbar-right">
        <button className="icon-btn" ><i class="material-icons">notifications</i></button>
        <button className="icon-btn" ><i class="material-icons">settings</i></button>

        <button className="icon-btn" ><i class="material-icons">account_circle</i></button>
      </div>
    </nav>
  );
}

export default Navbar;
