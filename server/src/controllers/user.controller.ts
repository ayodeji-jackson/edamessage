import { Request, Response } from "express";
import { getUser, getUsersExclude } from "../services";

export const allUsersController = async (req: Request, res: Response) => {
  const users = await getUsersExclude(req.session.userId);
  res.status(200).send(users);
};

export const userController = async (req: Request, res: Response) => {
  const user = await getUser(req.params.recipientId);
  res.status(200).send(user);
};
