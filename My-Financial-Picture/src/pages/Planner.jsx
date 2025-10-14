export default function Planner() {
  const goals = [];
  return (
    <div className="page">
      <h1>Planner</h1>
      <p>Create savings goals and track progress.</p>

      {goals.length === 0 ? (
        <div className="empty">No goals yet. Add a goal (e.g., “Emergency Fund $1,000”).</div>
      ) : (
        <ul className="list">
          {goals.map(g => (
            <li key={g.id} className="row">
              <span>{g.name}</span>
              <span>${g.current} / ${g.target}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}