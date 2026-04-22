import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 82 },
  { day: "Thu", score: 74 },
  { day: "Fri", score: 89 },
  { day: "Sat", score: 68 },
  { day: "Sun", score: 73 },
];

export default function AnalyticsPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Analytics</h2>
      <article className="mt-6 card h-80">
        <h3 className="mb-4 font-semibold">Weekly Productivity Score</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </article>
    </section>
  );
}
