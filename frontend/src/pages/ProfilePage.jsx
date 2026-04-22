export default function ProfilePage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Profile</h2>
      <div className="mt-6 card grid gap-3 max-w-2xl">
        <input className="rounded-xl border border-slate-700 bg-slate-950 p-3" defaultValue="Alex Johnson" />
        <input className="rounded-xl border border-slate-700 bg-slate-950 p-3" defaultValue="alex@timeflow.app" />
        <input className="rounded-xl border border-slate-700 bg-slate-950 p-3" defaultValue="Asia/Kolkata" />
        <select className="rounded-xl border border-slate-700 bg-slate-950 p-3"><option>Dark</option><option>Light</option></select>
        <button className="rounded-xl bg-brand-500 py-3 text-white">Save Profile</button>
      </div>
    </section>
  );
}
