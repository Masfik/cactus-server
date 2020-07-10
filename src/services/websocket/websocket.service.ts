import { EventEmitter } from "events";
import { User } from "../../models/user";

/**
 * A simple way to identify clients connected.
 * The type T refers to the type of WebSocket client used, and the ID is always
 * a string.
 */
export type Clients<T> = {
  [id: string]: T;
};

/**
 * A generic and simple WebSocket service based on events.
 * It can be used with the very minimal ws library or even Socket.IO.
 */
export abstract class WebSocketService<T, U extends EventEmitter> {
  protected handlers: U[] = [];
  protected clients: Clients<T> = {};

  /**
   * Where the WS server starts listening to connections.
   */
  abstract listen(): void;

  protected emit(event: string, from: User, payload) {
    this.handlers.forEach((handler) => handler.emit(event, from, payload));
  }

  /**
   * Method to register event handlers.
   *
   * The {@link emit} function will notify all handlers registered here.
   *
   * @param handlers - must implement/extend the {@link EventEmitter} interface.
   */
  useHandler(...handlers: U[]) {
    this.handlers.push(...handlers);
  }
}
