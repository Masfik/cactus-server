import { NextFunction, Request, Response } from "express";
import { FirebaseAdmin } from "../services/auth/firebase-admin";

//------------------------------------------------------------------------------
// EXPRESS FIREBASE AUTH MIDDLEWARE
//------------------------------------------------------------------------------

export function firebaseAuthExpress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) return res.sendStatus(401);

  // Separate the actual token from the 'Bearer <token>' string
  const idToken = authorization.split(" ")[1];

  // Get the UID of the user by verifying token
  FirebaseAdmin.verifyIdToken(idToken)
    .then((uid) => {
      // Adding a firebaseUid field to all res.locals
      res.locals.firebaseUid = uid;
      next();
    })
    .catch(() => res.sendStatus(401));
}

//------------------------------------------------------------------------------
// WS FIREBASE AUTH MIDDLEWARE
//------------------------------------------------------------------------------

export function firebaseAuthWS(info, proceed: Function) {
  const token = info.req.url.substr(1); // Removing the slash from the URL

  if (token === "") return proceed(false, 401, "unauthorized");

  FirebaseAdmin.verifyIdToken(token)
    .then((uid) => {
      // Adding a firebaseUid field to all req
      info.req.firebaseUid = uid;
      proceed(true);
    })
    .catch(() => proceed(false, 401, "unauthorized"));
}
