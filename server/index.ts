import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

declare module "express-session" {
  interface Session {
    userId: string;
  }
}

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// cors middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
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
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: 'lax', path: '/api/' },
  })
);

// auth middleware 
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId && req.path != "/api/auth") 
    res.status(401).send({});
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

app.post(
  "/api/auth",
  async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const { name, email, picture } = await client
        .verifyIdToken({
          idToken: token,
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
    } catch (e) {
      res
        .status(500)
        .send({ message: "An error occured", error: (<Error>e).message });
      console.error(e);
    }
  }
);

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

    res.status(200).json(users);
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.post("/api/convos/:recipientId/", async (req: Request, res: Response) => {
  try {
    // create new convo, setting parties as sender and recipient
    const convo = await prisma.convo.create({
      data: {
        parties: {
          connect: [{ id: req.params.recipientId }, { id: req.session.userId }],
        },
      },
      include: { parties: true },
    });

    res.status(201).send(convo);
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.get("/api/convos/:recipientId/", async (req: Request, res: Response) => {
  try {
    const convo = await prisma.convo.findFirst({
      where: {
        partiesIds: {
          equals: [req.params.recipientId, req.session.userId!],
        },
      },
      include: { messages: true },
    });
    res.status(200).send(convo);
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.listen(process.env.PORT || 8080, async () => {
  await prisma.$connect();
  console.log("App is running on port", process.env.PORT || 8080);
});
