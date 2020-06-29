import { Router } from "express";
import { firebaseUser } from "../../middlewares/firebase-user";
import { UserModel as users } from "../../database/UserSchema";
import { User } from "../../models/user";

export const router = Router();

router.get("/", firebaseUser, (req, res) => {
  const { username, id } = req.query;

  if (username === null && id === null) {
    res.json(res.locals.user);
  } else if (username && id /* when two parameters are being used */) {
    res.status(400).json({ error: "only one query parameter can be given" });
  } else if (username !== null) {
    users
      .findOne({ username: <string>username })
      .then(res.json)
      .catch(() => res.status(404).json({ error: "user not found" }));
  } else if (id !== null) {
    users
      .findOne({ _id: <string>id })
      .then(res.json)
      .catch(() => res.status(404).json({ error: "user not found" }));
  } else res.status(400);
});

router.post("/", firebaseUser, async (req, res) => {
  if (res.locals.user /* If the user already exists in the database */) {
    res.status(400);
    return;
  }

  const { name, surname, username, email } = req.body;

  if (name && surname && username && email)
    await users
      .create(<User>{ name, surname, username, email })
      .catch(() => res.status(400));
  else res.status(400).json({ error: "invalid json data" });
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
