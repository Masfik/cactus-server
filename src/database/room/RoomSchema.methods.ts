import { UserSchema } from "../user/UserSchema";
import { Room } from "../../models/room";

UserSchema.method("sanitizeRoom", function () {
  const room: Room = this.toObject();

  room.id = room._id;
  delete room._id;
  delete room.__v;

  return room;
});
