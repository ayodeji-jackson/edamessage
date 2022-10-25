import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.userId && req.path != "/api/auth" && req.path != "/api")
    res.status(401).send({});
  else next();
};
