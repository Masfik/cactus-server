import { Router } from "express";
import { firebaseUser } from "../../middleware/firebase-user";
import { UserModel as users } from "../../database/UserSchema";
import { User } from "../../models/user";
import { signUpValidation } from "./sign-up.middleware";
import { searchValidation } from "./search.middleware";
import { requestValidation } from "./friend-request.middleware";
import { Invitation } from "../../models/invitation";

export const router = Router();

//------------------------------------------------------------------------------
// GET /USER - READ USER DATA
//------------------------------------------------------------------------------

router.get("/", firebaseUser, (req, res) => {
  const { username, id } = req.query;

  if (username === undefined && id === undefined) res.json(res.locals.user);
  else if (username && id /* when two parameters are being used */)
    res.status(400).json({ error: "only one query parameter can be given" });
  else if (username !== undefined)
    users
      .findOne({ username: <string>username })
      .then(res.json)
      .catch(() => res.status(404).json({ error: "user not found" }));
  else if (id !== undefined)
    users
      .findOne({ _id: <string>id })
      .then(res.json)
      .catch(() => res.status(404).json({ error: "user not found" }));
  else res.status(400);
});

//------------------------------------------------------------------------------
// POST /USER - USER CREATION
//------------------------------------------------------------------------------

router.post("/", firebaseUser, signUpValidation, (req, res) => {
  const { id, name, surname, username, email } = req.body;
  const user = { name, surname, username, email };

  users
    .create(<User>{ authUid: id, ...user })
    .then(() => res.status(201).json(user))
    .catch(() => res.status(400));
});

//------------------------------------------------------------------------------
// GET /USER/SEARCH - FIND USERS BY USERNAME
//------------------------------------------------------------------------------

router.get("/search", searchValidation, async (req, res) => {
  const { query } = req.query;

  // Find users by username if the first few characters match some of the records
  const usersFound = await users
    .find({ username: { $regex: `${query}.*` } })
    .catch(() => []);

  res.json(usersFound);
});

//------------------------------------------------------------------------------
// POST /USER/:id/friendRequest - SEND FRIEND REQUEST
//------------------------------------------------------------------------------

router.post(
  "/:id/friendRequest",
  firebaseUser,
  requestValidation,
  async (req, res) => {
    users
      .update(
        { _id: req.params.id },
        {
          $PUSH: {
            invitations: <Invitation>{
              type: "friend",
              user: res.locals.user,
            },
          },
        }
      )
      .then(() => res.status(200))
      .catch(() => res.status(404).json({ error: "user not found" }));
  }
);
