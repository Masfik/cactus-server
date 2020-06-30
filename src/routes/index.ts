import { router as root } from "../routes/root";
import { router as user } from "./user/user";
import { router as room } from "./room/room";
import { Router } from "express";

export const routes = Router()
  .use("/", root)
  .use("/user", user)
  .use("/room", room);
