import * as mongoose from "mongoose";
import { Preferences } from "./preferences";
import { Invitation } from "./invitation";
import { UserStatus } from "./user-status";
import { Room } from "./room";
import { Model } from "mongoose";

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
  friends: Model<User>[];
  blocked: User[] | mongoose.Types.ObjectId[];
  rooms: Model<Room>[];
  invitations: Invitation[];
  currentRoom?: Room | mongoose.Types.ObjectId;

  getByUUID(uuid: string): User;
  sanitizeAuthUser(): User;

  sanitizeUser(options?: { excludeFriends: boolean }): User;
}
