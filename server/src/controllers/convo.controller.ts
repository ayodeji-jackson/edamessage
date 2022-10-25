import { Convo, User } from "@prisma/client";
import { Request, Response } from "express";
import {
  getConvosOf,
  getConvoWith,
  getUser,
  updateReadReceiptsOf,
} from "../services";

export const allConvosController = async (req: Request, res: Response) => {
  const convos = await getConvosOf(req.session.userId);
  res.status(200).send(convos);
};

export const userOrConvoController = async (req: Request, res: Response) => {
  let result: Convo | User | null = await getConvoWith(
    req.session.userId,
    req.params.recipientId
  );

  if (!result) result = await getUser(req.params.recipientId);
  else updateReadReceiptsOf(result.id, req.session.userId);

  if (!req.get("No-Content")) res.status(200).send(result);
};
