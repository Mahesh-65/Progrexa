export default function PlannerPage() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Planner</h2>
      <div className="mt-6 card">
        <h3 className="text-lg font-semibold">Weekly Goals</h3>
        <ul className="mt-3 list-inside list-disc space-y-2 text-slate-300">
          <li>Complete 10 priority tasks</li>
          <li>Keep daily focus sessions above 3 hours</li>
          <li>Plan next week by Friday evening</li>
        </ul>
      </div>
    </section>
  );
}
