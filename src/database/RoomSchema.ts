import { model, Schema, Types } from "mongoose";
import { Room } from "../models/room";

const required = true;

export const RoomSchema = new Schema({
  name: {
    type: String,
    required,
  },
  description: {
    type: String,
  },
  // members:      { type: [Types.ObjectId], ref: 'M', required },
  available: {
    type: Boolean,
    required,
  },
  viewers: {
    type: [Types.ObjectId],
    ref: "User",
    required,
  },
  remote: {
    type: Types.ObjectId,
    ref: "User",
  },
  watching: {
    type: String,
  },
});

export const RoomModel = model<Room>("Room", RoomSchema);
