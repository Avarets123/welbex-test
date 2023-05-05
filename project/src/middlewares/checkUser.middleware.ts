import { NextFunction, Response } from "express";
import { usersService } from "../../main";
import { ReqWithUser } from "../types/reqWithUser.type";

export const checkUser = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userFromDb = await usersService.findUserById(user.sub);

    if (!userFromDb) {
      res.status(403).json("Unauthorized");
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(403).json("Unauthorized");
  }
};
