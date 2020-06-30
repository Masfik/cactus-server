import { NextFunction, Request, Response } from "express";

export async function signUpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check if user already exists
  if (res.locals.user) {
    res.status(409).json({ error: "user is already registered" });
    return;
  }

  // Check if the JSON payload is invalid
  const { id, name, surname, username, email } = req.body;
  if (!id && !name && !surname && !username && !email) {
    res.status(400).json({ error: "invalid json data" });
    return;
  }

  next();
}
