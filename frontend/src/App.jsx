import { useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import PlannerPage from "./pages/PlannerPage";
import FocusTimerPage from "./pages/FocusTimerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

const links = [
  ["/dashboard", "Dashboard"],
  ["/tasks", "Tasks"],
  ["/calendar", "Calendar"],
  ["/planner", "Planner"],
  ["/focus", "Focus Timer"],
  ["/analytics", "Analytics"],
  ["/notifications", "Notifications"],
  ["/profile", "Profile"],
];

function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("timeflow_user");
    return raw ? JSON.parse(raw) : null;
  });
  const isLoggedIn = useMemo(() => Boolean(user?.id), [user]);
  const onLogin = (nextUser) => {
    localStorage.setItem("timeflow_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };
  const onLogout = () => {
    localStorage.removeItem("timeflow_user");
    setUser(null);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-rose-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 border-r border-slate-200 bg-white/80 p-5 backdrop-blur-lg lg:block dark:border-slate-800 dark:bg-slate-900/70">
            <h1 className="text-2xl font-bold text-brand-500">TimeFlow</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Personal Day Planner</p>
            <nav className="mt-8 space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to="/login">Login</Link>
                  <Link className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to="/register">Register</Link>
                </>
              ) : (
                <>
                  {links.map(([to, label]) => (
                    <Link key={to} className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to={to}>{label}</Link>
                  ))}
                  <button className="mt-2 w-full rounded-xl border border-slate-300 py-2 text-sm font-medium dark:border-slate-700" onClick={onLogout}>
                    Logout
                  </button>
                </>
              )}
            </nav>
            <button className="mt-6 w-full rounded-xl bg-brand-500 py-2 font-medium text-white hover:bg-brand-600" onClick={() => setDark((v) => !v)}>
              Toggle {dark ? "Light" : "Dark"} Mode
            </button>
          </aside>

          <main className="flex-1 p-4 lg:p-6">
            <header className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-brand-500">TimeFlow</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-700" to="/login">Login</Link>
                    <Link className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-700" to="/register">Register</Link>
                  </>
                ) : (
                  <>
                    {links.map(([to, label]) => (
                      <Link key={to} className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-700" to={to}>
                        {label}
                      </Link>
                    ))}
                    <button className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-700" onClick={onLogout}>
                      Logout
                    </button>
                  </>
                )}
                <button className="rounded-lg bg-brand-500 px-3 py-1 text-sm text-white" onClick={() => setDark((v) => !v)}>
                  {dark ? "Light" : "Dark"}
                </button>
              </div>
            </header>
            <Routes>
              <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
              <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
              <Route path="/register" element={<RegisterPage onLogin={onLogin} />} />
              <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />} />
              <Route path="/tasks" element={isLoggedIn ? <TasksPage /> : <Navigate to="/login" replace />} />
              <Route path="/calendar" element={isLoggedIn ? <CalendarPage /> : <Navigate to="/login" replace />} />
              <Route path="/planner" element={isLoggedIn ? <PlannerPage /> : <Navigate to="/login" replace />} />
              <Route path="/focus" element={isLoggedIn ? <FocusTimerPage /> : <Navigate to="/login" replace />} />
              <Route path="/analytics" element={isLoggedIn ? <AnalyticsPage /> : <Navigate to="/login" replace />} />
              <Route path="/notifications" element={isLoggedIn ? <NotificationsPage /> : <Navigate to="/login" replace />} />
              <Route path="/profile" element={isLoggedIn ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
