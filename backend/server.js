const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's URL
        methods: ["GET", "POST"]
    }
});


// Store tasks in memory (no database)
let tasks = [];


io.on("connection", (socket) => {
    console.log("A user connected");

    // Send existing tasks to the newly connected client
    socket.emit("initialize-tasks", tasks);

    // Add a task
    socket.on("add-task", (task) => {
        tasks.push(task);
        io.emit("update-tasks", tasks); // Broadcast updated task list
    });

    // Mark a task as completed
    socket.on("mark-task-complete", (taskId) => {
        tasks = tasks.map((task) => 
            task.id === taskId ? { ...task, completed: true } : task
        );
        io.emit("update-tasks", tasks); // Broadcast updated task list
    });

    // Delete a task
    socket.on("delete-task", (taskId) => {
        tasks = tasks.filter((task) => task.id !== taskId);
        io.emit("update-tasks", tasks); // Broadcast updated task list
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

server.listen(9000, () => {
    console.log('Server is running on port 9000');
});
