const serviceBase = {
  auth: import.meta.env.VITE_AUTH_API || "http://localhost:8001",
  user: import.meta.env.VITE_USER_API || "http://localhost:8002",
  task: import.meta.env.VITE_TASK_API || "http://localhost:8003",
  schedule: import.meta.env.VITE_SCHEDULE_API || "http://localhost:8004",
  tracker: import.meta.env.VITE_TRACKER_API || "http://localhost:8005",
  analytics: import.meta.env.VITE_ANALYTICS_API || "http://localhost:8006",
  notify: import.meta.env.VITE_NOTIFY_API || "http://localhost:8007",
};

export async function apiGet(service, path) {
  const res = await fetch(`${serviceBase[service]}${path}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

export async function apiPost(service, path, payload) {
  const res = await fetch(`${serviceBase[service]}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}
