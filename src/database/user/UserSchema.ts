import { model, Model, Schema, Types } from "mongoose";
import { $enum } from "ts-enum-util";
import { UserStatus } from "../../models/user-status";
import * as mongoIdValidator from "mongoose-id-validator";
import { User } from "../../models/user";

const required = true;

export const UserSchema = new Schema({
  authUid: {
    type: String,
    required,
    // Remove from the result by default:
    // Use Users.find().select("+authId") to include
    select: false,
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
    select: false, // Remove from the result by default:
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
    type: [
      {
        category: {
          type: String,
          enum: ["friend", "room"],
          required,
        },
        user: {
          type: Types.ObjectId,
          ref: "User",
        },
        room: {
          type: Types.ObjectId,
          ref: "Room",
        },
        description: String,
      },
    ],
    required,
    default: [],
  },
  currentRoom: {
    type: Types.ObjectId,
    ref: "Room",
  },
});

// Importing UserSchema methods
import "./UserSchema.methods";

UserSchema.plugin(mongoIdValidator.getConstructor);

// Adding declarations for the custom methods created
interface UserModel extends Model<User> {
  getByUUID(uuid: string): Promise<User>;
  sanitizeAuthUser(): User;
  sanitizeUser(): User;
}

export const UserModel = <UserModel>model<User>("User", UserSchema);
