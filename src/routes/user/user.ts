import { Router } from "express";
import { firebaseUser } from "../../middlewares/firebase-user";
import { UserModel as users } from "../../database/UserSchema";

export const router = Router();

router.use(firebaseUser);

router.get("/:username?", async (req, res) => {
  const { username } = req.params;

  if (username === null) {
    res.status(400);
    return;
  }

  const user = await users.findOne({ username });

  if (user) res.json(user);
  else res.status(404).json({ error: "username not found" });
});

router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (query === null) {
    res.status(400).json({ error: "query parameter is required" });
    return;
  } else if (query.length > 5) {
    res.status(400).json({ error: "username must be at least 5 characters" });
    return;
  }

  // Find users by username if the first few characters match some of the records
  const usersFound = await users.find({ username: { $regex: `${query}.*` } });

  res.json(usersFound || []);
});
