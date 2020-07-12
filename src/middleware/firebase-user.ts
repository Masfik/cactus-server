import { UserModel as users } from "../database/UserSchema";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

export async function firebaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.user = await users
    .findOne(<User>{ authUid: res.locals.firebaseUid })
    .then((user) => user.sanitizeAuthUser())
    .catch(() => null);
  next();
}
