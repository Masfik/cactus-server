import { User } from "../models/user";

declare module "express" {
  export interface Response {
    locals: {
      user: User;
      firebaseUid: string;
    };
  }
}
