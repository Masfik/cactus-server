import { User } from "./user";
import { Member } from "./member";
import * as mongoose from "mongoose";

export interface Room extends mongoose.Document {
  name: string;
  description?: string;
  members: Member[];
  available: boolean;
  viewers: User[];
  remote?: User;
  watching?: string;
}
