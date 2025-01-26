import { io } from "socket.io-client";

const socket = io("https://bldrtask.onrender.com"); // Update this to your backend URL if different
export default socket;
