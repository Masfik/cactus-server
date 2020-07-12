import { User } from "../../models/user";
import { UserSchema } from "./UserSchema";
import { Room } from "../../models/room";

UserSchema.statics.getByUUID = function (cb) {};

/**
 * Method to automatically return sanitized user data for the authenticated user
 */
UserSchema.method("sanitizeAuthUser", function () {
  const user: User = this.toObject();

  // "Renaming" _id to id
  user.id = user._id;
  delete user._id;
  delete user.__v;

  // Sanitizing all friends
  user.friends = this.friends.map((friend: User) => friend.sanitizeUser());

  // Sanitizing all rooms
  user.rooms = this.rooms.map((room: Room) => room.sanitizeRoom());

  return user;
});

/**
 * Method to automatically return sanitized data regarding other users.
 */
UserSchema.method("sanitizeUser", function (
  options: {
    excludeFriends: boolean;
  } = {
    excludeFriends: false,
  }
) {
  const user: User = this.toObject();

  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.email;
  delete user.rooms; // TODO: in the future, common rooms could be added
  delete user.preferences;
  delete user.invitations;
  delete user.blocked;

  if (options.excludeFriends) delete user.friends;
  else user.friends = this.friends?.map((user: User) => user.sanitizeUser());

  return user;
});
