import './Dashboard.css'
import SummaryCard from './components/SummaryCard'
import SpendingChart from './components/SpendingChart'
import CategoryChart from './components/CategoryChart'
import Transactions from './components/Transactions'
import Notifications from './components/Notifications'
import { useAuth } from './context/AuthContext'
import QuickStart from "./components/Quickstart"
import { useEffect, useState, useCallback } from "react"
import api from "./lib/api"

function Dashboard() {

  const { firstName, userId } = useAuth()

  const [qsOpen, setQsOpen] = useState(false);
  const [initialStep, setInitialStep] = useState(1);
  const [loadingQS, setLoadingQS] = useState(false);

  const computeInitialStep = (missing) => {
    if (!missing) return 1;
    if (missing.institutions) return 1;
    if (missing.budgets) return 2;
    return 3;
  };

  const refreshQS = useCallback(async () => {
    if (!userId) return;
    try {
      setLoadingQS(true);
      const { data } = await api.get(`/users/${userId}/needs-quickstart`);
      setInitialStep(computeInitialStep(data.missing));
      setQsOpen(Boolean(data.needs_quickstart));
    } catch (e) {
      console.warn("needs-quickstart failed:", e?.response?.data || e.message);
      setQsOpen(false);
    } finally {
      setLoadingQS(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshQS();
  }, [refreshQS]);

  const handleQSSaved = async () => {
    await refreshQS();
  };

  const handleQSClose = async () => {
    await refreshQS()
  }

  const monthName = new Date().toLocaleString("default", { month: "long" })

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Hi, { firstName }</h1>
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

      <QuickStart
        open={qsOpen && !loadingQS}
        initialStep={initialStep}
        onSaved={handleQSSaved}
        onClose={handleQSClose}
      />
    </div>
  );
}

export default Dashboard;