const serviceBase = {
  auth: "http://localhost:8001",
  user: "http://localhost:8002",
  task: "http://localhost:8003",
  schedule: "http://localhost:8004",
  tracker: "http://localhost:8005",
  analytics: "http://localhost:8006",
  notify: "http://localhost:8007",
};

export async function apiGet(service, path) {
  const res = await fetch(`${serviceBase[service]}${path}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function apiPost(service, path, payload) {
  const res = await fetch(`${serviceBase[service]}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
