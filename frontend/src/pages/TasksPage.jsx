export default function TasksPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Tasks</h2>
      <div className="mt-6 card">
        <div className="flex flex-wrap gap-3">
          <input className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3" placeholder="New task title" />
          <button className="rounded-xl bg-brand-500 px-4 py-2 text-white">Add Task</button>
        </div>
        <ul className="mt-6 space-y-3">
          <li className="rounded-xl border border-slate-700 p-3">Design weekly planner screen</li>
          <li className="rounded-xl border border-slate-700 p-3">Review analytics report flow</li>
          <li className="rounded-xl border border-slate-700 p-3">Prepare tomorrow meeting notes</li>
        </ul>
      </div>
    </section>
  );
}
