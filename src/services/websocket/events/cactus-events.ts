import { EventEmitter } from "events";
import { User } from "../../../models/user";

type CactusEvent = "Connection" | "Close" | "RoomJoin" | "IceCandidate";
type Payload = { event: CactusEvent; data: object | string };

export declare interface CactusEventEmitter extends EventEmitter {
  on(event: CactusEvent, callback: (from: User, payload: Payload) => void);
}
