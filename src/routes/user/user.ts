import { Router } from "express";
import { firebaseUser } from "../../middlewares/firebase-user";
import { UserModel as users } from "../../database/UserSchema";
import { User } from "../../models/user";
import { signUpValidation } from "./sign-up.middleware";
import { searchValidation } from "./search.middleware";

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

router.post("/", firebaseUser, signUpValidation, (req, res) => {
  const { id, name, surname, username, email } = req.body;
  const user = { name, surname, username, email };

  users
    .create(<User>{ authUid: id, ...user })
    .then(() => res.status(201).json(user))
    .catch(() => res.status(400));
});

router.get("/search", searchValidation, async (req, res) => {
  const { query } = req.query;

  // Find users by username if the first few characters match some of the records
  const usersFound = await users
    .find({ username: { $regex: `${query}.*` } })
    .catch(() => []);

  res.json(usersFound);
});
