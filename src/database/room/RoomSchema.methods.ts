import { Room } from "../../models/room";
import { RoomSchema } from "./RoomSchema";
import { Member, UserGroup } from "../../models/member";
import { User } from "../../models/user";

interface SanitizedMember extends User {
  userGroup?: UserGroup;
}

RoomSchema.method("sanitizeRoom", function () {
  const room: Room = this.toObject();

  room.id = room._id;
  delete room._id;
  delete room.__v;

  room.members = this.members.map((member: Member) => {
    const sanitizedUser = (<User>member.user).sanitizeUser();

    // The client requires directly a payload that includes the User object
    return <SanitizedMember>{
      ...sanitizedUser,
      userGroup: member.userGroup,
    };
  });

  return room;
});
