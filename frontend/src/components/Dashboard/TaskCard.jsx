import React from "react";

const TaskCard = ({ task, onEdit, onDelete, onSave }) => {
  const timeLabel = task.startTime
    ? `${task.startTime}${task.endTime ? ` - ${task.endTime}` : ""}`
    : "No time";

  return (
    <div className="border rounded-xl p-4 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-lg font-semibold dark:text-white">
            {task.taskName || task.title || "Untitled task"}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {task.description || "No description"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs text-white ${
            task.priority === "High"
              ? "bg-red-500"
              : task.priority === "Medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {task.priority}
        </span>

      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">

        <span>📅 {(task.schedule || task.day) ?? "No date"}</span>

        <span>⏰ {task.duration ? `${task.duration}h` : "No duration"}</span>

        <span>🕒 {timeLabel}</span>

        <span>{task.isPrivate ? "🔒 Private" : "🌍 Public"}</span>

      </div>

      <div className="flex justify-end gap-3 mt-4">

        <button
          type="button"
          onClick={() => onEdit && onEdit(task)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete && onDelete(task.id)}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default TaskCard;