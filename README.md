Task Manager App
A real-time task management application that allows users to add, mark as complete, and delete tasks. This app uses Socket.IO for real-time communication and features a responsive React frontend paired with an Express backend.

Problem Statement:
To create a real-time task manager where multiple users can interact seamlessly by adding, completing, and deleting tasks with instant updates.

Solution:
The solution leverages Socket.IO for real-time communication between the frontend and backend, ensuring seamless task synchronization across users. The backend is built with Express and handles both task management and socket communication. The React frontend provides an intuitive UI for users to interact with tasks. The app follows a modular approach:

Frontend (React): Handles user interactions and task display.
Backend (Express & Socket.IO): Manages task storage and emits real-time updates.
Thought Process:
Use Socket.IO for event-driven communication to update tasks in real-time.
Organize frontend/backend directories for maintainable code.
Deploy the backend on Render and the frontend on Vercel for seamless hosting.
Add a CORS middleware in the backend to handle cross-origin requests securely.
Features
Real-time Updates: Add, complete, and delete tasks instantly across all users.
Responsive Design: Optimized for both desktop and mobile.
Socket.IO Integration: Ensures low-latency communication.
Task Persistence: Tracks tasks in-memory during the session.
Tech Stack
Frontend: React, Vercel (Deployment)
Backend: Node.js, Express, Socket.IO, Render (Deployment)
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16+)
npm or yarn


Open the frontend in a browser and interact with the task manager:
Add tasks.
Mark tasks as complete.
Delete tasks.
Open multiple tabs to test real-time updates across sessions.

Deployed Versions
Frontend: Deployed on Vercel (https://bldr-task.vercel.app/)
Backend: Deployed on Render (https://bldrtask.onrender.com)

Deployment Strategy
Frontend: Deployed on Vercel for a scalable, fast-loading UI.
Backend: Deployed on Render, a flexible hosting platform supporting Node.js.


GitHub Repository
Access the full source code here: [GitHub Repository](https://github.com/hemang7/bldrTask/)
