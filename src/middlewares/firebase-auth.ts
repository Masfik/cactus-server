import { NextFunction, Request, Response } from "express";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../firebase-secret.json";
import { config } from "../../config";

admin.initializeApp({
  credential: admin.credential.cert(<ServiceAccount>serviceAccount),
  databaseURL: config.firebase.databaseURL,
});

export async function firebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (authorization === null) res.sendStatus(401);
  else {
    // Separate the actual token from the 'Bearer <token>' string
    const idToken = authorization.split(" ")[1];

    try {
      // Get UID of the user by verifying token
      const { uid } = await admin.auth().verifyIdToken(idToken);
      res.locals.firebaseUser = uid;
      next();
    } catch (e) {
      res.sendStatus(401);
    }
  }
}
