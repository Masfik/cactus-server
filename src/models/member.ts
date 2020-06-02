import { User } from "./user";

/**
 * The UserGroup of the user. Ascending from most privileges to least privileges.
 */
export enum UserGroup {
  /* THE ORDER IS IMPORTANT: if new groups are required, always append them as last. */

  OWNER,
  ADMIN,
  MODERATOR,
  STREAMER,
}

export interface Member extends User {
  /**
   * Permission group of the user. By default, members aren't assigned to a specific one so the group can be null.
   */
  userGroup?: UserGroup;
}
