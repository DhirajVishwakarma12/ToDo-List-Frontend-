import React, { useEffect, useState } from "react";
import api from "../../config/api";

const TaskCardView = ({
  task,
  onComplete,
  completeDisabled = false,
  completeDisabledMessage = "",
  isFutureTask = false,
  isCompleting = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setShowDetails(false);
    setShowPasswordPrompt(false);
    setPasswordInput("");
    setPasswordError("");
    setIsAuthorized(false);
  }, [task]);

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
  const priorityClass =
    task.priority === "High"
      ? "bg-red-500"
      : task.priority === "Medium"
      ? "bg-yellow-500 text-slate-900"
      : "bg-green-500";
  const isLocked = Boolean(task.isPrivate);
  const canViewDetails = !isLocked || isAuthorized;

  const handleToggleDetails = () => {
    if (showDetails) {
      setShowDetails(false);
      setIsAuthorized(false);
      setPasswordInput("");
      setPasswordError("");
      setShowPasswordPrompt(false);
      return;
    }

    if (isLocked && !isAuthorized) {
      setPasswordInput("");
      setPasswordError("");
      setShowPasswordPrompt(true);
      return;
    }

    setShowDetails(true);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordInput.trim()) {
      setPasswordError("Password is required.");
      return;
    }

    try {
      await api.post("/api/profile/verify-private-password", { password: passwordInput });
      setIsAuthorized(true);
      setShowPasswordPrompt(false);
      setShowDetails(true);
      setPasswordError("");
    } catch (error) {
      const message = error.response?.data?.message || "Incorrect password.";
      setPasswordError(message);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordPrompt(false);
    setPasswordInput("");
    setPasswordError("");
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl px-5 py-3 shadow-md transition-all duration-300 ${
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

      <div className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-sm font-semibold text-white ${priorityClass}`}>
        {task.priority || "No priority"}
      </div>

      {showPasswordPrompt && !canViewDetails && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This task is private. Enter the password to view details.
          </p>
          <form onSubmit={handlePasswordSubmit} className="mt-3 space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Unlock
              </button>
              <button
                type="button"
                onClick={handleCancelPassword}
                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-400 dark:bg-slate-700 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showDetails && canViewDetails && (
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
          onClick={handleToggleDetails}
          aria-expanded={showDetails}
          className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm text-white transition hover:bg-indigo-600"
        >
          {showDetails && canViewDetails ? "Hide details" : "View"}
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
