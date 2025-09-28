import { io } from "socket.io-client";

let socket; // singleton

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err);
    });
  }
  return socket;
};
