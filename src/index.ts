import express from "express";
import mongoose from "mongoose";
import { routes } from "./routes";
import { config } from "../config";
import { auth } from "express-firebase-middleware";
import { firebaseUser } from "./middlewares/firebase-user";

const app = express();
const port = config.web.port;
const db = config.database;

// Registering middleware
app.use(auth); // Using Firebase auth
app.use(firebaseUser); // Using Firebase User
app.use(routes); // Using routes

// Init global MongoDB connection
mongoose
  .connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async (r) => {
    console.info(`[Database] Connected to ${r.connections[0].name}`);
    app.listen(port, () =>
      console.info(`[Web] Server started on port: ${port}!`)
    );
  })
  .catch(console.error);
