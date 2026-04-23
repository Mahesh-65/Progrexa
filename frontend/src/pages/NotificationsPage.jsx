export default function NotificationsPage() {
  const messages = ["Daily summary is ready", "Task reminder: Finish API docs", "Focus streak: 5 days"];
  return (
    <section className="space-y-4">
      <h2 className="page-title">Notifications</h2>
      <div className="space-y-2">
        {messages.map((m) => (
          <article key={m} className="card">
            <p>{m}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
