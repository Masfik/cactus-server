import * as mongoose from "mongoose";
import { Preferences } from "./preferences";
import { Room } from "./room";
import { Invitation } from "./invitation";
import { UserStatus } from "./user-status";

export interface User extends mongoose.Document {
  username: string;
  name: string;
  surname: string;
  email?: string;
  password?: string;
  avatar?: string;
  status: UserStatus;
  preferences: Preferences;
  friends: User[];
  blocked: User[];
  rooms: Room[];
  invitations: Invitation[];
  currentRoom?: Room;
}
