import React, { useState, useEffect } from "react";
import socket from "./socket";
import "./index.css";

const TaskInput = ({ taskInput, setTaskInput, addTask, darkMode }) => (
  <div className="flex space-x-4 mb-6">
    <input
      type="text"
      className={`px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
      value={taskInput}
      onChange={(e) => setTaskInput(e.target.value)}
      placeholder="Enter a task"
    />
    <button
      onClick={addTask}
      className="px-6 py-2 rounded-md shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-500 text-white"
    >
      Add Task
    </button>
  </div>
);

const TaskItem = ({ task, darkMode, markTaskComplete, deleteTask }) => (
  <li
    key={task.id}
    className={`flex justify-between items-center p-4 mb-4 rounded-lg shadow-md ${
      task.completed
        ? "bg-green-100 text-gray-500"
        : darkMode
        ? "bg-gray-800 text-white"
        : "bg-gray-100 text-black"
    }`}
  >
    <span className={`text-lg ${task.completed ? "line-through" : ""}`}>
      {task.text}
    </span>
    <div className="flex space-x-2">
      {!task.completed && (
        <button
          onClick={() => markTaskComplete(task.id)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:opacity-80 focus:outline-none"
        >
          Completed
        </button>
      )}
      <button
        onClick={() => deleteTask(task.id)}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:opacity-80 focus:outline-none"
      >
        Delete
      </button>
    </div>
  </li>
);


const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <div className="absolute top-6 right-6 sm:top-4 sm:right-4">
    <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        id="darkModeToggle"
        className="hidden"
        checked={darkMode}
        onChange={() => setDarkMode((prev) => !prev)}
      />
      <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors duration-300">
        <div
          className={`w-6 h-6 bg-white rounded-full absolute top-0 left-0 transition-transform duration-300 ${
            darkMode ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
    </label>
  </div>
);

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    // fetch tasks from server
    const initializeTasks = (tasks) => {
      setTasks(tasks.sort((a, b) => b.id - a.id));
    };

    socket.on("initialize-tasks", initializeTasks);
    socket.on("update-tasks", initializeTasks);

    return () => {
      socket.off("initialize-tasks", initializeTasks);
      socket.off("update-tasks", initializeTasks);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (taskInput.trim()) {
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      socket.emit("add-task", newTask);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      setTaskInput("");
    }
  };

  const markTaskComplete = (taskId) => {
    socket.emit("mark-task-complete", taskId);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    socket.emit("delete-task", taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-start items-center py-12 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-10 ${
          darkMode ? "text-blue-400" : "text-blue-600"
        }`}
      >
        Real-Time Task Sharing App
      </h1>

      <TaskInput
        taskInput={taskInput}
        setTaskInput={setTaskInput}
        addTask={addTask}
        darkMode={darkMode}
      />

      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <div
        className="w-full max-w-xl overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id} // Key assigned here
              task={task}
              darkMode={darkMode}
              markTaskComplete={markTaskComplete}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
