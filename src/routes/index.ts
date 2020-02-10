import {router as root} from "../routes/root";
import {router as users} from "./users/users";
import {router as rooms} from "./rooms/rooms";
import {Router} from "express";

export const routes = Router()
    .use("/", root)
    .use("/users", users)
    .use("/rooms", rooms);