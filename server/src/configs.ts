import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { CorsOptions } from "cors";
import express from "express";
import { SessionOptions } from "express-session";
import { Server } from "socket.io";
import http from "http";

export const app = express();
export const server = http.createServer(app);
export const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  import('dotenv').then(dotenv => 
    dotenv.config()
  );
} else {
  app.set('trust proxy', 1);
}

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URI,
  credentials: true,
};

export const prisma = new PrismaClient();

export const sessionOptions: SessionOptions = {
  secret: <string>process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    path: "/api/",
    sameSite: `${process.env.NODE_ENV === "development" ? "lax" : "none"}`,
    secure: process.env.NODE_ENV === "development" ? false : true,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

export const io = new Server(server, {
  cors: corsOptions,
});