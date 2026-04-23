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
    age: 18,
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await request(`${api.auth}/auth/register`, { method: "POST", body: JSON.stringify(form) });
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
        {Object.keys(form).map((k) => (
          <input
            key={k}
            type={k.includes("password") ? "password" : k === "age" ? "number" : "text"}
            placeholder={k.replaceAll("_", " ")}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            value={form[k]}
            onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
            required
          />
        ))}
        <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium">Create Account</button>
        <Link className="block text-sm text-indigo-300" to="/login">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
