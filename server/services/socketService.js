import { Server as SocketIOServer } from "socket.io";
import { updateRoom } from "./dataService.js";

const handleJoinRoom = (socket, io) => (roomId, cb) => {
  socket.join(roomId);
  console.log(`socket ${socket.id} joined room ${roomId}`);
  const roomAfterJoin = io.sockets.adapter.rooms.get(roomId);
  const isMentor = roomAfterJoin && roomAfterJoin.size === 1;
  cb(isMentor);
};

const handleDisconnect = (socket) => () => {
  console.log(`Socket ${socket.id} disconnected`);
};

const handleSendCode = (socket, io, updateRoom) => (roomId, code) => {
  updateRoom(roomId, code); // Update code room on db
  socket.to(roomId).emit("receive_code", code);
};

const handleLeaveRoom = (socket) => (roomId) => {
  console.log(`socket ${socket.id} left room ${roomId}`);
  socket.leave(roomId);
};

export const setUpIo = (server) => {
  const io = new SocketIOServer(server, {
    // cors: {
    //   origin: "http://localhost:3000",
    // },
  });
  io.on("connect", (socket) => {
    socket.on("join-room", handleJoinRoom(socket, io));
    socket.on("disconnect", handleDisconnect(socket));
    socket.on("send_code", handleSendCode(socket, io, updateRoom));
    socket.on("leave-room", handleLeaveRoom(socket));
  });
};
