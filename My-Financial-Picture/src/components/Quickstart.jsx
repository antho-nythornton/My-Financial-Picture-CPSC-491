import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import "./Quickstart.css";

export default function QuickStart({ open, initialStep = 1, onSaved, onClose }) {
  const { userId, firstName } = useAuth();

  if (!open) return null; 

  const [step, setStep] = useState(initialStep);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    checkingBalance: "",
    savingsBalance: "",
    monthlyIncome: "",
    monthlyBudget: "",
    savingsGoal: "",
    savingsGoalAmount: "",
  });

  useEffect(() => setStep(initialStep), [initialStep]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const toNumberOrNull = (v) => {
    if (v === "" || v === null || typeof v === "undefined") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const handleComplete = async () => {
    if (!userId) return alert("No user session.");

    const payload = {
      bank_name: formData.bankName || null,
      checking_balance: toNumberOrNull(formData.checkingBalance),
      savings_balance: toNumberOrNull(formData.savingsBalance),
      monthly_income: toNumberOrNull(formData.monthlyIncome),
      monthly_budget: toNumberOrNull(formData.monthlyBudget),
      savings_goal: formData.savingsGoal || null,
      savings_goal_amount: toNumberOrNull(formData.savingsGoalAmount),
    };

    setSubmitting(true);
    try {
      await api.post(`/users/${userId}/quickstart`, payload);
    } catch (err) {
      const status = err?.response?.status;
      if (err?.response?.status === 404) {
        await api.post(`/quickstart`, { user_id: userId, ...payload });
      } else {
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save quick start info.";
        alert(msg);
        return;
      }
    } finally {
      setSubmitting(false);
    }

    if (typeof onSaved === "function") onSaved();
  };

  return (
    <div className="qs-overlay" role="dialog" aria-modal="true">
      <div className="qs-modal">
        <header className="qs-header">
          <div>
            <h2>Welcome{firstName ? `, ${firstName}` : ""}!</h2>
            <p>Let’s set up a few basics to personalize your dashboard.</p>
          </div>
          <button
            className="qs-close"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            ×
          </button>
        </header>

        <div className="qs-progress">
          <div className={`qs-step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`qs-line ${step >= 2 ? "active" : ""}`} />
          <div className={`qs-step ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`qs-line ${step >= 3 ? "active" : ""}`} />
          <div className={`qs-step ${step >= 3 ? "active" : ""}`}>3</div>
        </div>

        <main className="qs-body">
          {step === 1 && (
            <section className="qs-section">
              <h3>Bank & Accounts</h3>
              <label className="qs-field">
                <span>Bank name</span>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., Chase, BofA"
                />
              </label>
              <div className="qs-grid">
                <label className="qs-field">
                  <span>Checking balance</span>
                  <input
                    type="number"
                    name="checkingBalance"
                    value={formData.checkingBalance}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </label>
                <label className="qs-field">
                  <span>Savings balance</span>
                  <input
                    type="number"
                    name="savingsBalance"
                    value={formData.savingsBalance}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="qs-section">
              <h3>Income & Budget</h3>
              <div className="qs-grid">
                <label className="qs-field">
                  <span>Monthly income</span>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </label>
                <label className="qs-field">
                  <span>Monthly budget</span>
                  <input
                    type="number"
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                </label>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="qs-section">
              <h3>Savings Goal</h3>
              <label className="qs-field">
                <span>What are you saving for?</span>
                <input
                  type="text"
                  name="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={handleChange}
                  placeholder="e.g., Emergency fund, Vacation"
                />
              </label>
              <label className="qs-field">
                <span>Target amount</span>
                <input
                  type="number"
                  name="savingsGoalAmount"
                  value={formData.savingsGoalAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </label>
            </section>
          )}
        </main>

        <footer className="qs-footer">
          <button
            className="qs-btn qs-btn-ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Skip for now
          </button>
          <div className="qs-actions">
            {step > 1 && (
              <button
                className="qs-btn qs-btn-outline"
                onClick={back}
                disabled={submitting}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                className="qs-btn qs-btn-primary"
                onClick={next}
                disabled={submitting}
              >
                Next
              </button>
            ) : (
              <button
                className="qs-btn qs-btn-primary"
                onClick={handleComplete}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Complete"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}