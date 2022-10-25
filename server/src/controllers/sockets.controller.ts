import { Socket } from "socket.io";
import { SocketMessage } from "../@types";
import { io } from "../configs";
import { getConvoWith, createNewMessage, createNewConvo } from "../services";

const users = new Map<string, string>();

export const socketController = (socket: Socket) => {
  // map db id of users to their respective socket ids
  for (let [id, socket] of io.of("/").sockets) {
    users.set(socket.handshake.auth.userId, id);
  }

  socket.on("message", async (message: SocketMessage) => {
    let convo = await getConvoWith(message.senderId, message.recipientId);

    if (convo) {
      await createNewMessage(
        convo.id,
        message.text,
        message.timestamp,
        message.senderId
      );
    } else {
      convo = await createNewConvo(
        message.text,
        message.timestamp,
        message.senderId,
        message.recipientId
      );

      socket
        .to(users.get(message.recipientId)!)
        .emit("message", { ...message, convo });
    }
  });
};
