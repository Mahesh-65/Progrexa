import { useState } from "react";

export default function TimeTrackerPage() {
  const [minutes, setMinutes] = useState(25);
  return (
    <section className="space-y-4">
      <h2 className="page-title">Time Tracker</h2>
      <div className="card">
        <p className="text-sm text-slate-400">Pomodoro Focus Session</p>
        <p className="mt-2 text-4xl font-bold text-white">{minutes}:00</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => setMinutes(25)} className="rounded-lg bg-indigo-600 px-4 py-2">Focus</button>
          <button onClick={() => setMinutes(5)} className="rounded-lg bg-emerald-600 px-4 py-2">Break</button>
        </div>
      </div>
    </section>
  );
}
