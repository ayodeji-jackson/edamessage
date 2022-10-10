import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Convo, PrismaClient, User } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { Server } from "socket.io";
import http from "http";

declare module "express-session" {
  interface Session {
    userId: string;
  }
}

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URI,
    credentials: true,
  },
});

app.use(express.json());

// cors middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URI!);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// session middleware
app.use(
  session({
    secret: <string>process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: "lax", path: "/api/" },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// auth middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId && req.path != "/api/auth") res.status(401).send({});
  else next();
});

app.get("/api/", async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        convos: true,
        picture: true,
      },
    });

    res.send(data);
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.post("/api/auth", (req: Request, res: Response) => {
  try {
    req.session.regenerate(async () => {
      let { credential, code } = req.body;
    
      const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "postmessage"
      );

      if (!credential) {
        const { tokens } = await client.getToken(code);
        credential = tokens.id_token;
      }

      const { name, email, picture } = await client
        .verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        })
        .then((ticket) => ticket.getPayload()!);

      const user = await prisma.user.upsert({
        where: { email },
        update: { name, email, picture },
        create: {
          name: <string>name,
          email: <string>email,
          picture,
        },
      });

      // set user session
      req.session.userId = user.id;
      res.status(201).send(user);
    });
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { NOT: { id: req.session.userId } },
      select: {
        id: true,
        name: true,
        picture: true,
        dateJoined: true,
        convosIds: false,
      },
    });

    res.status(200).send(users);
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.get("/api/convos", async (req: Request, res: Response) => {
  try {
    const convos = await prisma.convo.findMany({
      where: {
        partiesIds: {
          has: req.session.userId
        }
      }, 
      select: {
        messages: true, 
        parties: true, 
        picture: true, 
        isGroup: true
      }
    });

    res.status(200).send(convos);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
})

app.get(
  "/api/users/:recipientId/convo",
  async (req: Request, res: Response) => {
    try {
      let result: Convo | User | null = await prisma.convo.findFirst({
        where: {
          partiesIds: {
            equals: [req.params.recipientId, req.session.userId!],
          },
        },
        include: { messages: true },
      });

      // return the user if the conversation doesn't exist
      if (!result) result = await prisma.user.findUnique({
        where: { id: req.params.recipientId }
      });

      res.status(200).send(result);
    } catch (e) {
      res
        .status(500)
        .send({ message: "An error occured", error: (<Error>e).message });
      console.error(e);
    }
  }
);

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const convo = await prisma.convo.findUnique({
      where: { id: message.convoId }
    });
    if (convo) {
      await prisma.message.create({
        data: {
          text: message.text, 
          convoId: message.convoId, 
          timestamp: message.timestamp, 
          senderId: message.senderId
        }
      });
    } else {
      await prisma.convo.create({
        data: {
          messages: {
            create: {
              text: message.text, 
              timestamp: message.timestamp, 
              senderId: message.senderId
            }
          }, 
          partiesIds: [ message.senderId, message.recipientId ]
        }
      });
    }
    socket.broadcast.emit('message', message);
  });
});

server.listen(process.env.PORT || 8080, async () => {
  await prisma.$connect();
  console.log("App is running on port", process.env.PORT || 8080);
});
