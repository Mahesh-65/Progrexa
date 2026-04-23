export default function SchedulePage() {
  return (
    <section className="space-y-4">
      <h2 className="page-title">Schedule Planner</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <article className="card">
          <h3 className="font-semibold text-white">Daily Planner</h3>
          <p className="mt-2 text-sm text-slate-400">Create time blocks and organize your day.</p>
        </article>
        <article className="card">
          <h3 className="font-semibold text-white">Upcoming Events</h3>
          <p className="mt-2 text-sm text-slate-400">Calendar integrations can be added here.</p>
        </article>
      </div>
    </section>
  );
}
