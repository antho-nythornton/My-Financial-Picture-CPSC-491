import './Dashboard.css';
import Navbar from './components/Navbar';
import SummaryCard from './components/SummaryCard';
import SpendingChart from './components/SpendingChart';
import CategoryChart from './components/CategoryChart';
import Transactions from './components/Transactions';
import Notifications from './components/Notifications';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">

        <Navbar />
        <h1>Hi, Carlos</h1>
        <p>Here’s your finance report for July</p>

        <div className="summary-container">
          <SummaryCard title="Total balance" value="$7,500" trend={2.3} />
          <SummaryCard title="Spent" value="$2,150" trend={-1.2} />
          <SummaryCard title="Income" value="$5,000" trend={0.5} />
          <SummaryCard title="Budget progress" value="54%" trend={0.8} />
        </div>

        <div className="charts-container">
          <SpendingChart />
          <CategoryChart />
        </div>

        <Transactions />
        <Notifications />
      </div>
    </div>
  );
}

export default Dashboard;
