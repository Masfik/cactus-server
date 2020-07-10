import { EventEmitter } from "events";
import { User } from "../../../models/user";

export type CactusEvent = "Connection" | "Close" | "RoomJoin";

export declare interface CactusEventEmitter extends EventEmitter {
  on(event: CactusEvent, callback: (from: User, payload) => void);
}
