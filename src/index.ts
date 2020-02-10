import express from "express";
import mongoose from 'mongoose';
import { routes } from "./routes";
import { config } from "../config";

const app = express();
const port = config.web.port;
const db = config.database;

app.use(routes);

mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async r => {
    console.log(`[Database] Connected to ${r.connections[0].name}`);
    app.listen(port, () => console.log(`[Web] Server started on port: ${port}!`));
}).catch(console.log);
