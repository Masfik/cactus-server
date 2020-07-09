import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../../firebase-secret.json";
import { config } from "../../../config";

admin.initializeApp({
  credential: admin.credential.cert(<ServiceAccount>serviceAccount),
  databaseURL: config.firebase.databaseURL,
});

// Very basic non-instantiable class to verify Firebase token
export abstract class FirebaseAdmin {
  static async verifyIdToken(token: string): Promise<string> {
    const { uid } = await admin.auth().verifyIdToken(token);
    return uid;
  }
}
