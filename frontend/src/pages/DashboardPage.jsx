const stats = [
  ["Tasks Done", "12"],
  ["Focus Time", "4h 30m"],
  ["Events Today", "5"],
  ["Unread Alerts", "3"],
];

export default function DashboardPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="mt-1 text-slate-400">Your productivity command center.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <article key={label} className="card">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
