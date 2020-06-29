import { UserModel as users } from "../database/UserSchema";
import { NextFunction, Request, Response } from "express";

export async function firebaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.user = await users.findOne({ uuid: res.locals.user.uid });
  next();
}
