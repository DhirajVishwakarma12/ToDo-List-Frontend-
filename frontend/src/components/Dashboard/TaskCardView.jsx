import React, { useState } from "react";

const TaskCardView = ({
  task,
  onComplete,
  completeDisabled = false,
  completeDisabledMessage = "",
  isFutureTask = false,
  isCompleting = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!task) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-center text-gray-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
        No task selected.
      </div>
    );
  }

  const timeLabel = task.startTime || "No start time";
  const fullTimeLabel = task.startTime
    ? `${task.startTime}${task.endTime ? ` - ${task.endTime}` : ""}`
    : "No time";

  const completed = Boolean(task.completed) || task.status === "Completed";

  return (
    <div
      className={`bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3 shadow-md transition-all duration-300 ${
        isFutureTask
          ? "pointer-events-none select-none opacity-55 blur-[1px]"
          : "hover:shadow-xl"
      }`}
      aria-disabled={isFutureTask}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold dark:text-white">
            {task.taskName || task.title}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start time: {timeLabel}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400">
            {task.description || "No description"}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3 text-sm md:grid-cols-4">
            <div>
              <p className="text-gray-500">Schedule</p>
              <p className="font-medium dark:text-white">{task.schedule || task.day || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium dark:text-white">{fullTimeLabel}</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium dark:text-white">{task.duration ? `${task.duration} Hour` : "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-500">Visibility</p>
              <p className="font-medium dark:text-white">{task.isPrivate ? "Private" : "Public"}</p>
            </div>
            <div>
              <p className="text-gray-500">Priority</p>
              <p className="font-medium dark:text-white">{task.priority || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium dark:text-white">{completed ? "Completed" : "Pending"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-end gap-3">
        <button
          onClick={() => setShowDetails((current) => !current)}
          aria-expanded={showDetails}
          className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm text-white transition hover:bg-indigo-600"
        >
          {showDetails ? "Hide details" : "View"}
        </button>

        {!completed && (
          <button
            onClick={() => onComplete && onComplete(task._id || task.id)}
            disabled={completeDisabled || isCompleting}
            title={completeDisabledMessage}
            className={`rounded-lg px-4 py-1.5 text-sm text-white transition ${
              completeDisabled || isCompleting
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isCompleting ? "Completing..." : "Complete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCardView;
