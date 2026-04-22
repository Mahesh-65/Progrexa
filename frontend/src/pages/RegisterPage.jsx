export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-xl card">
      <h2 className="text-2xl font-semibold">Register</h2>
      <div className="mt-4 grid gap-3">
        <input className="rounded-xl border border-slate-700 bg-slate-950 p-3" placeholder="Full Name" />
        <input className="rounded-xl border border-slate-700 bg-slate-950 p-3" placeholder="Email" />
        <input type="password" className="rounded-xl border border-slate-700 bg-slate-950 p-3" placeholder="Password" />
        <button className="rounded-xl bg-brand-500 py-3 font-medium text-white">Create Account</button>
      </div>
    </section>
  );
}
