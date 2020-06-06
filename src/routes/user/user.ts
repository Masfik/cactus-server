import express from "express";
import { UserModel as users } from "../../database/UserSchema";

export const router = express.Router();

router.get("/:username?", async (_req, res) => {
  const username = _req.params.username || "your_username",
    user = await users.findOne({ username });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "username not found" });
  }
});
