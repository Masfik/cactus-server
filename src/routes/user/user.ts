import { Response, Router } from "express";
import { firebaseUser } from "../../middleware/firebase-user";
import { UserModel as users } from "../../database/user/UserSchema";
import { RoomModel as rooms } from "../../database/room/RoomSchema";
import { User } from "../../models/user";
import { signUpValidation } from "./sign-up.middleware";
import { searchValidation } from "./search.middleware";
import { requestValidation } from "./friend-request.middleware";
import { Room } from "../../models/room";
import { populateUser } from "./populated-user.middleware";

export const router = Router();

//------------------------------------------------------------------------------
// GET /USER - READ USER DATA
//------------------------------------------------------------------------------

router.get(
  "/",
  firebaseUser,
  populateUser,
  (req, res: Response<User | any>) => {
    const { username, id } = req.query;

    if (username === undefined && id === undefined)
      res.json(res.locals.userPopulated);
    else if (username && id /* when two parameters are being used */)
      res.status(400).json({ error: "only one query parameter can be given" });
    else if (username !== undefined)
      users
        .findOne({ username: <string>username })
        .then((user) => res.json(user.sanitizeUser()))
        .catch(() => res.status(404).json({ error: "user not found" }));
    else if (id !== undefined)
      users
        .findOne({ _id: <string>id })
        .then((user) => res.json(user.sanitizeUser()))
        .catch(() => res.status(404).json({ error: "user not found" }));
    else res.status(400);
  }
);

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

  // Find users by the username if the first few characters match some records
  const usersFound = await users
    .find({ username: { $regex: `${query}.*` } })
    .then((found) => found.map((u) => u.sanitizeUser({ excludeFriends: true })))
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
    // TODO: currently, we automatically add the user as friend.

    const authUser: User = res.locals.user;

    try {
      // Find user and add the authUser as friend
      const user = await users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            friends: authUser.id,
          },
        }
      );

      // Creating a new room
      const room = await rooms.create(<Room>{
        name: `${authUser.name} and ${user.name}`,
        members: [{ user: authUser.id }, { user: user.id }],
      });

      // Adding the user and room to their respective list
      await users.updateOne(
        { _id: authUser.id },
        {
          $push: {
            friends: user.id,
            rooms: room.id,
          },
        }
      );

      // Adding the newly-created room to the room list of the user
      user.rooms.push(room.id);
      await user.save();

      res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "internal server error" });
    }

    // TODO: The invitation system has been disabled temporarily
    /*users
      .updateOne(
        { _id: req.params.id },
        {
          $push: {
            invitations: <Invitation>{
              category: "friend",
              user: res.locals.user.id,
            },
          },
        }
      )
      .then(() => res.status(200).json({ ok: "success!" }))
      .catch(() => res.status(404).json({ error: "user not found" }));*/
  }
);
