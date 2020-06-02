import { Schema, Types } from "mongoose";
import { $enum } from "ts-enum-util";
import { UserStatus } from "../../models/user-status";

const required = true;

export const UserSchema = new Schema({
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
  },
  status: {
    enum: $enum(UserStatus).getValues(),
    required,
  },
  preferences: {
    theme: {
      type: String,
      enum: ["default", "nord"],
    },
    mutedRooms: [{ type: Types.ObjectId, ref: "Room" }],
  },
  friends: {
    type: [{ type: Types.ObjectId, ref: "User" }],
    required,
  },
  blocked: {
    type: [{ type: Types.ObjectId, ref: "User" }],
    required,
  },
  rooms: {
    type: [{ type: Types.ObjectId, ref: "Room" }],
    required,
  },
  invitations: {
    type: [{ type: Types.ObjectId, ref: "Invitation" }],
    required,
  },
  currentRoom: {
    type: Types.ObjectId,
    ref: "Room",
  },
});
