const tasks = [];

export default function createTask(
  taskName,
  description,
  schedule,
  startTime,
  duration,
  priority,
  isPrivate
) {
  const taskDate = new Date();
  if (schedule?.toLowerCase() === "tomorrow") {
    taskDate.setDate(taskDate.getDate() + 1);
  }

  const task = {
    id: Date.now(),
    taskName,
    description,
    schedule,
    startTime,
    duration,
    endTime: "",
    priority,
    isPrivate,
    completed: false,
    createdAt: new Date().toLocaleString(),
    taskDate: taskDate.toISOString(),
  };

  tasks.push(task);
  return task;
}

export function getTasks() {
  return tasks;
} 
