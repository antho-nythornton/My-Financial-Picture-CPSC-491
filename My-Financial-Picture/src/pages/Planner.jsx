import './Planner.css'
import React, { useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Planner() {
  const [date, setDate] = useState(new Date());
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', current: '', deadline: '' });

  const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const addGoal = () => {
    if (!form.name || !form.target) return alert('Fill in goal name and target');
    const newGoal = {
      id: Date.now(),
      name: form.name,
      target: parseFloat(form.target),
      current: parseFloat(form.current) || 0,
      deadline: form.deadline || 'No deadline',
    };
    setGoals([...goals, newGoal]);
    setForm({ name: '', target: '', current: '', deadline: '' });
    setShowModal(false);
  };

  const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

  const updateGoal = (id, amt) => setGoals(goals.map(g => 
    g.id === id ? { ...g, current: parseFloat(amt) } : g
  ));

  const renderDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDay(date);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(date.getFullYear(), date.getMonth(), day).toDateString();
      days.push(
        <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <div className="day-number">{day}</div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="planner-container">
      <h1>Planner</h1>
      <p>Create saving goals and track your progress.</p>

      <div className="planner-content">
        <div className="calendar-card">
          <div className="calendar-header">
            <button onClick={prevMonth} className="nav-btn">&larr;</button>
            <h2>{MONTHS[date.getMonth()]} {date.getFullYear()}</h2>
            <button onClick={nextMonth} className="nav-btn">&rarr;</button>
          </div>

          <div className="calendar-grid">
            {DAYS.map(day => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}
            {renderDays()}
          </div>
        </div>

        <div className="goals-section">
          <div className="goals-header">
            <h2>Saving Goals</h2>
            <button onClick={() => setShowModal(true)} className="btn-add-goal">+ Add Goal</button>
          </div>

          {goals.length === 0 ? (
            <div className="empty-goals">No goals yet. Create your first saving goal!</div>
          ) : (
            <div className="goals-list">
              {goals.map(goal => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-header">
                      <h3>{goal.name}</h3>
                      <button onClick={() => deleteGoal(goal.id)} className="btn-delete">×</button>
                    </div>
                    <div className="goal-info">
                      <div className="goal-amount">
                        <span className="current">${goal.current.toFixed(2)}</span>
                        <span className="divider">/</span>
                        <span className="target">${goal.target.toFixed(2)}</span>
                      </div>
                      <div className="goal-deadline">{goal.deadline}</div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                    <div className="progress-text">{Math.round(progress)}% complete</div>
                    <div className="goal-update">
                      <input 
                        type="number" 
                        placeholder="Add amount" 
                        step="0.01"
                        id={`inp-${goal.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            updateGoal(goal.id, goal.current + parseFloat(e.target.value));
                            e.target.value = '';
                          }
                        }}
                      />
                      <button onClick={() => {
                        const inp = document.getElementById(`inp-${goal.id}`);
                        if (inp?.value) {
                          updateGoal(goal.id, goal.current + parseFloat(inp.value));
                          inp.value = '';
                        }
                      }}>Add</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Saving Goal</h2>

            <div className="form-group">
              <label>Goal Name</label>
              <input
                type="text"
                placeholder="e.g., Emergency Fund"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Target Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Current Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Deadline (Optional)</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={addGoal} className="btn-primary">Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}