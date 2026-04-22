export default function NotificationsPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Notifications</h2>
      <div className="mt-6 space-y-3">
        <article className="card"><p className="font-semibold">Task Reminder</p><p className="text-slate-400">Finish your dashboard redesign by 6 PM.</p></article>
        <article className="card"><p className="font-semibold">Daily Summary</p><p className="text-slate-400">You completed 7 of 9 planned tasks.</p></article>
      </div>
    </section>
  );
}
