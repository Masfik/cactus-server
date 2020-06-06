import { router as root } from "../routes/root";
import { router as user } from "./user/user";
import { router as room } from "./room/room";
import { router as profile } from "./profile/profile";
import { Router } from "express";

export const routes = Router()
  .use("/", root)
  .use("/user", user)
  .use("/profile", profile)
  .use("/room", room);
