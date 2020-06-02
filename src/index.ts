import express from "express";
import mongoose from "mongoose";
import { routes } from "./routes";
import { config } from "../config";

const app = express();
const port = config.web.port;
const db = config.database;

// Register routes
app.use(routes);

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
