export default function CalendarPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Calendar</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="card"><h3 className="font-semibold">Today</h3><p className="mt-2 text-slate-400">09:00 - Team standup</p><p className="text-slate-400">14:00 - Product review</p></article>
        <article className="card"><h3 className="font-semibold">Upcoming</h3><p className="mt-2 text-slate-400">Tomorrow - Sprint planning</p><p className="text-slate-400">Friday - Demo day</p></article>
      </div>
    </section>
  );
}
