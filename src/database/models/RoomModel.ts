import * as mongoose from "mongoose";
import { RoomSchema } from "../schemas/RoomSchema";
import { Room } from "../../models/room";

export const RoomModel = mongoose.model<Room>("Room", RoomSchema);
