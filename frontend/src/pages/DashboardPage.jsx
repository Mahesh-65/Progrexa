export default function DashboardPage() {
  const cards = [
    ["Today's Tasks", "6 planned, 3 completed"],
    ["Upcoming Schedule", "Team sync at 3:00 PM"],
    ["Active Timer", "Focus session: 12m left"],
    ["Productivity Summary", "Score: 82 / 100"],
  ];
  return (
    <section className="space-y-4">
      <h2 className="page-title">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(([title, val]) => (
          <article key={title} className="card">
            <h3 className="text-sm text-slate-400">{title}</h3>
            <p className="mt-2 text-lg font-semibold text-white">{val}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
