import React from "react";

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const isToday = (task) => {
  const taskDate = task.taskDate || task.date || task.scheduledDate || task.dueDate;

  if (taskDate && !Number.isNaN(new Date(taskDate).getTime())) {
    return startOfDay(taskDate).getTime() === startOfDay(new Date()).getTime();
  }

  // Support tasks saved before taskDate was added. Their relative schedule
  // applies to the day on which they were created, not every future day.
  const createdAt = task.createdAt || task.updatedAt;
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) return false;

  const schedule = (task.schedule || task.day || "").toLowerCase();
  const offset = { yesterday: -1, today: 0, tomorrow: 1 }[schedule];
  if (offset === undefined) return false;

  const scheduledDate = new Date(createdAt);
  scheduledDate.setDate(scheduledDate.getDate() + offset);
  return startOfDay(scheduledDate).getTime() === startOfDay(new Date()).getTime();
};

const StatsCards = ({ tasks }) => {
  const todayTasks = (Array.isArray(tasks) ? tasks : []).filter(isToday);
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
