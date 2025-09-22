import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
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
        <button className="icon-btn">🔔</button>
        <button className="icon-btn">⚙️</button>
        <img
          src="https://via.placeholder.com/32"
          alt="Profile"
          className="profile-pic"
        />
      </div>
    </nav>
  );
}

export default Navbar;
