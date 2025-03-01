import React, { useState, useEffect } from "react";
import socket from "./socket"; 
import "./index.css";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        // Initializing tasks when connected
        socket.on("initialize-tasks", (initialTasks) => {
            setTasks(initialTasks);
        });

        // Updating tasks when broadcasted by the server
        socket.on("update-tasks", (updatedTasks) => {
            setTasks(updatedTasks);
        });

        return () => {
            socket.off("initialize-tasks");
            socket.off("update-tasks");
        };
    }, []);

    useEffect(() => {
        // Save darkMode preference in localStorage
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const addTask = () => {
        if (taskInput.trim()) {
            const newTask = { id: Date.now(), text: taskInput, completed: false };
            socket.emit("add-task", newTask); // Emit add-task event
            setTaskInput(""); // Clear input after adding task
        }
    };

    const markTaskComplete = (taskId) => {
        socket.emit("mark-task-complete", taskId); // Emit mark-task-complete event
    };

    const deleteTask = (taskId) => {
        socket.emit("delete-task", taskId); // Emit delete-task event
    };

    return (
        <div className={`min-h-screen flex flex-col justify-start items-center py-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <h1 className={`text-4xl font-bold mb-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Bestie Todooo
            </h1>
            
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    className={`px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="what up buttercup!"
                />
                <button
                    onClick={addTask}
                    className={`px-6 py-2 rounded-md shadow-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 ${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}
                >
                    add
                </button>
            </div>

            {/* Dark mode toggle switch */}
            <div className="absolute top-6 right-6 sm:top-4 sm:right-4">
                <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="darkModeToggle"
                        className="hidden"
                        checked={darkMode}
                        onChange={() => setDarkMode(prev => !prev)}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors duration-300">
                        <div
                            className={`w-6 h-6 bg-white rounded-full absolute top-0 left-0 transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}
                        ></div>
                    </div>
                </label>
            </div>

            {/* Scrollable task list */}
            <div className="w-full max-w-xl overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                <ul>
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`flex bg-pink-200 justify-between items-center p-4 mb-4 rounded-lg shadow-md 
                                ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} // No green background
                        >
                            <span className={`text-lg text-black ${task.completed ? "line-through" : ""}`}>
                                {task.text}
                            </span>

                            <div className="flex space-x-2">
                                {!task.completed && (
                                    <img
                                        src="https://ih1.redbubble.net/image.700338378.3966/raf,360x360,075,t,fafafa:ca443f4786.u2.jpg"
                                        alt="Complete"
                                        onClick={() => markTaskComplete(task.id)}
                                        className="w-8 h-8 cursor-pointer rounded-full hover:opacity-80"
                                    />
                                )}
                                <img
                                    src="https://64.media.tumblr.com/0d11c8d4274ccf7b67ccf560fd24eae8/tumblr_p6jbo7LJbZ1x5g9ago2_500.jpg"
                                    alt="Delete"
                                    onClick={() => deleteTask(task.id)}
                                    className="w-8 h-8 cursor-pointer rounded-full hover:opacity-80"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
