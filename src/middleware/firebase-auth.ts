import { NextFunction, Request, Response } from "express";
import { FirebaseAdmin } from "../services/auth/firebase-admin";

export async function firebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (authorization === undefined) res.sendStatus(401);
  else {
    // Separate the actual token from the 'Bearer <token>' string
    const idToken = authorization.split(" ")[1];

    // Get the UID of the user by verifying token
    FirebaseAdmin.verifyIdToken(idToken)
      .then((uid) => {
        res.locals.firebaseUid = uid;
        next();
      })
      .catch(() => res.sendStatus(401));
  }
}
