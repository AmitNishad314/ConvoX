import { Server } from "socket.io";

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      const clients = [...io.sockets.adapter.rooms.get(roomId) || []];

      socket.emit(
        "room-users",
        clients.filter((id) => id !== socket.id)
      );

      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ target, offer }) => {
      io.to(target).emit("offer", {
        offer,
        caller: socket.id,
      });
    });

    socket.on("answer", ({ target, answer }) => {
      io.to(target).emit("answer", {
        answer,
        caller: socket.id,
      });
    });

    socket.on("ice-candidate", ({ target, candidate }) => {
      io.to(target).emit("ice-candidate", {
        candidate,
        caller: socket.id,
      });
    });
    
    socket.on("chat-message", ({ roomId, message, sender }) => {
        io.to(roomId).emit("chat-message", {
          sender,
          message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
      socket.broadcast.emit("user-left", socket.id);
    });
  });

  return io;
};

export default connectToSocket;