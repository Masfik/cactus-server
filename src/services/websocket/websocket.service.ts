import { EventEmitter } from "events";
import { User } from "../../models/user";

/**
 * A simple way to identify clients connected.
 * The type T refers to the type of WebSocket client used, and the ID is always
 * a string.
 */
type Clients<T> = {
  [id: string]: T;
};

export type Payload = {
  event: string;
  data: object | string;
};

/**
 * A generic and simple WebSocket service based on events.
 * It can be used with the very minimal ws library or even Socket.IO.
 */
export abstract class WebSocketService<T, U extends EventEmitter> {
  protected handlers: U[] = [];
  // TODO: use a proper caching system (e.g. Redis)
  protected clients: Clients<T> = {};

  /**
   * Where the WS server starts listening to connections.
   */
  abstract listen(): void;

  /**
   * A protected function that emits an event to all registered handlers.
   *
   * @see useHandler
   * @param event
   * @param ctx - The context from which the handler can access {@link send}
   * @param from - The {@link User} who sent the WebSocket message.
   * @param payload - data received from the client.
   */
  protected emit(
    event: string,
    ctx: WebSocketService<T, U>,
    from: User,
    payload: Payload
  ) {
    this.handlers.forEach((handler) => handler.emit(event, ctx, from, payload));
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

  /**
   * Send a message to the specified clients.
   *
   * @param clientIDs
   * @param payload
   */
  abstract send(clientIDs: string[], payload: Payload);
}
