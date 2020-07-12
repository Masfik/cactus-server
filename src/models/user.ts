import * as mongoose from "mongoose";
import { Preferences } from "./preferences";
import { Invitation } from "./invitation";
import { UserStatus } from "./user-status";
import { Room } from "./room";

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
  friends: User[] | mongoose.Types.ObjectId[];
  blocked: User[] | mongoose.Types.ObjectId[];
  rooms: Room[] | mongoose.Types.ObjectId[];
  invitations: Invitation[];
  currentRoom?: Room | mongoose.Types.ObjectId;

  getByUUID(uuid: string): User;
  sanitizeAuthUser(): User;

  sanitizeUser(options?: { excludeFriends: boolean }): User;
}
