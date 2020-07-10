import { WebSocketService } from "./websocket.service";
import { CactusEventEmitter } from "./events/cactus-events";
import * as http from "http";
import * as https from "https";
import * as WebSocket from "ws";
import { UserModel as users } from "../../database/UserSchema";
import { User } from "../../models/user";

export class CactusWsService extends WebSocketService<
  WebSocket,
  CactusEventEmitter
> {
  private ws: WebSocket.Server;
  private started = false;

  constructor(
    server: http.Server | https.Server,
    verifyClient: (info, proceed: Function) => any
  ) {
    super();
    this.ws = new WebSocket.Server({
      server,
      verifyClient, // <- User authentication to connect to the WebSocket server
      clientTracking: true,
    });
  }

  listen(): void {
    if (this.started) throw Error("The service has already been started!");

    console.info("[WebSocket] WebSocket service started.");
    this.started = true;

    this.ws.on("connection", async (clientSocket, req) => {
      // TODO: The WebSocket service is coupled with the database (bad practice)
      const user: User | null = await users
        .findOne(<User>{ authUid: req.firebaseUid })
        .catch(() => null);

      if (!user) return;

      // Assigning an ID to the clientSocket
      clientSocket.id = user.id;
      // Adding the current clientSocket to the list of connected clients
      this.clients[user._id] = clientSocket;

      console.info(`[WebSocket] ${req.socket.remoteAddress} connected.`);

      // Emitting the Connection event
      this.emit("Connection", user, null);

      // Any form of data received from the client
      clientSocket.on("message", (message) => {
        const payload = JSON.parse(message);
        this.emit(payload.event, user, payload);
      });

      // When the client closes the connection
      clientSocket.on("close", () => {
        console.info(`[WebSocket] ${req.socket.remoteAddress} disconnected.`);

        // Emitting the Close event
        this.emit("Close", user, null);

        // Removing the current clientSocket from the list of connected clients
        delete this.clients[clientSocket.id];
        delete clientSocket.id;
      });
    });
  }
}
