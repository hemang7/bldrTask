const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "https://bestie-todo.vercel.app/", // react app's url
        methods: ["GET", "POST"]
    }
});


// store tasks in memory in an array
let tasks = [];


io.on("connection", (socket) => {
    console.log("A user connected");

    // send existing tasks to the newly connected client
    socket.emit("initialize-tasks", tasks);

    // add a task
    socket.on("add-task", (task) => {
        tasks.push(task);
        io.emit("update-tasks", tasks); // broadcast updated task list
    });

    // mark a task as completed
    socket.on("mark-task-complete", (taskId) => {
        tasks = tasks.map((task) => 
            task.id === taskId ? { ...task, completed: true } : task
        );
        io.emit("update-tasks", tasks); 
    });

    // delete a task
    socket.on("delete-task", (taskId) => {
        tasks = tasks.filter((task) => task.id !== taskId);
        io.emit("update-tasks", tasks); 
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
