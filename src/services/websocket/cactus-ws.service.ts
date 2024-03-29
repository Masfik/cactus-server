import { Payload, WebSocketService } from "./websocket.service";
import { CactusEventEmitter } from "./events/cactus-events";
import * as http from "http";
import * as https from "https";
import * as WebSocket from "ws";
import { UserModel as users } from "../../database/user/UserSchema";
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

    //--------------------------------------------------------------------------
    // CONNECTION: WHEN THE USER CONNECTS TO THE SOCKET
    //--------------------------------------------------------------------------

    this.ws.on("connection", async (clientSocket, req) => {
      // TODO: The WebSocket service is coupled with the database (bad practice)
      const user: User | null = await users
        .findOne(<User>{ authUid: req.firebaseUid })
        .catch(() => null);

      // Closing the connection if the user returned from the DB is null
      if (!user) return clientSocket.close(401, "unauthorized");

      // Assigning an ID to the clientSocket
      clientSocket.id = user.id;
      // Adding the current clientSocket to the list of connected clients
      this.clients[user._id] = clientSocket;

      // Emitting the Connection event (IP as payload)
      this.emit("Connection", this, user, {
        event: "Connection",
        data: req.socket.remoteAddress,
      });

      //------------------------------------------------------------------------
      // MESSAGE: ANY FORM OF DATA
      //------------------------------------------------------------------------

      // Any form of data received from the client
      clientSocket.on("message", (message) => {
        const payload = JSON.parse(message);
        this.emit(payload.event, this, user, payload);
      });

      //------------------------------------------------------------------------
      // CLOSE: WHEN THE USER DISCONNECTS
      //------------------------------------------------------------------------

      // When the client closes the connection
      clientSocket.on("close", () => {
        // Emitting the Close event
        this.emit("Close", this, user, {
          event: "Close",
          data: req.socket.remoteAddress,
        });

        // Removing the current clientSocket from the list of connected clients
        delete this.clients[clientSocket.id];
        delete clientSocket.id;
      });
    });
  }

  send(clientIDs: string[], payload: Payload) {
    clientIDs.forEach((id) => this.clients[id]?.send(JSON.stringify(payload)));
  }
}
