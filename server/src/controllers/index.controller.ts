import { Request, Response } from "express";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import { upsertUser } from "../services";

export const homeController = (req: Request, res: Response) => {
  res.status(200).send({});
}

export const authController = (req: Request, res: Response) => {
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
      .then((ticket: LoginTicket) => ticket.getPayload()!);

    const user = await upsertUser(name!, email!, picture!);

    // set user session
    req.session.userId = user.id;
    res.status(201).send(user);
  });
};
