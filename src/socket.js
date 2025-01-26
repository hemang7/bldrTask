import { io } from "socket.io-client";

const socket = io("http://localhost:9000"); // Update this to your backend URL if different
export default socket;
