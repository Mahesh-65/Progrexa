import { Link, useLocation } from "react-router-dom";

const links = [
  ["Dashboard", "/dashboard"],
  ["Tasks", "/tasks"],
  ["Schedule", "/schedule"],
  ["Time Tracker", "/time-tracker"],
  ["Analytics", "/analytics"],
  ["Notifications", "/notifications"],
  ["Profile", "/profile"],
];

export default function Layout({ onLogout, children }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl gap-4 p-4 md:p-6">
        <aside className="hidden w-60 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:block">
          <h1 className="mb-4 text-xl font-bold text-indigo-300">Prorexa</h1>
          <nav className="space-y-2">
            {links.map(([name, path]) => (
              <Link
                key={path}
                to={path}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  loc.pathname === path ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
          <button onClick={onLogout} className="mt-6 w-full rounded-lg bg-rose-600 px-3 py-2 text-sm">
            Logout
          </button>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
