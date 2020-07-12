import * as mongoose from "mongoose";
import { Preferences } from "./preferences";
import { Invitation } from "./invitation";
import { UserStatus } from "./user-status";

export interface User extends mongoose.Document {
  authUid: string;
  name: string;
  surname: string;
  username: string;
  email?: string;
  password?: string;
  avatar?: string;
  status: UserStatus;
  preferences: Preferences;
  friends: User[];
  blocked: User[];
  rooms: mongoose.Types.ObjectId[]; // Room[];
  invitations: Invitation[];
  currentRoom?: mongoose.Types.ObjectId; // Room;

  getByUUID(uuid: string): User;
  sanitizeAuthUser(): User;
  sanitizeUser(): User;
}
