import mongoose from "mongoose";
import { User } from "./user";

/**
 * The UserGroup of the user. Ascending from most privileges to least privileges.
 */
export enum UserGroup {
  // THE ORDER IS IMPORTANT:
  // If new groups are required, always append them as last.

  OWNER,
  ADMIN,
  MODERATOR,
  STREAMER,
}

export interface Member {
  user: User | mongoose.Types.ObjectId; // User

  /**
   * Permission group of the user. By default, members aren't assigned to a
   * specific one, so the group can be undefined.
   */
  userGroup?: UserGroup;
}
