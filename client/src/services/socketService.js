import { io } from "socket.io-client";
var socket;
export const connectSocket = async () => {
  socket = new io("http://localhost:5000");
  socket.on("connect", () => {
    console.log(`you connected with socket id: ${socket.id}`);
  });
};
export const joinRoom = async (roomId, cb) => {
  socket.emit("join-room", roomId, cb);
};
export const leaveRoom = (roomId) => {
  socket.emit("leave-room", roomId);
  socket.disconnect();
};

export const sendCode = (roomId, code) => {
  socket.emit("send_code", roomId, code);
};

export const receiveCode = (cb) => {
  socket.on("receive_code", cb);
};
