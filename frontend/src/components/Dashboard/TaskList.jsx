import React, { useState } from "react";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onEditTask, onDeleteTask, onSaveAll }) => {
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) =>
    (task.taskName || task.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold dark:text-white">
          Today's Tasks
        </h2>

        <input
          type="text"
          placeholder="🔍 Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-4 px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        />
      </div>

      {/* Task List */}
      <div className="space-y-4  overflow-y-auto pr-2">

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-500">
              No Tasks Found
            </h3>

            <p className="text-gray-400 mt-2">
              Try searching with another keyword.
            </p>
          </div> 
         )}

      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => onSaveAll && onSaveAll(tasks)}
          className="rounded-lg px-5 py-3 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
        >
          Saved
        </button>
      </div>
    </div>
  );
};

export default TaskList;