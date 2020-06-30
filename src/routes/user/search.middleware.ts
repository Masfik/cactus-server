import { NextFunction, Request, Response } from "express";

export async function searchValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query } = req.query;
  if (query === null)
    return res.status(400).json({ error: "query parameter is required" });
  else if (query.length < 5)
    return res
      .status(400)
      .json({ error: "username must be at least 5 characters" });

  next();
}
