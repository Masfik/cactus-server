import { model, Model, Schema, Types } from "mongoose";
import { $enum } from "ts-enum-util";
import { UserStatus } from "../models/user-status";
import * as mongoIdValidator from "mongoose-id-validator";
import { User } from "../models/user";

const required = true;

export const UserSchema = new Schema({
  uuid: {
    type: String,
    required,
  },
  username: {
    type: String,
    required,
  },
  name: {
    type: String,
    required,
  },
  surname: {
    type: String,
    required,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    default: null,
  },
  status: {
    enum: $enum(UserStatus).getValues(),
    default: 0,
  },
  preferences: {
    theme: {
      type: String,
      enum: ["default", "nord"],
      default: "default",
    },
    mutedRooms: {
      type: [{ type: Types.ObjectId, ref: "Room" }],
      required,
      default: [],
    },
  },
  friends: {
    type: [{ type: Types.ObjectId, ref: "User" }],
    required,
    default: [],
  },
  blocked: {
    type: [{ type: Types.ObjectId, ref: "User" }],
    required,
    default: [],
  },
  rooms: {
    type: [{ type: Types.ObjectId, ref: "Room" }],
    required,
    default: [],
  },
  invitations: {
    type: [{ type: Types.ObjectId, ref: "Invitation" }],
    required,
    default: [],
  },
  currentRoom: {
    type: Types.ObjectId,
    ref: "Room",
  },
});

UserSchema.statics.getByUUID = function (cb) {};

UserSchema.plugin(mongoIdValidator.getConstructor);

interface UserModel extends Model<User> {
  getByUUID(uuid: string): Promise<User>;
}

export const UserModel = <UserModel>model<User>("User", UserSchema);
