import { Server as SocketIOServer } from "socket.io";
import { updateRoom } from "./dataService.js";

export const setUpIo = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  io.on("connect", (socket) => {
    console.log("socket connected:", socket.id);
    socket.on("join-room", (roomId, cb) => {
      socket.join(roomId);
      console.log(`socket ${socket.id} joined room ${roomId}`);
      const roomAfterJoin = io.sockets.adapter.rooms.get(roomId);
      const isMentor = roomAfterJoin && roomAfterJoin.size === 1;
      cb(isMentor);
    });
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
    socket.on("send_code", (roomId, code) => {
      updateRoom(roomId, code); //update code room on db
      socket.to(roomId).emit("receive_code", code);
    });
    socket.on("leave-room", (roomId) => {
      console.log(`socket ${socket.id} left room ${roomId}`);
      socket.leave(roomId);
    });
  });
};
