const USER_ID = "demo-user";

export const api = {
  userId: USER_ID,
  auth: "http://localhost:8001",
  user: "http://localhost:8002",
  task: "http://localhost:8003",
  schedule: "http://localhost:8004",
  timer: "http://localhost:8005",
  analytics: "http://localhost:8006",
  notifications: "http://localhost:8007",
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
