import React, { useEffect, useState } from "react";

const TaskForm = ({ onAddTask, onUpdateTask, selectedTask, setSelectedTask }) => {
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errors, setErrors] = useState({});

    const calculateEndTime = (startTimeValue, durationValue) => {
        if (!startTimeValue || !durationValue) return "";

        const numericDuration = Number(durationValue);
        if (Number.isNaN(numericDuration) || numericDuration <= 0) return "";

        const [hours, minutes = "0"] = startTimeValue.split(":");
        const startMinutes = Number(hours) * 60 + Number(minutes);
        const totalMinutes = startMinutes + numericDuration * 60;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;

        return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!taskName.trim()) {
            nextErrors.taskName = "Task name is required.";
        }

        if (!schedule) {
            nextErrors.schedule = "Please choose Today or Tomorrow.";
        }

        if (!startTime) {
            nextErrors.startTime = "Please choose a start time.";
        } else if (schedule === "Today") {
            const [hours, minutes] = startTime.split(":").map(Number);
            const selectedMinutes = hours * 60 + minutes;
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            if (selectedMinutes < currentMinutes) {
                nextErrors.startTime = "Today's start time cannot be earlier than the current time.";
            }
        }

        const numericDuration = Number(duration);

        if (!duration || numericDuration <= 0) {
            nextErrors.duration = "Duration must be at least 1 hour.";
        } else if (numericDuration > 4) {
            nextErrors.duration = "Duration cannot be more than 4 hours.";
        }

        if (!priority) {
            nextErrors.priority = "Please select a priority.";
        }

        return nextErrors;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const nextErrors = validateForm();

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const endTime = calculateEndTime(startTime, duration);
        const taskDate = new Date();
        if (schedule === "Tomorrow") {
            taskDate.setDate(taskDate.getDate() + 1);
        }

        if (selectedTask) {
            const updatedTask = {
                ...selectedTask,
                taskName: taskName.trim() || selectedTask.taskName || selectedTask.title || "Untitled task",
                description: description.trim() || selectedTask.description || "No description",
                schedule: schedule || selectedTask.schedule || selectedTask.day || "",
                startTime: startTime || selectedTask.startTime || "",
                duration: duration || selectedTask.duration || "",
                endTime: endTime || selectedTask.endTime || "",
                priority: priority || selectedTask.priority || "",
                isPrivate: typeof isPrivate === "boolean" ? isPrivate : selectedTask.isPrivate || false,
                completed: selectedTask.completed ?? false,
                createdAt: selectedTask.createdAt ?? new Date().toLocaleString(),
                // Keep the saved date aligned with the schedule selected during editing.
                taskDate: taskDate.toISOString(),
            };

            if (onUpdateTask) {
                onUpdateTask(updatedTask);
            }
            setSelectedTask(null);
            resetForm();
        } else {
            const task = {
                id: Date.now(),
                taskName: taskName.trim() || "Untitled task",
                description: description.trim() || "No description",
                schedule,
                startTime,
                duration,
                endTime,
                priority,
                isPrivate,
                completed: false,
                createdAt: new Date().toLocaleString(),
                taskDate: taskDate.toISOString(),
            };

            if (onAddTask) {
                onAddTask(task);
            }
            resetForm();
        }
    };

    const resetForm = () => {
        setTaskName("");
        setDescription("");
        setSchedule("");
        setStartTime("");
        setDuration("");
        setPriority("");
        setIsPrivate(false);
        setErrors({});
    };

    const cancelEdit = () => {
        setSelectedTask(null);
        resetForm();
    };

    useEffect(() => {
        if (selectedTask) {
            setTaskName(selectedTask.taskName || selectedTask.title || "");
            setDescription(selectedTask.description || "");
            setSchedule(selectedTask.schedule || selectedTask.day || "");
            setStartTime(selectedTask.startTime || "");
            setDuration(selectedTask.duration || "");
            setPriority(selectedTask.priority || "");
            setIsPrivate(selectedTask.isPrivate || false);
        }
    }, [selectedTask]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 mt-20">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
                {selectedTask ? "Edit Task" : "Create New Task"}
            </h2>

            <form onSubmit={submitHandler} className="space-y-5">
                {/* Task Name */}
                <div>
                    <label className="block mb-2 font-medium dark:text-white">
                        Task Name
                    </label>

                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name"
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                    {errors.taskName && (
                        <p className="mt-2 text-sm text-red-500">{errors.taskName}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 font-medium dark:text-white">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className="w-full rounded-lg border px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    />
                </div>

                {/* Schedule */}
                <div>
                    <label className="block mb-2 font-medium dark:text-white">
                        Schedule
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setSchedule("Today")}
                            className={`cursor-pointer py-3 rounded-lg font-semibold transition-all ${schedule === "Today"
                                    ? "bg-green-500 text-white scale-105 shadow-lg"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={() => setSchedule("Tomorrow")}
                            className={`cursor-pointer py-3 rounded-lg font-semibold transition-all ${schedule === "Tomorrow"
                                    ? "bg-green-500 text-white scale-105 shadow-lg"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        >
                            Tomorrow
                        </button>
                    </div>
                    {errors.schedule && (
                        <p className="mt-2 text-sm text-red-500">{errors.schedule}</p>
                    )}
                </div>

                {/* Time & Duration */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium dark:text-white">
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                        {errors.startTime && (
                            <p className="mt-2 text-sm text-red-500">{errors.startTime}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 font-medium dark:text-white">
                            Duration (Hours)
                        </label>

                        <input
                            type="number"
                            min={1}
                            max={4}
                            step="0.5"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                        {errors.duration && (
                            <p className="mt-2 text-sm text-red-500">{errors.duration}</p>
                        )}
                    </div>
                </div>

                {startTime && duration && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        Estimated end time: <span className="font-semibold">{calculateEndTime(startTime, duration)}</span>
                    </p>
                )}

                {/* Priority */}
                <div>
                    <label className="block mb-2 font-medium dark:text-white">
                        Priority
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setPriority("Low")}
                            className={`cursor-pointer rounded-lg py-3 font-semibold transition-all duration-200 ${priority === "Low"
                                    ? "bg-green-500 text-white ring-2 ring-green-300 scale-105"
                                    : "bg-green-600 text-white hover:bg-green-500"
                                }`}
                        >
                            Low
                        </button>

                        <button
                            type="button"
                            onClick={() => setPriority("Medium")}
                            className={`cursor-pointer rounded-lg py-3 font-semibold transition-all duration-200 ${priority === "Medium"
                                    ? "bg-yellow-500 text-white ring-2 ring-yellow-300 scale-105"
                                    : "bg-yellow-600 text-white hover:bg-yellow-500"
                                }`}
                        >
                            Medium
                        </button>

                        <button
                            type="button"
                            onClick={() => setPriority("High")}
                            className={`cursor-pointer rounded-lg py-3 font-semibold transition-all duration-200 ${priority === "High"
                                    ? "bg-red-500 text-white ring-2 ring-red-300 scale-105"
                                    : "bg-red-600 text-white hover:bg-red-500"
                                }`}
                        >
                            High
                        </button>
                    </div>

                    {errors.priority && (
                        <p className="mt-2 text-sm text-red-500">{errors.priority}</p>
                    )}

                    <p className="mt-2 text-sm dark:text-slate-300">
                        Selected Priority:
                        <span className="font-bold ml-2">
                            {priority || "None"}
                        </span>
                    </p>
                </div>

                {/* Private */}
                <div className="flex justify-between items-center">
                    <label className="font-medium dark:text-white">
                        Private Task
                    </label>

                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                </div>


                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 rounded-lg py-3 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:text-white active:scale-95"
                    >
                        {selectedTask ? "Cancel" : "Reset"}
                    </button>

                    <button
                        type="submit"
                        className="flex-1 rounded-lg py-3 bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    >
                        {selectedTask ? "Update Task" : "Create Task"}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default TaskForm;
