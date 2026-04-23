import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, request } from "../api";

export default function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await request(`${api.auth}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      nav("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-200">
      <form onSubmit={submit} className="w-full max-w-xl space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">Register</h2>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.full_name}
          onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.username}
          onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <select
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.gender}
          onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          min="10"
          max="120"
          placeholder="Age"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.age}
          onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
          value={form.confirm_password}
          onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
          required
        />
        <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium">Create Account</button>
        <Link className="block text-sm text-indigo-300" to="/login">
          Already Have an Account? Login
        </Link>
      </form>
    </div>
  );
}
