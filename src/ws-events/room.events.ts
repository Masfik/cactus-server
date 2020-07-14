import { CactusEventEmitter } from "../services/websocket/events/cactus-events";
import { EventEmitter } from "events";
import { RoomModel as rooms } from "../database/room/RoomSchema";
import { User } from "../models/user";

export const roomEventHandler: CactusEventEmitter = new EventEmitter();

// TODO: use a proper caching system (e.g. Redis)
const onlineUsersRooms: {
  [userId: string]: string; // <- roomId
} = {};

/**
 * Remove user from the room they're currently connected to.
 *
 * @param user
 */
function removeFromCurrentRoom(user: User): Promise<void> {
  return rooms
    .updateOne(
      { _id: onlineUsersRooms[user.id] },
      {
        $pull: {
          viewers: user.id,
        },
      }
    )
    .then(() => {
      delete onlineUsersRooms[user.id];
      console.info(`[WebSocket] ${user.username} left a room.`);
    })
    .catch(console.error);
}

//------------------------------------------------------------------------------
// HANDLING EVENTS
//------------------------------------------------------------------------------

roomEventHandler.on("RoomJoin", async (ctx, from, payload) => {
  const roomId = payload.data as string;

  try {
    // If the user is already connected to a room, remove them.
    if (onlineUsersRooms[from.id]) await removeFromCurrentRoom(from);

    await rooms.updateOne(
      { _id: roomId },
      {
        $push: {
          viewers: from.id,
        },
      }
    );

    onlineUsersRooms[from.id] = roomId;
    console.log(`[WebSocket] ${from.username} joined a room!`);
  } catch (e) {
    console.error(e);
  }
});

roomEventHandler.on("Close", async (ctx, from) => {
  // If the user is connected to a room, remove them.
  if (onlineUsersRooms[from.id]) await removeFromCurrentRoom(from);
});

roomEventHandler.on("IceCandidate", async (ctx, from, payload) => {
  await forwardRTCData(ctx, from, payload);
});

roomEventHandler.on("Offer", async (ctx, from, payload) => {
  await forwardRTCData(ctx, from, payload);
});

roomEventHandler.on("Answer", async (ctx, from, payload) => {
  await forwardRTCData(ctx, from, payload);
});

/**
 * Forwards RTC messages to clients (except the sender).
 *
 * @param ctx
 * @param from
 * @param payload
 */
async function forwardRTCData(ctx, from: User, payload) {
  try {
    const room = await rooms.findById(onlineUsersRooms[from.id]);
    const others = room.viewers.filter((id) => id.toString() !== from.id);

    // TODO: improve typings
    ctx.send(<string[]>(<unknown>others), payload);
    console.info(
      `[WebSocket]${from.username} sent: ${JSON.stringify(payload)}`
    );
    console.info("\n\n");
  } catch (e) {
    console.error(e);
  }
}
