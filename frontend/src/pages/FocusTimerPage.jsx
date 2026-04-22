export default function FocusTimerPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Focus Timer</h2>
      <div className="mt-6 card text-center">
        <p className="text-sm text-slate-400">Pomodoro Session</p>
        <p className="my-6 text-6xl font-bold">25:00</p>
        <div className="flex justify-center gap-3">
          <button className="rounded-xl bg-emerald-500 px-4 py-2">Start</button>
          <button className="rounded-xl bg-amber-500 px-4 py-2">Pause</button>
          <button className="rounded-xl bg-rose-500 px-4 py-2">Stop</button>
        </div>
      </div>
    </section>
  );
}
