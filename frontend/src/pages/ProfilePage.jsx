export default function ProfilePage({ user }) {
  return (
    <section>
      <h2 className="text-3xl font-bold">Profile</h2>
      <div className="mt-6 card grid max-w-2xl gap-3">
        <input className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" defaultValue={user?.full_name || "Your Name"} />
        <input className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" defaultValue={user?.email || "your@email.com"} />
        <input className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" defaultValue="Asia/Kolkata" />
        <select className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"><option>Dark</option><option>Light</option></select>
        <button className="rounded-xl bg-brand-500 py-3 text-white">Save Profile</button>
      </div>
    </section>
  );
}
