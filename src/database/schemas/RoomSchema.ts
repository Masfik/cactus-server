import { Schema, Types } from "mongoose";

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
