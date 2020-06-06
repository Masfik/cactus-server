import { Schema, Types } from "mongoose";
import { $enum } from "ts-enum-util";
import { UserGroup } from "../models/member";

const required = true;

export const RoomMemberSchema = new Schema({
  group: { type: String, enum: $enum(UserGroup).getValues(), required },
  user: { type: Types.ObjectId, ref: "User", required },
});
