import { Convo, User } from "@prisma/client";
import { prisma } from "./configs";

export const upsertUser = async (
  name: string,
  email: string,
  picture: string
): Promise<User> => {
  try {
    return await prisma.user.upsert({
      where: { email },
      update: { name, email, picture },
      create: {
        name: <string>name,
        email: <string>email,
        picture,
      },
    });
  } catch (err) {
    throw new Error("Failed to upsert user");
  }
};

export const getConvosOf = async (userId: string): Promise<Convo[]> => {
  try {
    return await prisma.convo.findMany({
      where: {
        partiesIds: {
          has: userId,
        },
      },
      include: {
        messages: true,
        parties: true,
      },
    });
  } catch (err) {
    throw new Error("Failed to get conversations");
  }
};

export const getConvoWith = async (
  senderId: string,
  recipientId: string
): Promise<Convo | null> => {
  try {
    return await prisma.convo
      .findMany({
        where: {
          partiesIds: {
            hasEvery: [senderId, recipientId],
          },
        },
        include: { messages: true, parties: true },
      })
      .then((convos) => convos.find((convo) => convo.partiesIds.length == 2)!);
  } catch (err) {
    throw new Error("Failed to get conversation");
  }
};

export const getUsersExclude = async (userId: string): Promise<User[]> => {
  try {
    return await prisma.user.findMany({
      where: { NOT: { id: userId } },
    });
  } catch (err) {
    throw new Error("Failed to get users");
  }
};

export const getUser = async (recipientId: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id: recipientId },
    });
  } catch (err) {
    throw new Error("Failed to get user");
  }
};

export const updateReadReceiptsOf = async (
  convoId: string,
  userId: string
): Promise<void> => {
  try {
    await prisma.message.updateMany({
      where: {
        convoId,
        NOT: { readByIds: { has: userId } },
      },
      data: {
        readByIds: {
          push: userId,
        },
      },
    });
  } catch (err) {
    throw new Error("Failed to update read receipts");
  }
};

export const createNewMessage = async (
  convoId: string,
  messageText: string,
  at: Date,
  senderId: string
): Promise<void> => {
  try {
    await prisma.convo.update({
      where: { id: convoId },
      data: {
        messages: {
          create: {
            text: messageText,
            timestamp: at,
            senderId,
            readBy: {
              connect: { id: senderId },
            },
          },
        },
      },
    });
  } catch (err) {
    throw new Error("Failed to create new message");
  }
};

export const createNewConvo = async (
  messageText: string,
  at: Date,
  senderId: string,
  recipientId: string
): Promise<Convo> => {
  try {
    return await prisma.convo.create({
      data: {
        messages: {
          create: {
            text: messageText,
            timestamp: at,
            senderId: senderId,
            readBy: {
              connect: { id: senderId },
            },
          },
        },
        parties: {
          connect: [{ id: senderId }, { id: recipientId }],
        },
      },
      include: { messages: true, parties: true },
    });
  } catch (err) {
    throw new Error("Failed to create new conversation");
  }
};
