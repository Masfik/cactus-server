import { CactusEventEmitter } from "../services/websocket/events/cactus-events";
import { EventEmitter } from "events";

export const genericEventHandler: CactusEventEmitter = new EventEmitter();

genericEventHandler.on("Connection", (from, payload) =>
  console.info(`[WebSocket] ${from.username} (${payload.data}) connected.`)
);

genericEventHandler.on("Close", (from, payload) =>
  console.info(`[WebSocket] ${from.username} (${payload.data}) disconnected.`)
);
