import express from "express";
import mongoose from "mongoose";
import { routes } from "./routes";
import { config } from "../config";
import {
  firebaseAuthExpress,
  firebaseAuthWS,
} from "./middleware/firebase-auth";
import cors from "cors";
import bodyParser from "body-parser";
import { CactusWsService } from "./services/websocket/cactus-ws.service";
import * as http from "http";

//------------------------------------------------------------------------------
// HTTP SERVER: EXPRESS
//------------------------------------------------------------------------------

const app = express();
const { port } = config.web;
const db = config.database;

// Registering global middleware
app.use(bodyParser.json()); // Parse the body automatically
app.use(cors()); // Accept cors
app.use(firebaseAuthExpress); // Using Firebase Auth
app.use(routes); // Using routes

// Creating an HTTP Server from the Express instance (required for the ws lib)
const httpServer = http.createServer(app);

//------------------------------------------------------------------------------
// WEBSOCKET
//------------------------------------------------------------------------------

const wsServer = new CactusWsService(httpServer, firebaseAuthWS);

// Registering WebSocket event handlers
wsServer.useHandler();

//------------------------------------------------------------------------------
// APP INITIALISATION: Mongoose -> HTTP server -> WebSocket server
//------------------------------------------------------------------------------

mongoose
  .connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((r) => {
    console.info(`[Database] Connected to ${r.connections[0].name}.`);
    httpServer.listen(port, () => {
      console.info(`[Web] Server started on port: ${port}.`);
      wsServer.listen();
    });
  })
  .catch(console.error);
