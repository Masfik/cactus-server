import { NextFunction, Request, Response } from "express";

export async function requestValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.params.id === undefined)
    return res.status(400).json({ error: "no userId specified" });

  next();
}
