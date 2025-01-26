import { io } from "socket.io-client";

const socket = io("https://bldrtask.onrender.com"); // backend app's url
export default socket;
