import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/profile.png";
import api from "../../config/api";

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());

const getTaskDate = (task) => {
  const explicitDate = task.taskDate || task.date || task.scheduledDate || task.dueDate;
  if (explicitDate && isValidDate(explicitDate)) return new Date(explicitDate);

  const createdAt = task.createdAt || task.updatedAt;
  if (!createdAt || !isValidDate(createdAt)) return null;

  const date = new Date(createdAt);
  const schedule = String(task.schedule || task.day || "").trim().toLowerCase();
  const offset = { yesterday: -1, today: 0, tomorrow: 1 }[schedule];
  if (offset === undefined) return null;

  date.setDate(date.getDate() + offset);
  return date;
};

const getProgress = (tasks) => {
  const today = startOfDay(new Date());
  const datedTasks = tasks
    .map((task) => ({ task, date: getTaskDate(task) }))
    .filter(({ date }) => date);
  const isCompleted = (task) =>
    Boolean(task.completed) || task.status === "Completed" || task.mode === "complete";
  const isToday = ({ date }) => startOfDay(date).getTime() === today.getTime();
  const hasPassed = ({ task, date }) => {
    const schedule = String(task.schedule || task.day || "").trim().toLowerCase();
    return schedule !== "tomorrow" && startOfDay(date).getTime() <= today.getTime();
  };
  const calculate = (taskList) => ({
    total: taskList.length,
    completed: taskList.filter(({ task }) => isCompleted(task)).length,
  });

  return {
    today: calculate(datedTasks.filter(isToday)),
    overall: calculate(datedTasks.filter(hasPassed)),
  };
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [progress, setProgress] = useState({
    today: { total: 0, completed: 0 },
    overall: { total: 0, completed: 0 },
  });

  useEffect(() => {
    const fetchProfileAndTasks = async () => {
      try {
        const [profileResponse, taskResponse] = await Promise.all([
          api.get('/api/profile/viewprofile'),
          api.get('/api/task/viewtask'),
        ]);

        const userData = profileResponse.data.user[0];

        setUser({
          username: userData.username,
          email: userData.email,
        });

        const taskData = taskResponse.data;
        const tasks = Array.isArray(taskData)
          ? taskData
          : taskData.tasks || taskData.task || taskData.data || [];
        setProgress(getProgress(Array.isArray(tasks) ? tasks : []));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileAndTasks();
  }, []);

  const renderProgress = (label, data) => {
    const percent = data.total ? Math.round((data.completed / data.total) * 100) : 0;

    return (
      <div className="rounded-xl bg-slate-800 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">{label}</h2>
          <span className="text-sm font-bold text-blue-400">{percent}%</span>
        </div>
        <p className="mb-3 text-xs text-slate-400">
          {data.completed} completed of {data.total} tasks
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative bg-slate-950 flex items-center justify-center px-4 py-10">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="absolute left-4 top-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 transition z-10"
      >
        ← Back
      </button>

      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">


        <div className="flex flex-col items-center">
          <img
            src={profile}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
          />

          <h1 className="mt-4 text-3xl font-bold text-white">
            {user.username}
          </h1>

          <p className="text-slate-400 text-sm">
            Welcome Back 👋
          </p>
        </div>

        <hr className="my-6 border-slate-700" />

        <div className="mb-5">
          <h2 className="text-sm text-slate-400 mb-2">
            Username
          </h2>

          <div className="bg-slate-800 rounded-lg p-3 text-white">
            {user.username}
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-sm text-slate-400 mb-2">
            Email Address
          </h2>

          <div className="bg-slate-800 rounded-lg p-3 text-white">
            {user.email}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm text-slate-400 mb-2">
            Password
          </h2>

          <div className="bg-slate-800 rounded-lg p-3 text-white">
            ••••••••••••
          </div>

          <p className="text-xs italic text-white/60 mt-2">
            Hidden for security 🔐
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-white">Task Progress</h2>
          {renderProgress("Today's Progress", progress.today)}
          {renderProgress("All Passed Days", progress.overall)}
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg text-white font-semibold">
            Edit Profile
          </button>

          <button className="flex-1 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg text-white font-semibold">
            Change Password
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
