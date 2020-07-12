import { NextFunction, Request, Response } from "express";

export async function requestValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.params.id === undefined)
    return res.status(400).json({ error: "no userId specified" });

  if (res.locals.user._id === req.params.id)
    return res.status(400).json({ error: "self-request" });

  next();
}
