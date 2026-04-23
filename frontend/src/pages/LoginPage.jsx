import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, request } from "../api";

export default function LoginPage({ setAuthed }) {
  const nav = useNavigate();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await request(`${api.auth}/auth/login`, { method: "POST", body: JSON.stringify({ identity, password }) });
      localStorage.setItem("authed", "1");
      setAuthed(true);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-200">
      <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold text-white">Login</h2>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Username or Email" value={identity} onChange={(e) => setIdentity(e.target.value)} required />
        <input type="password" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium">Sign In</button>
        <Link className="block text-sm text-indigo-300" to="/register">Create Account</Link>
      </form>
    </div>
  );
}
