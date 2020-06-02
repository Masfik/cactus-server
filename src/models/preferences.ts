import { Room } from "./room";
import * as mongoose from "mongoose";

export interface Preferences extends mongoose.Document {
  theme: string;
  mutedRooms: Room[];
  mouseType: "click" | "follow-cursor";
}
