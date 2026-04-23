const USER_ID = "demo-user";

export const api = {
  userId: USER_ID,
  auth: "/api/auth",
  user: "/api/user",
  task: "/api/task",
  schedule: "/api/schedule",
  timer: "/api/timer",
  analytics: "/api/analytics",
  notifications: "/api/notifications",
};

export async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }
  return data;
}
