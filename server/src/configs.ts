import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { CorsOptions } from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { SessionOptions } from "express-session";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URI,
  credentials: true,
};

export const prisma = new PrismaClient();

export const sessionOptions: SessionOptions = {
  secret: <string>process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: "none", path: "/api/", secure: true },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: corsOptions,
});
export const port = process.env.PORT || 8080;
