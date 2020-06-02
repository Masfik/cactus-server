import { User } from "./user";
import { Room } from "./room";
import mongoose from "mongoose";

export type InvitationType = "friend" | "room";

export interface Invitation extends mongoose.Document {
  type: InvitationType;
  user?: User;
  room?: Room;
}
