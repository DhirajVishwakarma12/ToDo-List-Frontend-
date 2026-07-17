import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../config/api";
import Navbar from "../components/navbar/navbar";
import TaskCardView from "../components/Dashboard/TaskCardView";

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const isOnDate = (value, date) => {
  if (!value) return false;

  const taskDate = new Date(value);
  return (
    !Number.isNaN(taskDate.getTime()) &&
    startOfDay(taskDate).getTime() === startOfDay(date).getTime()
  );
};

const getTaskDate = (task) => task.taskDate || task.date || task.scheduledDate || task.dueDate;

const getSchedule = (task) => task.schedule?.toLowerCase();

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());

const getCreationDate = (task) => {
  const storedDate = task.createdAt || task.updatedAt;
  if (storedDate && isValidDate(storedDate)) return storedDate;

  // MongoDB ObjectIds contain the document creation timestamp in their first
  // eight characters. This keeps previously saved tasks working as well.
  const id = String(task._id || task.id || "");
  if (/^[a-f\d]{24}$/i.test(id)) {
    return new Date(Number.parseInt(id.slice(0, 8), 16) * 1000);
  }

  return null;
};

const getScheduledDate = (task) => {
  const explicitDate = getTaskDate(task);
  if (explicitDate && isValidDate(explicitDate)) return explicitDate;

  // Older tasks only store a relative schedule label. Use their creation date
  // to turn that label into a fixed date, so "Today" does not stay today forever.
  const createdAt = getCreationDate(task);
  if (!createdAt) return null;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  const scheduleOffsets = { today: 0, tomorrow: 1, yesterday: -1 };
  const offset = scheduleOffsets[getSchedule(task)];
  if (offset === undefined) return null;

  date.setDate(date.getDate() + offset);
  return date;
};

const isScheduledFor = (task, date, scheduleName) => {
  const scheduledDate = getScheduledDate(task);
  return scheduledDate
    ? isOnDate(scheduledDate, date)
    : getSchedule(task) === scheduleName;
};

const getTimeInMinutes = (value) => {
  if (!value || typeof value !== "string") return null;

  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toLowerCase();

  if (minutes > 59 || hours > 23 || (!period && hours > 23)) return null;
  if (period) {
    if (hours < 1 || hours > 12) return null;
    hours = hours % 12 + (period === "pm" ? 12 : 0);
  }

  return hours * 60 + minutes;
};

const ViewTask = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const [completingTaskId, setCompletingTaskId] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get("/api/task/viewtask");
        const data = response.data;
        const taskList = Array.isArray(data)
          ? data
          : data.tasks || data.task || data.data || [];

        setTasks(Array.isArray(taskList) ? taskList : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load tasks.");
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter((task) => isScheduledFor(task, today, "today"));

  const tomorrowTasks = tasks.filter((task) => isScheduledFor(task, tomorrow, "tomorrow"));

  const upcomingTasks = tasks.filter((task) => {
    const taskDate = getScheduledDate(task);
    const schedule = getSchedule(task);
    return (
      schedule === "upcoming" ||
      schedule === "future" ||
      (taskDate && startOfDay(new Date(taskDate)).getTime() > tomorrow.getTime())
    );
  });

  const yesterdayTasks = tasks.filter((task) => isScheduledFor(task, yesterday, "yesterday"));

  const hasVisibleTasks =
    todayTasks.length > 0 ||
    tomorrowTasks.length > 0 ||
    upcomingTasks.length > 0 ||
    yesterdayTasks.length > 0;

  const getCompletionState = (task) => {
    if (!isScheduledFor(task, today, "today")) {
      return { disabled: true, message: "Only today's tasks can be completed." };
    }

    const startMinutes = getTimeInMinutes(task.startTime);
    const endMinutes = getTimeInMinutes(task.endTime);

    if (startMinutes === null || endMinutes === null) {
      return { disabled: true, message: "Set a valid start and end time to complete this task." };
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const crossesMidnight = endMinutes <= startMinutes;
    const isInTimeWindow = crossesMidnight
      ? nowMinutes >= startMinutes || nowMinutes < endMinutes
      : nowMinutes >= startMinutes && nowMinutes < endMinutes;

    if (!isInTimeWindow) {
      const message = nowMinutes < startMinutes
        ? `Available from ${task.startTime}.`
        : `The completion window ended at ${task.endTime}.`;
      return { disabled: true, message };
    }

    return { disabled: false, message: "" };
  };

  const completeTask = async (taskId) => {
    const task = tasks.find((item) => (item._id || item.id) === taskId);
    if (!task) return;

    const completionState = getCompletionState(task);
    if (completionState.disabled) {
      toast.info(completionState.message);
      return;
    }

    try {
      setCompletingTaskId(taskId);
      const response = await api.patch(`/api/task/completetask/${taskId}`, {
        completed: true,
        status: "Completed",
      });
      const updatedTask = response.data?.task || response.data?.data;

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          (currentTask._id || currentTask.id) === taskId
            ? { ...currentTask, ...updatedTask, completed: true, status: "Completed" }
            : currentTask
        )
      );
      toast.success(response.data?.message || "Task marked as completed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to complete this task.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  const renderSection = (title, sectionTasks, { future = false } = {}) => (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {sectionTasks.length}
        </span>
      </div>

      {sectionTasks.length ? (
        <div className="space-y-4">
          {sectionTasks.map((task) => (
            <TaskCardView
              key={task._id || task.id}
              task={task}
              isFutureTask={future}
              onComplete={completeTask}
              isCompleting={completingTaskId === (task._id || task.id)}
              completeDisabled={future || getCompletionState(task).disabled}
              completeDisabledMessage={
                future ? "Future tasks cannot be completed yet." : getCompletionState(task).message
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
          No tasks for {title.toLowerCase()}.
        </div>
      )}
    </section>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 pt-28 dark:bg-slate-950">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="mx-auto max-w-5xl space-y-10 px-6 py-8">
          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm dark:bg-slate-800 dark:text-gray-300">
              Loading tasks...
            </div>
          ) : (
            <>
              {tasks.length > 0 && !hasVisibleTasks && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  Tasks loaded from backend, but none are scheduled for today,
                  tomorrow, or yesterday.
                </div>
              )}
              {renderSection("Today's Tasks", todayTasks)}
              {renderSection("Tomorrow's Tasks", tomorrowTasks, { future: true })}
              {renderSection("Upcoming Tasks", upcomingTasks, { future: true })}
              {renderSection("Yesterday's Tasks", yesterdayTasks)}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewTask;
