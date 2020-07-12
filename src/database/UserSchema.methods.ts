import { User } from "../models/user";
import { UserSchema } from "./UserSchema";

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
  delete user.authUid;
  delete user.password;

  return user;
});

/**
 * Method to automatically return sanitized data regarding other users.
 */
UserSchema.method("sanitizeUser", function () {
  const user: User = this.toObject();

  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.authUid;
  delete user.email;
  delete user.password;
  delete user.rooms; // TODO: in the future, common rooms could be added
  delete user.preferences;
  delete user.invitations;
  delete user.blocked;

  return user;
});
