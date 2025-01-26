import React, { useState, useEffect } from "react";
import socket from "./socket"; 
import "./index.css";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");

    useEffect(() => {
        // initializing tasks when connected
        socket.on("initialize-tasks", (initialTasks) => {
            setTasks(initialTasks);
        });

        // updating tasks when broadcasted by the server
        socket.on("update-tasks", (updatedTasks) => {
            setTasks(updatedTasks);
        });

        return () => {
            socket.off("initialize-tasks");
            socket.off("update-tasks");
        };
    }, []);

    const addTask = () => {
        if (taskInput.trim()) {
            const newTask = { id: Date.now(), text: taskInput, completed: false };
            socket.emit("add-task", newTask); // emit the add-task event
            setTaskInput(""); // clear input after adding task
        }
    };

    const markTaskComplete = (taskId) => {
        socket.emit("mark-task-complete", taskId); // emit the mark-task-complete event
    };

    const deleteTask = (taskId) => {
        socket.emit("delete-task", taskId); // emit delete-task event
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-10">Real-Time Task Sharing App</h1>
            
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter a task"
                />
                <button
                    onClick={addTask}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Add Task
                </button>
            </div>

            <ul className="w-full max-w-xl ">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={`flex bg-pink-200 justify-between items-center p-4 mb-4 rounded-lg shadow-md ${task.completed ? 'bg-green-100' : 'bg-gray-100'}`}
                    >
                        <span
                            className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}
                        >
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
    );
};

export default App;
