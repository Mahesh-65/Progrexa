import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
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

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <aside className="w-72 border-r border-slate-200 bg-white/70 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h1 className="text-2xl font-bold text-brand-500">TimeFlow</h1>
            <p className="mt-1 text-sm text-slate-500">Progrexa Platform</p>
            <nav className="mt-8 space-y-2">
              <Link className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to="/login">Login</Link>
              <Link className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to="/register">Register</Link>
              {links.map(([to, label]) => (
                <Link key={to} className="block rounded-xl px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800" to={to}>{label}</Link>
              ))}
            </nav>
            <button className="mt-6 w-full rounded-xl bg-brand-500 py-2 font-medium text-white hover:bg-brand-600" onClick={() => setDark((v) => !v)}>
              Toggle {dark ? "Light" : "Dark"} Mode
            </button>
          </aside>

          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/focus" element={<FocusTimerPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
