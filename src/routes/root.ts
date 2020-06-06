import express from "express";
import { UserModel as users } from "../database/UserSchema";

export const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Cactus");
});

router.post("/register", (_req, res) => {
  users
    .create(_req.body)
    .then(() => res.json({ ok: true }))
    .catch(() =>
      res.status(500).json({ ok: false, error: "something went wrong" })
    );
});
