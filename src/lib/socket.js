// src/lib/socket.js
import { io } from "socket.io-client"

let socket = null

export const getSocket = () => {
  if (typeof window === "undefined") {
    // ممنوع socket في السيرفر
    throw new Error("Socket not initialized!")
  }

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_URL_API.replace("/api", ""), {
      transports: ["websocket"],
    })
  }
  return socket
}
