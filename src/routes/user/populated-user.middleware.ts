import { NextFunction, Request, Response } from "express";

export function populateUser(req: Request, res: Response, next: NextFunction) {
  res.locals.user
    .populate({
      path: "friends",
      populate: {
        path: "friends", // <- populate friends of friends
        select: "-friends", // <- excluding the friends of friends of friends
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
      res.locals.userPopulated = user.sanitizeAuthUser();
      next();
    })
    .catch(() => res.status(500).json({ error: "internal server error" }));
}
