import { User } from "./user";
import { Room } from "./room";
import mongoose from "mongoose";

export type InvitationCategory = "friend" | "room";

export interface Invitation extends mongoose.Document {
  category: InvitationCategory;
  user?: User;
  room?: Room;
  description?: string;
}
