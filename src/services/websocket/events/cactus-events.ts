import { EventEmitter } from "events";
import { User } from "../../../models/user";
import { WebSocketService } from "../websocket.service";

type CactusEvent = "Connection" | "Close" | "RoomJoin" | "IceCandidate";
type Payload = { event: CactusEvent; data: object | string };

export declare interface CactusEventEmitter extends EventEmitter {
  on(
    event: CactusEvent,
    callback: (
      ctx: Pick<WebSocketService<any, any>, "send">, // Exposing send() only
      from: User,
      payload: Payload
    ) => void
  );
}
