import { CactusEventEmitter } from "../services/websocket/events/cactus-events";
import { EventEmitter } from "events";

export const genericEventHandler: CactusEventEmitter = new EventEmitter();

genericEventHandler.on("Connection", (ctx, from, payload) =>
  console.info(`[WebSocket] ${from.username} (${payload.data}) connected.`)
);

genericEventHandler.on("Close", (ctx, from, payload) =>
  console.info(`[WebSocket] ${from.username} (${payload.data}) disconnected.`)
);
