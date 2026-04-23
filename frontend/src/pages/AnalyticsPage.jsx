export default function AnalyticsPage() {
  return (
    <section className="space-y-4">
      <h2 className="page-title">Analytics</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="card">
          <p className="text-slate-400">Tasks Completed</p>
          <p className="mt-2 text-2xl font-bold text-white">34</p>
        </article>
        <article className="card">
          <p className="text-slate-400">Focus Minutes</p>
          <p className="mt-2 text-2xl font-bold text-white">780</p>
        </article>
        <article className="card">
          <p className="text-slate-400">Weekly Score</p>
          <p className="mt-2 text-2xl font-bold text-white">82%</p>
        </article>
      </div>
    </section>
  );
}
