function Notifications() {
  return (
    <section className="notifications">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <h3>Notifications</h3>
      <style>{`.material-icons icons{ vertical-align: middle; margin-right: 4px; color: white; }
        .icon-warning {color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle}
        .icon-money { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius:  15px; vertical-align: middle }
        .icon-event { color: #ffffff; background-color: #000000ff; padding: 15px; border-radius: 15px; vertical-align: middle; }`}</style>
      <div className="notification"><i class="material-icons icon-warning">warning</i> Budget alert — Dining 75% spent</div>
      <div className="notification"><i class="material-icons icon-money">attach_money</i> Rewards — $200 in cash back</div>
      <div className="notification"><i class="material-icons icon-event">event</i> Bill reminder — Payment due July 30</div>
      <button className="view-all">View all notifications</button>
    </section>
  );
}

export default Notifications;
