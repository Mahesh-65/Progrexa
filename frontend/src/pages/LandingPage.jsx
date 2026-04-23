import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-200">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-300">Prorexa</h1>
        <p className="mt-3 text-slate-400">Personal productivity hub for tasks, planning, focus, and insights.</p>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link to="/register" className="rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white">
            Register
          </Link>
          <Link to="/login" className="rounded-xl border border-slate-700 px-4 py-3 font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
