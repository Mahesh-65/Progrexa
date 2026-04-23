import { useEffect, useState } from "react";
import { api, request } from "../api";

export default function TasksPage() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);

  const load = async () => {
    const res = await request(`${api.task}/tasks/${api.userId}`);
    setItems(res.data);
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await request(`${api.task}/tasks`, {
      method: "POST",
      body: JSON.stringify({ user_id: api.userId, title, status: "todo", priority: "high", tags: [] }),
    });
    setTitle("");
    load();
  };

  return (
    <section className="space-y-4">
      <h2 className="page-title">Tasks</h2>
      <form onSubmit={add} className="card flex gap-2">
        <input className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" required />
        <button className="rounded-lg bg-indigo-600 px-4">Add</button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-slate-400">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
