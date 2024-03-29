import { Router } from "express";
import { UserModel as users } from "../../database/user/UserSchema";
import { RoomModel as rooms } from "../../database/room/RoomSchema";
import { Types } from "mongoose";
import { firebaseUser } from "../../middleware/firebase-user";

export const router = Router();

router.use(firebaseUser);

router.get("/:roomId?", async (req, res) => {
  let roomId = req.params.roomId,
    room;
  if (roomId) {
    const user = await users.getByUUID(res.locals.user.uid);
    const isAuthorized = user.rooms.reduce(
      (a, roomId) => a && roomId === roomId,
      true
    );
    if (!isAuthorized) {
      return res.status(404).json({ error: "room not found" });
    }
  } else {
    roomId = res.locals.user.currentRoom;
    room = await rooms.findOne({ _id: roomId }, "-__v -_id");
  }
  res.json(room);
});

router.post("/:roomId/join", async (req, res) => {
  const roomId = Types.ObjectId(req.params.roomId);
  res.locals.user.currentRoom = roomId;
});
