export default function ProfilePage() {
  return (
    <section className="space-y-4">
      <h2 className="page-title">Profile Settings</h2>
      <div className="card grid gap-3 sm:grid-cols-2">
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" defaultValue="Demo User" />
        <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" defaultValue="demo@example.com" />
        <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
          <option>Dark Theme</option>
          <option>Light Theme</option>
        </select>
        <button className="rounded-lg bg-indigo-600 px-4 py-2">Save Preferences</button>
      </div>
    </section>
  );
}
