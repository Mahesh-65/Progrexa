import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiPost("auth", "/register", form);
      const user = await apiPost("auth", "/login", { email: form.email, password: form.password });
      onLogin(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-8 max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-3xl font-bold">Create Your Account</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Start planning your day with TimeFlow.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
          required
        />
        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          minLength={6}
          required
        />
        {error && <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">{error}</p>}
        <button disabled={loading} className="rounded-xl bg-brand-500 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-60">
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}
