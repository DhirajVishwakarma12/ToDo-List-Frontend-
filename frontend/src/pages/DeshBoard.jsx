import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../config/api";
import Navbar from "../components/navbar/navbar";
import MotivationCard from "../components/Dashboard/Motivation.jsx";
import TaskForm from "../components/Dashboard/TaskForm";
import StatsCards from "../components/Dashboard/StartsCards.jsx";
import TaskList from "../components/Dashboard/TaskList.jsx";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [statsTasks, setStatsTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get("/api/task/viewtask");
        const data = response.data;
        const savedTasks = Array.isArray(data)
          ? data
          : data.tasks || data.task || data.data || [];

        setStatsTasks(Array.isArray(savedTasks) ? savedTasks : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load tasks.");
      }
    };

    loadTasks();
  }, []);

  const addTask = (newTask) => {
    setTasks((prevTasks) => {
      const nextTasks = [...prevTasks, newTask];
      console.log("Task added:", newTask);
      console.log("Current tasks:", nextTasks);
      return nextTasks;
    });
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) => {
      const nextTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      console.log("Task updated:", updatedTask);
      console.log("Current tasks:", nextTasks);
      return nextTasks;
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const nextTasks = prevTasks.filter((task) => task.id !== taskId);
      console.log("Task deleted:", taskId);
      //
      console.log("Current tasks:", nextTasks);
      return nextTasks;
    });
  };

  async function savedall(tasksToSave) {
    const unsavedTasks = Array.isArray(tasksToSave) ? tasksToSave : [];

    if (unsavedTasks.length === 0) {
      toast.error("No tasks to save.");
      return;
    }

    try {
      const payload = unsavedTasks.map((task) => ({
        taskName: task.taskName,
        description: task.description,
        schedule: task.schedule,
        startTime: task.startTime,
        duration: task.duration,
        endTime: task.endTime,
        isPrivate: task.isPrivate,
        priority: task.priority,
        completed: task.completed,
        mode: task.mode,
        taskDate: task.taskDate,
      }));

      const response = await api.post("/api/task/createtask", payload);

      toast.success(response.data.message || "Tasks saved successfully");
      const savedTasks = response.data.tasks || [];
      setStatsTasks((currentTasks) => [...currentTasks, ...savedTasks]);
      setTasks([]);
      setSelectedTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="max-w-[1800px] mx-auto px-6 py-8">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="w-full xl:w-[58%] space-y-8">
              <MotivationCard />

              <TaskForm
                onAddTask={addTask}
                onUpdateTask={updateTask}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
              />
            </div>

            <div className="w-full xl:w-[40%] space-y-6">
              <StatsCards tasks={statsTasks} />

              <TaskList
                tasks={tasks}
                onEditTask={setSelectedTask}
                onDeleteTask={(taskId) =>
                  setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
                }
                onSaveAll={savedall}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
