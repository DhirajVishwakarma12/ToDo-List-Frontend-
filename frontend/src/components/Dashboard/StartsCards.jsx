import React from "react";

const StatsCards = ({ tasks }) => {
  const todayTasks = tasks.filter(
    (task) => (task.schedule || task.day || "").toLowerCase() === "today"
  );
  const total = todayTasks.length;
  const completed = todayTasks.filter(
    (task) => task.completed || task.status === "Completed" || task.mode === "complete"
  ).length;
  const pending = total - completed;

  const stats = [
    {
      title: "Total",
      value: total,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: completed,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: pending,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6 mt-20">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 flex flex-col items-center justify-center hover:shadow-lg transition"
        >
          <div
            className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white text-xl font-bold`}
          >
            {item.value}
          </div>

          <h3 className="mt-3 text-lg font-semibold dark:text-white">
            {item.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
