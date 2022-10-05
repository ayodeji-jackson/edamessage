import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library"

declare module "express-session" {
  interface Session {
    userId?: string;
  }
}

dotenv.config();

const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();
const app = express();

// cors middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

app.use(express.json());
app.use(
  session({
    secret: <string>process.env.SESSION_SECRET,
  })
);

app.post("/api/auth", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const { name, email, picture } = await client.verifyIdToken({
      idToken: token, 
      audience: process.env.GOOGLE_CLIENT_ID
    }).then(ticket => ticket.getPayload()!);

    const user = await prisma.user.upsert({
      where: { email }, 
      update: { name, email, picture }, 
      create: { 
        name: <string>name, 
        email: <string>email, 
        picture 
      }
    });

    // set user session
    req.session.userId = user.id;

    res.status(201).json(user);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
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
        convosIds: false
      }
    });

    res.status(200).json(users);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.get("/api/conversations/", async (req: Request, res: Response) => {
  try {
    // get user conversations and picture from db
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { convos: true, picture: true },
    });

    // respond with user conversations and picture
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.post("/api/conversations/:email/", async (req: Request, res: Response) => {
  try {
    // get db id of recipient
    const recipient = await prisma.user.findFirst({
      where: { email: req.params.email },
      select: { id: true },
    });

    // create new convo, setting parties as sender and recipient
    const convo = await prisma.convo.create({
      data: {
        parties: {
          connect: [{ id: recipient?.id }, { id: req.session.userId }],
        },
      },
      include: { parties: true },
    });

    res.status(201).send(convo);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.get("/api/conversations/:convoId/", async (req: Request, res: Response) => {
  try {
    const convo = await prisma.convo.findUnique({
      where: { id: req.params.convoId },
      include: { messages: true },
    });
    res.status(200).send(convo);
  } catch (e) {
    res.status(500).send({ message: "An error occured", error: (<Error>e).message });
    console.error(e);
  }
});

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log("App is running on port", PORT);
});
