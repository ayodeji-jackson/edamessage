import express from "express";
import session from "express-session";
import {
  prisma,
  sessionOptions,
  corsOptions,
  app,
  io,
  port,
} from "./src/configs";
import cors from "cors";
import { authMiddleware } from "./src/middlewares";
import { authController, homeController } from "./src/controllers/index.controller";
import {
  allConvosController,
  userOrConvoController,
} from "./src/controllers/convo.controller";
import { allUsersController, userController } from "./src/controllers/user.controller";
import { server } from "./src/configs";
import { socketController } from "./src/controllers/sockets.controller";

declare module "express-session" {
  interface Session {
    userId: string;
  }
}

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(authMiddleware);

// routes
app.get('/api', homeController);
app.post("/api/auth", authController);
app.get("/api/convos", allConvosController);
app.get("/api/users", allUsersController);
app.get("/api/users/:recipientId", userController);
app.get("/api/users/:recipientId/convo", userOrConvoController);

io.on("connection", socketController);

server.listen(port, async () => {
  await prisma.$connect();
  console.log("App is running on port", port);
});
