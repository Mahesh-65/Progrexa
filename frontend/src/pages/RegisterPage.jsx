import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <section className="mx-auto mt-10 max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Register</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Create your account and start planning your day.</p>
      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
          required
        />
        <input
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder-slate-500 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          minLength={6}
          required
        />
        {error && <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
        <button className="rounded-xl bg-brand-500 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-60" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}
