import { Server as SocketIOServer } from "socket.io";
import { updateRoom } from "./dataService.js";

export const setUpIo = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      // methods: ["GET", "POST"],
    },
  });
  io.on("connect", (socket) => {
    console.log("socket connected:", socket.id);
    socket.on("join-room", (roomId, cb) => {
      socket.join(roomId);
      const roomAfterJoin = io.sockets.adapter.rooms.get(roomId);
      const isMentor = roomAfterJoin && roomAfterJoin.size === 1;
      console.log("isMentor: ", isMentor);
      cb(isMentor);
    });
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
    socket.on("send_code", (roomId, code) => {
      socket.to(roomId).emit("receive_code", code);
      updateRoom(roomId, code);
    });
    socket.on("leave-room", (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);

      console.log(`socket ${socket.id} left room ${roomId}, ${room.size}`);
      socket.leave(roomId);
    });
  });
};