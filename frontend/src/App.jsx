import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import SchedulePage from "./pages/SchedulePage";
import TimeTrackerPage from "./pages/TimeTrackerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

function Protected({ authed, onLogout, children }) {
  if (!authed) return <Navigate to="/login" replace />;
  return <Layout onLogout={onLogout}>{children}</Layout>;
}

export default function App() {
  const [authed, setAuthed] = useState(localStorage.getItem("authed") === "1");

  const logout = () => {
    localStorage.removeItem("authed");
    setAuthed(false);
  };

  return (
    <div className="dark">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage setAuthed={setAuthed} />} />
        <Route path="/dashboard" element={<Protected authed={authed} onLogout={logout}><DashboardPage /></Protected>} />
        <Route path="/tasks" element={<Protected authed={authed} onLogout={logout}><TasksPage /></Protected>} />
        <Route path="/schedule" element={<Protected authed={authed} onLogout={logout}><SchedulePage /></Protected>} />
        <Route path="/time-tracker" element={<Protected authed={authed} onLogout={logout}><TimeTrackerPage /></Protected>} />
        <Route path="/analytics" element={<Protected authed={authed} onLogout={logout}><AnalyticsPage /></Protected>} />
        <Route path="/notifications" element={<Protected authed={authed} onLogout={logout}><NotificationsPage /></Protected>} />
        <Route path="/profile" element={<Protected authed={authed} onLogout={logout}><ProfilePage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
