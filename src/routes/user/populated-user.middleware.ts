import { NextFunction, Request, Response } from "express";

export function populateUser(req: Request, res: Response, next: NextFunction) {
  res.locals.user
    .populate({
      path: "friends",
      populate: {
        path: "friends", // <- populate friends of friends
        select: "-friends", // <- excluding friends of friends of friends (whew)
      },
    })
    .populate({
      path: "rooms",
      populate: {
        path: "members.user",
        select: "-friends", // <- excluding the friends of the members
      },
    })
    .execPopulate()
    .then((user) => {
      // Assigning the sanitized user to res.locals.userPopulated field
      res.locals.userPopulated = user.sanitizeAuthUser();
      next();
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "internal server error" });
    });
}
