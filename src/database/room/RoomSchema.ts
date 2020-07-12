import { Model, model, Schema, Types } from "mongoose";
import { Room } from "../../models/room";
import { $enum } from "ts-enum-util";
import { UserGroup } from "../../models/member";

const required = true;

export const RoomSchema = new Schema({
  name: {
    type: String,
    required,
  },
  description: {
    type: String,
  },
  members: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
        required,
      },
      group: {
        type: String,
        enum: $enum(UserGroup).getValues(),
      },
    },
  ],
  /*available: {
    type: Boolean,
    required,
  },*/
  viewers: {
    type: [Types.ObjectId],
    ref: "User",
    required,
    default: [],
  },
  remote: {
    type: Types.ObjectId,
    ref: "User",
  },
  watching: String,
});

// Importing Schema methods
import "./RoomSchema.methods";

// Adding declarations for the custom methods created
interface RoomModel extends Model<Room> {
  sanitizeRoom(): Room;
}

export const RoomModel = <RoomModel>model<Room>("Room", RoomSchema);
